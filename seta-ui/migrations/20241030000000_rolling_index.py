from datetime import datetime
import pytz

from mongodb_migrations.base import BaseMigration

from catalogues.rolling_index_builder import default_rolling_index


class Migration(BaseMigration):
    def upgrade(self):
        now_date = datetime.now(tz=pytz.utc)
        collection = self.db["rolling-indexes"]

        rolling_index = default_rolling_index(now_date)

        storage_indexes = rolling_index.pop("storage")

        collection.insert_one(rolling_index)

        collection.insert_many(storage_indexes)

    def downgrade(self):
        self.db["rolling-indexes"].drop()
