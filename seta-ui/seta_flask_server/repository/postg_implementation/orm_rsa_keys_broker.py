# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IRsaKeysBroker
from seta_flask_server.repository.orm_models import RsaKeyOrm


class OrmRsaKeysBroker(implements(IRsaKeysBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def get_rsa_key(self, user_id: str):
        result = self.db.session.query(RsaKeyOrm).filter_by(user_id=user_id).first()

        if result is None:
            return None

        return result.rsa_value

    def set_rsa_key(self, user_id: str, value: str):
        rsa_key = self.db.session.query(RsaKeyOrm).filter_by(user_id=user_id).first()
        now = datetime.now(tz=pytz.utc)

        if rsa_key is None:
            s = RsaKeyOrm(user_id=user_id, rsa_value=value, created_at=now)
            self.db.session.add(s)
        else:
            rsa_key.rsa_value = value
            rsa_key.modified_at = now

        self.db.session.commit()

    def delete_by_user_id(self, user_id: str):
        self.db.session.query(RsaKeyOrm).filter_by(user_id=user_id).delete()
        self.db.session.commit()
