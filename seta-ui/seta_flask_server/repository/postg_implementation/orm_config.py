from typing import Any
from flask_sqlalchemy import SQLAlchemy
from interface import implements

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.infrastructure.extensions import db


class OrmConfig(implements(IDbConfig)):
    def __init__(self, current_app, g) -> None:
        self._current_app = current_app
        self._g = g

    def get_db(self) -> SQLAlchemy | Any:
        """
        Configuration method to return db instance
        """
        database = getattr(self._g, "_database", None)

        if database is None:
            database = self._g._database = db

        return database
