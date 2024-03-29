from flask_restx import Model, fields

stats_light_model = Model(
    "LightStats",
    {
        "label": fields.String(description="Display label"),
        "count": fields.Integer(description="Items count"),
        "type": fields.String(description="Stats type"),
    },
)
