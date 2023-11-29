from datetime import datetime
import pytz

from mongodb_migrations.base import BaseMigration


class Migration(BaseMigration):
    def upgrade(self):
        now_date = datetime.now(tz=pytz.utc)
        data_sources_collection = self.db["data-sources"]
        resources_collection = self.db["resources"]

        resources = resources_collection.find({"community_id": {"$exists": True}})

        for resource in resources:
            data_source = {
                "data_source_id": resource["resource_id"],
                "title": resource["title"],
                "description": resource["abstract"],
                "status": "active",
                "created_at": now_date,
            }

            data_sources_collection.insert_one(data_source)

    def downgrade(self):
        self.db["data-sources"].drop()
