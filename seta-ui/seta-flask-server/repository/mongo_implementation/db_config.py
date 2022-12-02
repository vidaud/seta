from repository.interfaces.config import IDbConfig
from interface import implements
from flask_pymongo import PyMongo

class DbConfig(implements(IDbConfig)):
    def __init__(self, current_app, g) -> None:
        self._current_app = current_app
        self._g = g
        
    def get_db(self):
        """
        Configuration method to return db instance
        """        
        db = getattr(self._g, "_database", None)
        
        if db is None:
            db = self._g._database = PyMongo(self._current_app).db
            
        return db