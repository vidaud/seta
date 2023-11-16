from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto.response_dto import (
    error_model,
    error_fields_model,
    response_message_model,
)

storage_limit_model = Model(
    "StorageLimit",
    {
        "total_files_no": fields.Integer(description="Number of files"),
        "total_storage_gb": fields.Float(description="Storage in GB"),
    },
)

storage_index_model = Model(
    "StorageIndex",
    {
        "name": fields.String(description="Name of the storage index"),
        "is_active": fields.Boolean(description="Active flag"),
    },
)

community_model = Model(
    "IndexedCommunity",
    {
        "community_id": fields.String(description="Community identifier"),
        "title": fields.String(description="Community title"),
        "description": fields.String(description="Community relevant description"),
    },
)

rolling_index_model = Model(
    "RollingIndex",
    {
        "name": fields.String(
            description="Name of the rolling index", attribute="rolling_index_name"
        ),
        "title": fields.String(description="Title"),
        "description": fields.String(description="Description"),
        "is_default": fields.Boolean(description="Is default rolling index?"),
        "is_disabled": fields.Boolean(description="Rolling index disabled?"),
        "storage": fields.List(
            fields.Nested(storage_index_model), description="Storage indexes"
        ),
        "communities": fields.List(
            fields.Nested(community_model),
            description="Indexed communities",
            skip_none=True,
        ),
        "past_communities": fields.List(
            fields.Nested(community_model),
            description="Indexed communities in the past",
            skip_none=True,
        ),
        "limits": fields.Nested(
            storage_limit_model,
            description="Limits for the active storage index",
            skip_none=True,
        ),
    },
)


base_rolling_index_model = Model(
    "BaseRollingIndex",
    {
        "title": fields.String(description="Title", required=True),
        "description": fields.String(description="Description", required=True),
        "limits": fields.Nested(
            storage_limit_model, description="Limits for the active storage index"
        ),
    },
)

communities_field = fields.List(
    fields.String,
    description="Community identifiers assigned to this rolling index",
    required=True,
)

new_rolling_index_model = base_rolling_index_model.clone(
    "NewRollingIndex",
    {
        "name": fields.String(description="Name of the rolling index", required=True),
        "communities": communities_field,
    },
)

update_rolling_index_model = base_rolling_index_model.clone(
    "UpdateRollingIndex",
    {
        "is_disabled": fields.Boolean(
            description="Rolling index disabled?", required=True
        ),
    },
)

community_list_model = Model(
    "CommunityList",
    {"communities": communities_field},
)

ns_models = {
    storage_limit_model.name: storage_limit_model,
    storage_index_model.name: storage_index_model,
    community_model.name: community_model,
    rolling_index_model.name: rolling_index_model,
    new_rolling_index_model.name: new_rolling_index_model,
    update_rolling_index_model.name: update_rolling_index_model,
    error_fields_model.name: error_fields_model,
    error_model.name: error_model,
    response_message_model.name: response_message_model,
    community_list_model.name: community_list_model,
}
