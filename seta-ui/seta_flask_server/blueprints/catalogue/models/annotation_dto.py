from flask_restx import Model, fields

annotation_model = Model(
    "Annotation",
    {
        "label": fields.String(description="Label, case sensitive."),
        "color": fields.String(description="Hex color."),
        "category": fields.String(description="Identifier."),
    },
)

ns_models = {annotation_model.name: annotation_model}
