from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto

data_source_model = Model(
    "DataSource",
    {
        "id": fields.String(
            description="Resource identifier", attribute="data_source_id"
        ),
        "title": fields.String(description="Resource title"),
    },
)

update_model = Model(
    "Unsearchables",
    {
        "dataSourceIds": fields.List(
            fields.String, description="List of data source identifiers"
        )
    },
)

ns_models = {
    data_source_model.name: data_source_model,
    update_model.name: update_model,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
