from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto
from seta_flask_server.infrastructure.dto import datetime_format

category_model = Model(
    "Category",
    {
        "category_id": fields.String(description="Category identifier"),
        "category_name": fields.String(description="Category name"),
    },
)

annotation_model = Model(
    "Annotation",
    {
        "label": fields.String(description="Short label"),
        "color_code": fields.String(description="Annotation color"),
        "category": fields.Nested(
            model=category_model, description="Annotation category", skip_none=True
        ),
    },
)

new_annotation_model = annotation_model.clone(
    "AnnotationNew",
    {"id": fields.String(description="Identifier.")},
)

update_annotation_model = annotation_model.clone(
    "AnnotationUpdate"
)

ns_models = {
    category_model.name: category_model,
    annotation_model.name: annotation_model,
    new_annotation_model.name: new_annotation_model,
    update_annotation_model.name: update_annotation_model,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
