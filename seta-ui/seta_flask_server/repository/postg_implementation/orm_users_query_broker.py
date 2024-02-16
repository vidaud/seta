# pylint: disable=missing-function-docstring

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, select

from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUsersQueryBroker

from seta_flask_server.repository.models import SetaUser, AccountInfo
from seta_flask_server.repository.models.filters import filter_users as fu
from seta_flask_server.infrastructure.constants import UserStatusConstants

from seta_flask_server.repository.orm_models import (
    SetaUserOrm,
    RsaKeyOrm,
    ApplicationOrm,
    UserSessionOrm,
)
from .orm_users_broker import OrmUsersBroker


class OrmUsersQueryBroker(implements(IUsersQueryBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

        self.users_broker = OrmUsersBroker(config)

    def get_all(
        self, filter_users: fu.FilterUsers = None, load_scopes: bool = True
    ) -> list[SetaUser]:
        filters = []

        if filter_users and filter_users.status is not None:
            filters.append(SetaUserOrm.status == filter_users.status)
        else:
            filters.append(SetaUserOrm.status != UserStatusConstants.Deleted)

        if filter_users and filter_users.user_type is not None:
            filters.append(SetaUserOrm.user_type == filter_users.user_type)

        users = self.db.session.query(SetaUserOrm.user_id).filter(*filters).all()

        seta_users = []
        for user in users:
            seta_user = self.users_broker.get_user_by_id(
                user_id=user.user_id, load_scopes=load_scopes
            )
            seta_users.append(seta_user)

        return seta_users

    def get_account_details(self) -> list[AccountInfo]:
        users = (
            self.db.session.query(SetaUserOrm.user_id)
            .filter(SetaUserOrm.status != UserStatusConstants.Deleted)
            .all()
        )

        rsa_keys = self.db.session.query(RsaKeyOrm.user_id).all()

        apps = (
            self.db.session.query(
                ApplicationOrm.parent_user_id,
                # pylint: disable-next=not-callable
                func.count(ApplicationOrm.parent_user_id).label("count"),
            )
            .group_by(ApplicationOrm.parent_user_id)
            .all()
        )

        sessions = (
            self.db.session.query(
                UserSessionOrm.user_id,
                # pylint: disable-next=not-callable
                func.max(UserSessionOrm.created_at).label("last_active"),
            )
            .group_by(UserSessionOrm.user_id)
            .all()
        )

        infos = []

        for user in users:
            user_id = user.user_id

            app_count = 0
            for app in apps:
                if user_id == app.parent_user_id:
                    app_count = app.count
                    break

            last_active = None
            for session in sessions:
                if user_id == session.user_id:
                    last_active = session.last_active
                    break

            info = AccountInfo(
                user_id=user_id,
                has_rsa_key=(user_id in rsa_keys),
                applications_count=app_count,
                last_active=last_active,
            )

            infos.append(info)

        return infos

    def get_account_detail(self, user_id: str) -> AccountInfo:

        info = AccountInfo(user_id=user_id)

        info.has_rsa_key = (
            self.db.session.query(RsaKeyOrm).filter_by(user_id=user_id).first()
            is not None
        )

        info.applications_count = self.db.session.scalar(
            # pylint: disable-next=not-callable
            select(func.count()).filter(ApplicationOrm.parent_user_id == user_id)
        )

        user_session = (
            self.db.session.query(
                UserSessionOrm.user_id,
                # pylint: disable-next=not-callable
                func.max(UserSessionOrm.created_at).label("last_active"),
            )
            .filter_by(user_id=user_id)
            .group_by(UserSessionOrm.user_id)
            .first()
        )
        if user_session:
            info.last_active = user_session.last_active

        return info
