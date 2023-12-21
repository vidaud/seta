from flask_restx import Model, fields

notification_model = Model(
    "Notification",
    {
        "label": fields.String(description="Notification title"),
        "description": fields.String(description="Notification details"),
        "count": fields.Integer(description="Number of notifications"),
        "type": fields.String(description="Notification type"),
        "priority": fields.Integer(
            description="Notification priority, 0 is the highest priority"
        ),
    },
)
