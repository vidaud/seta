from mongodb_migrations.base import BaseMigration
from catalogues.scopes_catalogue_builder import ScopesCatalogueBuilder
from catalogues.roles_catalogue_builder import RolesCatalogueBuilder


class Migration(BaseMigration):
    def upgrade(self):
        collection = self.db["catalogues"]

        # drop previous entries
        collection.delete_many(
            {"catalogue": {"$in": ["system-scopes", "data-source-scopes", "app-roles"]}}
        )

        # save scopes
        system_scopes = ScopesCatalogueBuilder.build_system_scopes("system-scopes")
        if system_scopes:
            collection.insert_many(system_scopes)

        data_source_scopes = ScopesCatalogueBuilder.build_data_source_scopes(
            "data-source-scopes"
        )
        if data_source_scopes:
            collection.insert_many(data_source_scopes)

        # save roles
        roles = RolesCatalogueBuilder.build_app_roles("app-roles")
        if roles:
            collection.insert_many(roles)

    def downgrade(self):
        self.db["catalogues"].drop()
