from http import HTTPStatus
from requests import HTTPError
from pydantic import ValidationError

from flask import current_app

from seta_flask_server.repository import interfaces
from seta_flask_server.repository import models

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors
from seta_flask_server.infrastructure.clients import admin_client


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


def load_data_sources_scopes(
    data_sources: list[models.DataSourceModel],
    scopes_broker: interfaces.IDataSourceScopesBroker,
    users_broker: interfaces.IUsersBroker,
):
    """Load data sources scopes from database."""

    scopes = scopes_broker.get_all()

    for data_source in data_sources:
        ds_scopes = list(
            filter(
                lambda s, id=data_source.data_source_id: s.data_source_id == id, scopes
            )
        )

        if ds_scopes:
            for scope in ds_scopes:
                if data_source.creator_id is not None:
                    user = users_broker.get_user_by_id(scope.user_id, load_scopes=False)

                    if user is None:
                        scope.user = models.UserInfo(
                            user_id=scope.user_id, full_name="Unknown"
                        )
                    else:
                        scope.user = user.user_info

            data_source.scopes = ds_scopes


def build_new_data_source(
    payload: dict, broker: interfaces.IDataSourcesBroker
) -> models.DataSourceModel:
    """Build data source object for database insert."""

    has_errors = False
    errors = {}

    try:
        data_source = models.DataSourceModel(**payload)

        data_source.search_index = models.SearchIndexModel(
            name=payload["index"],
        )
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


def build_data_source_scopes(
    data_source_id: str, payload: dict
) -> list[models.DataSourceScopeModel]:
    """Build the list of scopes from payload."""

    if not payload or not payload.get("scopes"):
        return None

    scopes = []
    has_errors = False
    errors = {}

    scopes_payload = payload["scopes"]

    try:
        for scope in scopes_payload:
            scope["data_source_id"] = data_source_id
            scopes.append(models.DataSourceScopeModel(**scope))

    except ValidationError as e:
        has_errors = True
        current_app.logger.debug(e)

        for err in e.errors():
            errors[err["loc"][0]] = err["msg"]

    if has_errors:
        raise PayloadErrors(
            message="Errors encountered in data source payload", errors=errors
        )

    return scopes


def build_index_model(payload: dict) -> models.SearchIndexModel:
    """Build search index object for database insert."""

    has_errors = False
    errors = {}

    try:
        index = models.SearchIndexModel(**payload)
    except ValidationError as e:
        has_errors = True
        current_app.logger.debug(e)

        for err in e.errors():
            errors[err["loc"][0]] = err["msg"]

    if has_errors:
        raise PayloadErrors(message="Errors encountered in the payload", errors=errors)

    return index


def create_index_model(
    index: models.SearchIndexModel,
    broker: interfaces.ISearchIndexesBroker,
    ignore_exists=False,
):
    """Creates index in Search engine and store in in database.

    Args:
       index: search index object.
       broker: repository broker.
       ignore_exists: Do nothing if the index already exists in the database.
    """

    if broker.index_name_exists(index.index_name):
        if ignore_exists:
            return

        msg = "Index name already exists."
        raise PayloadErrors(msg, errors={"name": msg})

    try:
        client = admin_client.AdminIndexesClient()
        client.create(index.index_name)
    except HTTPError as e:
        #! ignore error if index already exists in the Search engine
        if e.response.status_code == int(HTTPStatus.CONFLICT):
            current_app.logger.info(
                "The index '%s' already exists in Search engine.", index.index_name
            )

    broker.create(index)
