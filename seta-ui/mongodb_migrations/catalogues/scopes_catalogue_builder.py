class ScopesCatalogueBuilder:
    @staticmethod
    def build_system_scopes(catalogue_name: str) -> list:
        """System scopes.

        Example for system scope entry:
            {
                "catalogue": catalogue_name,
                "code": "/seta/data-source/create",
                "name": "Create data source",
                "description": "Create data source having data ownership assigned by default",
                "elevated": True,
            }
        """

        return []

    @staticmethod
    def build_data_source_scopes(catalogue_name: str) -> list:
        """Data source scopes"""

        return [
            {
                "catalogue": catalogue_name,
                "code": "/seta/data-source/owner",
                "name": "Data Owner",
                "description": "Data owner, upload and delete documents permissions.",
            }
        ]
