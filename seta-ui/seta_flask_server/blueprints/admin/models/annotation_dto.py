from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto

annotation_model = Model(
    "Annotation",
    {
        "label": fields.String(description="Label, case sensitive."),
        "color": fields.String(
            description="Hex color. regex=^#(?:[0-9a-fA-F]{3}){1,2}$",
            attribute="color",
        ),
        "category": fields.String(description="Category."),
    },
)

update_annotation_model = Model(
    "AnnotationUpdate",
    {
        "color": fields.String(
            description="Hex color. regex=^#(?:[0-9a-fA-F]{3}){1,2}$"
        ),
        "category": fields.String(description="Category."),
    },
)

annotation_category_model = Model(
    "Category",
    {
        "category": fields.String(description="Category name"),
    },
)

annotation_list = Model(
    "AnnotationList", {"annotations": fields.List(fields.Nested(annotation_model))}
)

ns_models = {
    annotation_model.name: annotation_model,
    update_annotation_model.name: update_annotation_model,
    annotation_category_model.name: annotation_category_model,
    annotation_list.name: annotation_list,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
