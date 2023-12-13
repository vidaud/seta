from pydantic import ValidationError

from flask import current_app

from seta_flask_server.repository import interfaces
from seta_flask_server.repository import models

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors

def load_annotation_categories(
    annotations: list[models.AnnotationModel], categories_broker: interfaces.IAnnotationCategoriesBroker
):
    """Load categories from database."""

    for annotation in annotations:
        category = None

        if annotation.category_id is not None:
            category = categories_broker.get_by_id(
                annotation.category_id
            )

        if category is None:
            annotation.category_id = models.AnnotationCategoryModel(
                user_id=annotation.category_id
            )
        else:
            annotation.category = category

def build_new_annotation(
    payload: dict, broker: interfaces.IAnnotationsBroker
) -> models.AnnotationModel:
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

    if broker.identifier_exists(annotation.annotation_id):
        has_errors = True
        errors["name"] = "Identifier already exists."

    if broker.label_exists(annotation.label):
        has_errors = True
        errors["label"] = "Label already exists."

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in annotation payload", errors=errors
        )

    return annotation


def build_update_annotation(
    annotation: models.AnnotationModel,
    payload: dict,
    broker: interfaces.IAnnotationsBroker,
) -> models.AnnotationModel:
    """Build annotation object for database update."""

    has_errors = False
    errors = {}

    payload["id"] = annotation.annotation_id

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

    if annotation.label != update_annotation.label:
        if broker.label_exists(update_annotation.label):
            has_errors = True
            errors["label"] = "Label already exists."

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in annotation payload", errors=errors
        )

    return update_annotation
