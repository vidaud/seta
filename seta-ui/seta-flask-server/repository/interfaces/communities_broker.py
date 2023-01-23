from interface import Interface

class ICommunitiesBroker(Interface):
    def create(self, json: dict) -> dict:
        pass

    def update(self, json: dict) -> None:
        pass

    def get(self, id) -> dict:
        pass