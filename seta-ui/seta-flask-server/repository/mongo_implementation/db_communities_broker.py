from interface import implements

from injector import inject
from repository.interfaces.config import IDbConfig

from repository.interfaces.communities_broker import ICommunitiesBroker

class CommunitiesBroker(implements(ICommunitiesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()

    def create(self, json: dict) -> dict:
        pass

    def update(self, json: dict) -> None:
        pass

    def get(self, id) -> dict:
        pass