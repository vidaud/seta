from flask_restx import Namespace, Resource, reqparse
from flask import current_app as app, jsonify

from search.infrastructure.auth_validator import auth_validator
from .suggestions_logic import get_word_suggestions

suggestions_api = Namespace("Suggestions")

suggestions_parser = reqparse.RequestParser()
suggestions_parser.add_argument("chars", required=True)
suggestions_parser.add_argument("n_suggestions", type=int)


@suggestions_api.route("suggestions")
@suggestions_api.doc(
    description="This endpoint provides autocomplete suggestions for search queries"
                " based on the provided characters (chars) and the desired number of suggestions "
                "(n_suggestions). ",
    params={
        "chars": "The characters entered by the user for which suggestions are requested.",
        "n_suggestions": "The number of suggestions to be returned. (default 6).",
    },
    security="apikey",
)
@suggestions_api.expect(suggestions_parser)
class Suggestions(Resource):
    @auth_validator()
    def get(self):
        args = suggestions_parser.parse_args()

        n_suggestions = args["n_suggestions"]
        if n_suggestions is None:
            n_suggestions = app.config["DEFAULT_SUGGESTION"]

        suggestions = get_word_suggestions(app, args["chars"], n_suggestions)
        return jsonify({"words": suggestions})
