from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import datetime_format


category_model = Model(
    "AnnotationCategory",
    {
        "category_id": fields.String(description="Category identifier of the annotation."),
        "category_name": fields.String(description="Category name within the annotation.")
    },
)

annotations_model = Model(
    "Annotation",
    {
        "id": fields.String(description="Identifier.", attribute="annotation_id"),
        "label": fields.String(description="Short title"),
        "color_code": fields.String(description="Annotation color code"),
        "category": fields.Nested(
            model=category_model, description="Annotation category", skip_none=True
        )
    },
)

ns_models = {
    category_model.name: category_model,
    annotations_model.name: annotations_model,
}
