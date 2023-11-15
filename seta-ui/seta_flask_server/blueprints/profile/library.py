from http import HTTPStatus
from injector import inject

from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository import interfaces

from .models.library_dto import library_model, library_items, update_item_parser
from .logic.library_logic import (
    parse_args_new_library_items,
    get_library_tree,
    parse_args_update_library_item,
)

library_ns = Namespace("Library", validate=False, description="SETA User Library")
library_ns.models[library_model.name] = library_model
library_ns.models[library_items.name] = library_items


@library_ns.route("/library", endpoint="library_tree", methods=["GET", "POST"])
class LibraryItemsResource(Resource):
    """Get a list of library items of the authorized user and expose POST for new application"""

    @inject
    def __init__(
        self,
        library_broker: interfaces.ILibraryBroker,
        users_broker: interfaces.IUsersBroker,
        *args,
        api=None,
        **kwargs
    ):
        super().__init__(api, *args, **kwargs)

        self.library_broker = library_broker
        self.users_broker = users_broker

    @library_ns.doc(
        description="Retrieve library tree for this user.",
        responses={int(HTTPStatus.OK): "Retrieved tree."},
        security="CSRF",
    )
    # @library_ns.marshal_with(library_items, mask="*")
    @library_ns.response(int(HTTPStatus.OK), "Success", library_items)
    @jwt_required()
    def get(self):
        """Retrieve user library tree"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            items = get_library_tree(
                user_id=user_id, library_broker=self.library_broker
            )
        except Exception:
            current_app.logger.exception("LibraryItemsResource->get")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        return jsonify(items)

    @library_ns.doc(
        description="Create new items in library.",
        responses={int(HTTPStatus.CREATED): "Items added."},
        security="CSRF",
    )
    @library_ns.expect([library_model])
    @library_ns.response(int(HTTPStatus.CREATED), "Success", [library_model])
    @jwt_required()
    def post(self):
        """Create library items"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        data = library_ns.payload
        response_data = []

        try:
            items = parse_args_new_library_items(user_id, data)

            self.library_broker.create(items)

            response_data = [item.to_json_api() for item in items]
        except Exception:
            current_app.logger.exception("LibraryItemsResource->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        response = jsonify(response_data)
        response.status_code = HTTPStatus.CREATED

        return response


@library_ns.route(
    "/library/<string:item_id>", endpoint="library_item", methods=["PUT", "DELETE"]
)
@library_ns.param("item_id", "Item identifier")
class LibraryItemResource(Resource):
    """Handles HTTP requests to URL: /me/library/{id}."""

    @inject
    def __init__(
        self,
        library_broker: interfaces.ILibraryBroker,
        users_broker: interfaces.IUsersBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.library_broker = library_broker
        self.users_broker = users_broker

        super().__init__(api, *args, **kwargs)

    @library_ns.doc(
        description="Update an item in library",
        responses={
            int(HTTPStatus.OK): "Item updated.",
            int(HTTPStatus.NOT_FOUND): "Item not found.",
        },
        security="CSRF",
    )
    @library_ns.expect(update_item_parser)
    @jwt_required()
    def put(self, item_id: str):
        """Updates an item in library, available to library owner."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        args = update_item_parser.parse_args()

        item = self.library_broker.get_by_id(user_id=user_id, item_id=item_id)
        if item is None:
            abort(HTTPStatus.NOT_FOUND, "Item identifier not found")

        try:
            parse_args_update_library_item(item, args)

            self.library_broker.update(item)
        except Exception:
            current_app.logger.exception("LibraryItemResource->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        return jsonify(status="success", message="Library item updated")

    @library_ns.doc(
        description="Remove item from library",
        responses={
            int(HTTPStatus.OK): "Item removed.",
            int(HTTPStatus.NOT_FOUND): "Membership not found.",
        },
        security="CSRF",
    )
    @jwt_required()
    def delete(self, item_id: str):
        """
        Remove a library item, available to library owner.
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        item = self.library_broker.get_by_id(user_id=user_id, item_id=item_id)
        if item is None:
            abort(HTTPStatus.NOT_FOUND, "Item identifier not found")

        try:
            self.library_broker.delete(user_id=user_id, item_id=item_id)
        except Exception:
            current_app.logger.exception("LibraryItemResource->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        return jsonify(status="success", message="Item deleted")
