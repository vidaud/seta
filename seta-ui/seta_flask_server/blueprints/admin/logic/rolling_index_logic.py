from datetime import datetime
import pytz

from flask import current_app

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors
from seta_flask_server.repository.models import (
    RollingIndex,
    StorageLimits,
    StorageIndex,
)
from seta_flask_server.repository import interfaces


def build_rolling_indexes(
    index_broker: interfaces.IRollingIndexBroker,
    communities_broker: interfaces.ICommunitiesBroker,
) -> list[RollingIndex]:
    """Build rolling indexes response."""

    rolling_indexes = index_broker.get_all()

    for rolling_index in rolling_indexes:
        communities = communities_broker.get_all_by_ids(ids=rolling_index.community_ids)

        if communities:
            rolling_index.communities = communities

        past_communities = communities_broker.get_all_by_ids(
            ids=rolling_index.past_community_ids
        )
        if past_communities:
            rolling_index.past_communities = past_communities

        return rolling_indexes


def build_new_rolling_index(
    payload: dict, index_broker: interfaces.IRollingIndexBroker
) -> RollingIndex:
    """Build rolling index object for database insert."""

    has_errors = False
    errors = {}

    if index_broker.name_exists(payload["name"]):
        has_errors = True
        errors["name"] = "Rolling name already exists."

    if index_broker.title_exists(payload["title"]):
        has_errors = True
        errors["title"] = "Rolling title already exists."

    if not payload.get("communities"):
        has_errors = True
        errors["communities"] = "Provide at least one community identifier."
    else:
        community_errors = _community_list_errors(
            index_broker=index_broker, communities=payload["communities"]
        )

        if community_errors:
            has_errors = True
            errors.update(community_errors)

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in rolling index payload", errors=errors
        )

    now_date = datetime.now(tz=pytz.utc)

    rolling_index = RollingIndex(
        rolling_index_name=payload["name"],
        title=payload["title"],
        description=payload["description"],
        is_default=False,
        is_disabled=False,
        community_ids=payload["communities"],
        created_at=now_date,
    )

    storage_index_name = StorageIndex.get_name(
        prefix=rolling_index.rolling_index_name, sequence=1
    )
    storage_index = StorageIndex(
        name=storage_index_name,
        parent=rolling_index.rolling_index_name,
        sequence=1,
        is_active=True,
        created_at=now_date,
    )
    rolling_index.storage = [storage_index]

    limits = payload.get("limits")
    if limits:
        rolling_index.limits = StorageLimits.from_db_json(limits)
    else:
        rolling_index.limits = StorageLimits(
            total_storage_gb=current_app.config.get(
                "ROLLING_INDEX_DEFAULT_STORAGE", 100
            )
        )

    return rolling_index


def build_update_rolling_index(
    rolling_index_name: str, payload: dict, index_broker: interfaces.IRollingIndexBroker
) -> RollingIndex:
    """Build rolling index object for database update."""

    has_errors = False
    errors = {}

    if index_broker.title_exists(
        rolling_index_title=payload["title"], except_name=rolling_index_name
    ):
        has_errors = True
        errors["title"] = "Title already exists for another rolling index."

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in rolling index payload", errors=errors
        )

    rolling_index = RollingIndex(
        rolling_index_name=rolling_index_name,
        title=payload["title"],
        description=payload["description"],
        is_disabled=payload["is_disabled"],
    )

    limits = payload.get("limits")
    if limits:
        rolling_index.limits = StorageLimits.from_db_json(limits)

    return rolling_index


def validate_community_list(
    index_broker: interfaces.IRollingIndexBroker,
    communities: list[str],
    rolling_index_name: str,
) -> bool:
    """Validates community list."""

    has_errors = False
    errors = {}

    community_errors = _community_list_errors(
        index_broker=index_broker,
        communities=communities,
        rolling_index_name=rolling_index_name,
    )

    if community_errors:
        has_errors = True
        errors.update(community_errors)

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in community list.", errors=errors
        )

    return True


def _community_list_errors(
    index_broker: interfaces.IRollingIndexBroker,
    communities: list[str],
    rolling_index_name: str = None,
) -> list[dict]:
    """Validates if community id is already assigned to another rolling index."""

    errors = {}

    for community_id in communities:
        ri_name = index_broker.get_assigned_index(community_id)
        if (ri_name is not None and rolling_index_name is None) or (
            ri_name is not None
            and rolling_index_name is not None
            and ri_name != rolling_index_name
        ):
            errors[
                f"communities.{community_id}"
            ] = f"Community already assigned to {ri_name} rolling index."

    return errors
