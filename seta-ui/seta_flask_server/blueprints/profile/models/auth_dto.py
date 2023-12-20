from flask_restx import Model, fields
from seta_flask_server.infrastructure.dto import response_dto

auth_public_key = Model(
    "RsaPublicKey",
    {"publicKey": fields.String(description="Public RSA key")},
)

ns_models = {
    auth_public_key.name: auth_public_key,
    response_dto.error_fields_model.name: response_dto.error_fields_model,
    response_dto.error_model.name: response_dto.error_model,
    response_dto.response_message_model.name: response_dto.response_message_model,
}
