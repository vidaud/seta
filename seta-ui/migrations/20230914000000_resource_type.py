from mongodb_migrations.base import BaseMigration


class Migration(BaseMigration):
    def upgrade(self):
        collection = self.db["resources"]

        # update all resource adding 'type' property
        fq = {"resource_id": {"$exists": True}, "community_id": {"$exists": True}}
        upd = {"$set": {"type": "discoverable"}}

        collection.update_many(filter=fq, update=upd)

    def downgrade(self):
        collection = self.db["resources"]

        # update all resource adding 'type' property
        fq = {"resource_id": {"$exists": True}, "community_id": {"$exists": True}}
        upd = {"$unset": {"type": 1}}

        collection.update_many(filter=fq, update=upd)
