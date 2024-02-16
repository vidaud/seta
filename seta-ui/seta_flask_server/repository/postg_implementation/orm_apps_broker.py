# pylint: disable=missing-function-docstring

from datetime import datetime
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IAppsBroker
from seta_flask_server.repository.models import (
    SetaApplication,
    SetaUserExt,
)
from seta_flask_server.infrastructure.constants import (
    UserStatusConstants,
    ExternalProviderConstants,
    UserType,
)

from seta_flask_server.repository.orm_models import (
    ApplicationOrm,
    SetaUserOrm,
    ExternalProviderOrm,
    RsaKeyOrm,
)

from .orm_users_broker import from_orm_model as user_from_orm_model


class OrmAppsBroker(implements(IAppsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def get_all_by_parent_id(self, parent_id: str) -> list[SetaApplication]:
        apps = (
            self.db.session.query(ApplicationOrm)
            .filter_by(parent_user_id=parent_id)
            .all()
        )

        if not apps:
            return []

        seta_apps = [from_orm_model(app) for app in apps]

        users = (
            self.db.session.query(SetaUserOrm)
            .filter(SetaUserOrm.user_id.in_([app.user_id for app in seta_apps]))
            .all()
        )

        for sa in seta_apps:
            r = next((u for u in users if u.user_id == sa.user_id), None)
            if r is not None:
                sa.user = user_from_orm_model(r)

        return seta_apps

    def get_by_name(self, name: str) -> SetaApplication:
        app = self.db.session.query(ApplicationOrm).filter_by(name=name).first()

        if app is None:
            return None

        return self._build_seta_app(app)

    def get_by_parent_and_name(self, parent_id: str, name: str) -> SetaApplication:
        app = (
            self.db.session.query(ApplicationOrm)
            .filter_by(parent_user_id=parent_id, name=name)
            .first()
        )

        if app is None:
            return None

        return self._build_seta_app(app)

    def app_exists(self, name: str) -> bool:
        app = self.db.session.query(ApplicationOrm).filter_by(name=name).first()

        return app is not None

    def get_by_user_id(self, user_id: str) -> SetaApplication:
        app = self.db.session.query(ApplicationOrm).filter_by(user_id=user_id).first()

        if app is None:
            return None

        return self._build_seta_app(app)

    def create(
        self,
        app: SetaApplication,
        copy_parent_rsa: bool = False,
    ):
        # double check the name uniqueness
        if self.app_exists(name=app.app_name):
            return

        now = datetime.now(tz=pytz.utc)
        app.user_id = SetaUserExt.generate_uuid()

        orm_rsa_key = None

        if copy_parent_rsa:
            parent_rsa_key = (
                self.db.session.query(RsaKeyOrm)
                .filter_by(user_id=app.parent_user_id)
                .first()
            )
            orm_rsa_key = RsaKeyOrm(
                user_id=app.user_id,
                rsa_value=parent_rsa_key.rsa_value,
                created_at=now,
                modified_at=None,
            )

        orm_app = to_orm_model(app)

        self.db.session.add(
            SetaUserOrm(
                user_id=app.user_id,
                email=f"{app.app_name}@no-email.org",
                user_type=UserType.Application,
                status=UserStatusConstants.Active,
                created_at=now,
                modified_at=None,
            )
        )

        self.db.session.flush()

        self.db.session.add(
            ExternalProviderOrm(
                user_id=app.user_id,
                provider=ExternalProviderConstants.SETA.lower(),
                provider_uid=app.app_name.lower(),
                first_name=None,
                last_name=None,
                domain=ExternalProviderConstants.SETA.lower(),
            )
        )

        if orm_rsa_key is not None:
            self.db.session.add(orm_rsa_key)

        self.db.session.add(orm_app)

        self.db.session.commit()

    def update(self, old: SetaApplication, new: SetaApplication):
        if not new.app_name:
            new.app_name = old.app_name

        new.app_name = new.app_name.lower()

        if new.app_name != old.app_name.lower():
            # double check the name uniqueness
            if self.app_exists(name=new.app_name):
                return

        app = self.db.session.query(ApplicationOrm).filter_by(name=old.app_name).first()

        app.name = new.app_name
        app.description = new.app_description

        if new.status:
            user = (
                self.db.session.query(SetaUserOrm)
                .filter_by(user_id=old.user_id)
                .first()
            )
            user.status = new.status
            user.modified_at = datetime.now(tz=pytz.utc)

        self.db.session.commit()

    def delete(self, parent_id: str, name: str):
        app = self.get_by_parent_and_name(parent_id=parent_id, name=name)

        if app is not None:
            self.db.session.query(RsaKeyOrm).filter_by(user_id=app.user_id).delete()

            self.db.session.query(ExternalProviderOrm).filter_by(
                user_id=app.user_id
            ).delete()

            self.db.session.query(ApplicationOrm).filter_by(name=name).delete()

            self.db.session.query(SetaUserOrm).filter_by(user_id=app.user_id).delete()

            self.db.session.commit()

    def _build_seta_app(self, app: ApplicationOrm) -> SetaApplication:
        seta_app = from_orm_model(app)

        user = self.db.session.query(SetaUserOrm).filter_by(user_id=app.user_id).first()

        if user is not None:
            seta_app.user = user_from_orm_model(user)

        return seta_app


def to_orm_model(application: SetaApplication) -> ApplicationOrm:
    return ApplicationOrm(
        user_id=application.user_id,
        name=application.app_name,
        description=application.app_description,
        parent_user_id=application.parent_user_id,
    )


def from_orm_model(orm_model: ApplicationOrm) -> SetaApplication:
    return SetaApplication(
        user_id=orm_model.user_id,
        app_name=orm_model.name,
        app_description=orm_model.description,
        parent_user_id=orm_model.parent_user_id,
    )
