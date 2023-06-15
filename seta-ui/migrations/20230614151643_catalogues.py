from mongodb_migrations.base import BaseMigration
from catalogues.scopes_catalogue_builder import ScopesCatalogueBuilder
from catalogues.roles_catalogue_builder import RolesCatalogueBuilder

class Migration(BaseMigration):
    def upgrade(self):
        collection = self.db['catalogues']        
        
        #drop prevoius entries
        collection.delete_many({"catalogue": {"$in": ["system-scopes", 
                                                      "community-scopes", 
                                                      "resource-scopes",
                                                      "app-roles",
                                                      "community-roles"]
                                }})

        #save scopes 
        collection.insert_many(ScopesCatalogueBuilder.build_system_scopes("system-scopes"))

        collection.insert_many(ScopesCatalogueBuilder.build_community_scopes("community-scopes"))

        collection.insert_many(ScopesCatalogueBuilder.build_resource_scopes("resource-scopes"))

        #save roles
        collection.insert_many(RolesCatalogueBuilder.build_app_roles("app-roles"))

        collection.insert_many(RolesCatalogueBuilder.build_community_roles("community-roles"))


    def downgrade(self):
        self.db['catalogues'].drop()

