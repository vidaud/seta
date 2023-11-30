from pydantic import ValidationError

from flask import current_app

from seta_flask_server.repository import interfaces
from seta_flask_server.repository import models

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors


def load_data_sources_creators(
    data_sources: list[models.DataSourceModel], users_broker: interfaces.IUsersBroker
):
    """Load creators from database."""

    for data_source in data_sources:
        creator = None

        if data_source.creator_id is not None:
            creator = users_broker.get_user_by_id(
                data_source.creator_id, load_scopes=False
            )

        if creator is None:
            data_source.creator = models.UserInfo(
                user_id=data_source.creator_id, full_name="Unknown"
            )
        else:
            data_source.creator = creator.user_info


def build_new_data_source(
    payload: dict, broker: interfaces.IDataSourcesBroker
) -> models.DataSourceModel:
    """Build data source object for database insert."""

    has_errors = False
    errors = {}

    try:
        data_source = models.DataSourceModel(**payload)
    except ValidationError as e:
        has_errors = True
        current_app.logger.debug(e)

        for err in e.errors():
            errors[err["loc"][0]] = err["msg"]

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in data source payload", errors=errors
        )

    if broker.identifier_exists(data_source.data_source_id):
        has_errors = True
        errors["name"] = "Identifier already exists."

    if broker.title_exists(data_source.title):
        has_errors = True
        errors["title"] = "Title already exists."

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in data source payload", errors=errors
        )

    return data_source


def build_update_data_source(
    data_source: models.DataSourceModel,
    payload: dict,
    broker: interfaces.IDataSourcesBroker,
) -> models.DataSourceModel:
    """Build data source object for database update."""

    has_errors = False
    errors = {}

    payload["id"] = data_source.data_source_id

    try:
        update_data_source = models.DataSourceModel(**payload)
    except ValidationError as e:
        has_errors = True
        current_app.logger.debug(e)

        for err in e.errors():
            errors[err["loc"][0]] = err["msg"]

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in data source payload", errors=errors
        )

    if data_source.title != update_data_source.title:
        if broker.title_exists(update_data_source.title):
            has_errors = True
            errors["title"] = "Title already exists."

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in data source payload", errors=errors
        )

    return update_data_source
