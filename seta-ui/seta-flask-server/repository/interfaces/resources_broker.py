from interface import Interface

class IResourcesBroker(Interface):
    def create(self, json: dict) -> dict:
        pass

    def update(self, json: dict) -> None:
        pass

    def get(self, id) -> dict:
        pass