from flask_restx import Model, fields

error_message = fields.Wildcard(fields.String)
error_fields_model = Model("ErrorFields", {"*": error_message})
error_model = Model(
    "BadRequestMessage",
    {
        "message": fields.String(description="Error message"),
        "errors": fields.Nested(error_fields_model),
    },
)

response_message_model = Model(
    "GenericResponseMessage",
    {
        "status": fields.String(
            description="Response status", enum=["success", "fail"]
        ),
        "message": fields.String(description="Response message"),
    },
)
