"""Base broker for all subsequent interfaces."""
from interface import Interface


class IBroker(Interface):
    """Base broker interface"""

    def __init__(self, db) -> None:
        super().__init__()

        self.db = db
