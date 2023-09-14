from mongodb_migrations.base import BaseMigration


class Migration(BaseMigration):
    def upgrade(self):
        collection = self.db['resources']     
        
        #update all resource adding 'type' property
        filter={"resource_id": {"$exists" : True}, "community_id": {"$exists" : True}}
        update={"$set": {"type": "discoverable" } }
        
        collection.update_many(filter=filter, update=update)


    def downgrade(self):
        collection = self.db['resources']     
        
        #update all resource adding 'type' property
        filter={"resource_id": {"$exists" : True}, "community_id": {"$exists" : True}}
        update={"$unset": {"type": 1} }
        
        collection.update_many(filter=filter, update=update)