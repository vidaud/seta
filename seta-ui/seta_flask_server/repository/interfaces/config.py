from interface import Interface


class IDbConfig(Interface):
    def get_db(self):
        """Create a db object for the database"""
        pass
