import timeit
import sqlalchemy as db
from pymongo import MongoClient, database

from icecream import ic

from src.config import Config
from src.postg import (
    import_users,
    import_providers,
    import_rsa_keys,
    import_claims,
    import_search_indexes,
    import_data_sources,
    import_data_source_scopes,
    import_sessions,
    import_session_tokens,
    import_profile,
    import_annotations,
    import_library,
    import_applications,
)

config = Config()


def get_mongo_db() -> database.Database:
    """Get a mongo database instance"""

    client = MongoClient(config.MONGODB_HOST, config.MONGODB_PORT)
    return client[config.DB_NAME]


def get_postg_engine():
    """Get a postgres engine instance"""

    return db.create_engine(
        f"postgresql://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}:{config.POSTGRES_PORT}/{config.DB_NAME}"
    )


if __name__ == "__main__":

    mongo_db = get_mongo_db()
    postg_engine = get_postg_engine()

    execution_time = timeit.timeit(lambda: None, number=1)

    users = list(mongo_db["users"].find({"email": {"$exists": 1}}))
    import_users.bulk_insert(postg_engine, users)

    providers = list(mongo_db["users"].find({"provider": {"$exists": 1}}))
    import_providers.bulk_insert(postg_engine, providers)

    rsa_keys = list(mongo_db["users"].find({"rsa_value": {"$exists": 1}}))
    import_rsa_keys.bulk_insert(postg_engine, rsa_keys)

    claims = list(mongo_db["users"].find({"claim_type": {"$exists": 1}}))
    import_claims.bulk_insert(postg_engine, claims)

    indexes = list(mongo_db["search-indexes"].find({}))
    import_search_indexes.bulk_insert(postg_engine, indexes)

    data_sources = list(
        mongo_db["data-sources"].find({"data_source_id": {"$exists": 1}})
    )
    import_data_sources.bulk_insert(postg_engine, data_sources)

    data_source_scopes = list(mongo_db["data-source-scopes"].find({}))
    import_data_source_scopes.bulk_insert(postg_engine, data_source_scopes)

    sessions = list(mongo_db["sessions"].find({"user_id": {"$exists": 1}}))
    import_sessions.bulk_insert(postg_engine, sessions)

    session_tokens = list(mongo_db["sessions"].find({"token_jti": {"$exists": True}}))
    import_session_tokens.bulk_import(postg_engine, session_tokens)

    profiles = list(mongo_db["user-profile-unsearchables"].find({}))
    import_profile.bulk_insert(postg_engine, profiles)

    annotations = list(mongo_db["annotations"].find({}))
    import_annotations.bulk_insert(postg_engine, annotations)

    libraries = list(mongo_db["library"].find({}))
    import_library.bulk_insert(postg_engine, libraries)

    applications = list(mongo_db["users"].find({"app_name": {"$exists": 1}}))
    import_applications.bulk_insert(postg_engine, applications)

    ic(f"Execution time: {execution_time} seconds")
