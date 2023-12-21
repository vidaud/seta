from seta_flask_server.repository.models import DataSourceScopeEnum
from seta_flask_server.repository.interfaces import (
    IDataSourcesBroker,
    IDataSourceScopesBroker,
    IUserProfileUnsearchables,
)


def get_data_source_permissions(
    user_id: str,
    data_sources_broker: IDataSourcesBroker,
    scopes_broker: IDataSourceScopesBroker,
    profile_broker: IUserProfileUnsearchables,
) -> dict:
    """Build data sources permissions."""

    permissions = {"ownership": [], "view": []}

    data_sources = data_sources_broker.get_all(active_only=True)
    user_scopes = scopes_broker.get_by_user_id(user_id)
    unsearchables = profile_broker.get_unsearchables(user_id)

    for data_source in data_sources:
        data_source_id = data_source.data_source_id

        if not unsearchables or not any(
            ds_id.lower() == data_source_id for ds_id in unsearchables
        ):
            permissions["view"].append(
                {
                    "resource_id": data_source_id,
                    "index": data_source.index_name,
                }
            )

        if any(
            scope.data_source_id == data_source_id
            and scope.scope == DataSourceScopeEnum.DATA_OWNER
            for scope in user_scopes
        ):
            permissions["ownership"].append(
                {
                    "resource_id": data_source_id,
                    "index": data_source.index_name,
                }
            )

    return permissions
