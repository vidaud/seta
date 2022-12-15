from interface import Interface

class IBroker(Interface):
    def __init__(self, db) -> None:
       self.db = db