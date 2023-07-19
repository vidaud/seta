from flask_restx import Model, fields

from seta_flask_server.infrastructure.constants import NotificationTypeConstants

notification_model = Model("Notification", {
    "label": fields.String(description="Notification title"),
    "description": fields.String(description="Notification details"),
    "count": fields.Integer(description="Number of notifications"),
    "type": fields.String(description="Notification type", enum=NotificationTypeConstants.List),
    "priority": fields.Integer(description="Notification priority, 0 is the highest priority")
})