from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto
from seta_flask_server.infrastructure.dto import datetime_format

from seta_flask_server.infrastructure.constants import DataSourceStatusConstants

from seta_flask_server.repository.models import DataSourceScopeEnum

user_info_model = Model(
    "User Info",
    {
        "id": fields.String(
            description="Internal user identifier", attribute="user_id"
        ),
        "fullName": fields.String(description="Full name", attribute="full_name"),
    },
)

contact_model = Model(
    "DataSourceContact",
    {
        "email": fields.String(
            description="Email address of the organisation.", required=True
        ),
        "person": fields.String(
            description="Person name within the organisation.", required=True
        ),
        "website": fields.String(
            description="Website address of the data source.", required=True
        ),
    },
)

status_field = fields.String(
    description="Status",
    enum=[
        DataSourceStatusConstants.ACTIVE,
        DataSourceStatusConstants.ARCHIVED,
    ],
)

data_source_scope_model = Model(
    "DataSourceScope",
    {
        "user": fields.Nested(
            model=user_info_model, description="User", skip_none=True
        ),
        "scope": fields.String(
            description="Scope", enum=[DataSourceScopeEnum.DATA_OWNER]
        ),
    },
)

update_data_source_scope_model = Model(
    "DataSourceScopeUpdate",
    {
        "user_id": fields.String(description="User identifier"),
        "scope": fields.String(
            description="Scope", enum=[DataSourceScopeEnum.DATA_OWNER]
        ),
    },
)

replace_data_source_scopes_model = Model(
    "ReplaceDataSourceScopes",
    {
        "scopes": fields.List(
            fields.Nested(model=update_data_source_scope_model),
            description="Scopes",
            skip_none=True,
        ),
    },
)


data_source_model = Model(
    "DataSource",
    {
        "title": fields.String(
            description="Unique short title. min_length=3, max_length=200",
            required=True,
        ),
        "description": fields.String(
            description="Long text description. min_length=5, max_length=5000",
            required=True,
        ),
        "organisation": fields.String(description="Organisation owner", required=True),
        "themes": fields.List(
            fields.String(), description="Domains of application.", required=True
        ),
        "contact": fields.Nested(
            model=contact_model,
            description="Contact channels",
            required=True,
            skip_none=True,
        ),
    },
)

view_data_source_model = data_source_model.clone(
    "DataSourceView",
    {
        "id": fields.String(description="Identifier.", attribute="data_source_id"),
        "creator": fields.Nested(
            model=user_info_model, description="Creator", skip_none=True
        ),
        "status": status_field,
        "index": fields.String(description="Search index name", attribute="index_name"),
        "created": datetime_format.DateISOFormat(
            "Creation date in SeTA system.", attribute="created_at"
        ),
        "scopes": fields.List(
            fields.Nested(model=data_source_scope_model),
            description="Scopes",
            skip_none=True,
        ),
    },
)

new_data_source_model = data_source_model.clone(
    "DataSourceNew",
    {
        "id": fields.String(
            description="Unique identifier. min_length=3, max_length=100", required=True
        ),
        "index": fields.String(
            # pylint: disable-next=W1401
            description="Index name. min_length=3,  max_length=200,  regex=^[a-zA-Z0-9][a-zA-Z0-9_\-]*$.",
            attribute="index_name",
            required=True,
        ),
    },
)

update_data_source_model = data_source_model.clone(
    "DataSourceUpdate",
    {"status": status_field},
)

view_search_index_model = Model(
    "SearchIndexView",
    {
        "name": fields.String("Index name.", attribute="index_name"),
        "created": datetime_format.DateISOFormat(
            "Creation date in SeTA system.", attribute="created_at"
        ),
    },
)

new_search_index_model = Model(
    "SearchIndexNew",
    {"name": fields.String("Index name.", attribute="index_name")},
)

ns_models = {
    contact_model.name: contact_model,
    user_info_model.name: user_info_model,
    data_source_scope_model.name: data_source_scope_model,
    update_data_source_scope_model.name: update_data_source_scope_model,
    replace_data_source_scopes_model.name: replace_data_source_scopes_model,
    view_data_source_model.name: view_data_source_model,
    new_data_source_model.name: new_data_source_model,
    update_data_source_model.name: update_data_source_model,
    view_search_index_model.name: view_search_index_model,
    new_search_index_model.name: new_search_index_model,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
