from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto
from seta_flask_server.infrastructure.dto import datetime_format

from seta_flask_server.infrastructure.constants import DataSourceStatusConstants

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
        "email": fields.String(description="Email address of the organisation."),
        "person": fields.String(description="Person name within the organisation."),
        "website": fields.String(description="Website address of the data source."),
    },
)

status_field = fields.String(
    description="Status",
    enum=[
        DataSourceStatusConstants.ACTIVE,
        DataSourceStatusConstants.ARCHIVED,
    ],
)

data_source_model = Model(
    "DataSource",
    {
        "title": fields.String(description="Short title"),
        "description": fields.String(description="Long text description"),
        "organisation": fields.String(description="Organisation owner"),
        "theme": fields.String(description="Domain of application"),
        "contact": fields.Nested(
            model=contact_model, description="Contact channels", skip_none=True
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
        "created": datetime_format.DateISOFormat(
            "Creation date in SeTA system.", attribute="created_at"
        ),
    },
)

new_data_source_model = data_source_model.clone(
    "DataSourceNew",
    {"id": fields.String(description="Identifier.")},
)

update_data_source_model = data_source_model.clone(
    "DataSourceUpdate",
    {"status": status_field},
)

ns_models = {
    contact_model.name: contact_model,
    user_info_model.name: user_info_model,
    update_data_source_model.name: update_data_source_model,
    view_data_source_model.name: view_data_source_model,
    new_data_source_model.name: new_data_source_model,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
