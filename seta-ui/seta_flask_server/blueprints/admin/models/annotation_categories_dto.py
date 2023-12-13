from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto
from seta_flask_server.infrastructure.dto import datetime_format

annotation_category_model = Model(
    "Category",
    {
        "category_id": fields.String(description="Category identifier"),
        "category_name": fields.String(description="Category name"),
    },
)



ns_models = {
    annotation_category_model.name: annotation_category_model,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
