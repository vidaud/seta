from mongodb_migrations.base import BaseMigration
from catalogues.fields_catalogue_builder import FieldsCatalogueBuilder


class Migration(BaseMigration):
    def upgrade(self):  

        collection = self.db['catalogues']    
        
        #drop previous entries
        self._delete_fields()

        #save scopes 
        collection.insert_many(FieldsCatalogueBuilder.build_fields("fields"))


    def downgrade(self):
        self._delete_fields()

    def _delete_fields(self):
        '''drop fields entries form catalogues collection'''

        self.db['catalogues'].delete_many({"catalogue": "fields"})