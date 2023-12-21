from pydantic import ValidationError
from flask import current_app

from seta_flask_server.repository import models
from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors


def build_new_annotation(payload: dict) -> models.AnnotationModel:
    """Build annotation object for database insert."""

    has_errors = False
    errors = {}

    try:
        annotation = models.AnnotationModel(**payload)
    except ValidationError as e:
        has_errors = True
        current_app.logger.debug(e)

        for err in e.errors():
            errors[err["loc"][0]] = err["msg"]

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in annotation payload", errors=errors
        )

    return annotation


def build_update_annotation(payload: dict) -> models.AnnotationModel:
    """Build annotation object for database update."""

    has_errors = False
    errors = {}

    try:
        update_annotation = models.AnnotationModel(**payload)
    except ValidationError as e:
        has_errors = True
        current_app.logger.debug(e)

        for err in e.errors():
            errors[err["loc"][0]] = err["msg"]

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in annotation payload", errors=errors
        )

    return update_annotation
