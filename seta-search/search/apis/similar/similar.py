from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import current_app as app, jsonify

from search.infrastructure.auth_validator import auth_validator
from search.infrastructure.ApiLogicError import ApiLogicError

from .similar_logic import get_similar_words

similar_api = Namespace("Similar")

similar_parser = reqparse.RequestParser()
similar_parser.add_argument("term", required=True)
similar_parser.add_argument("n_term", type=int)

word = {
    "similarity": fields.String,
    "similar_word": fields.String,
    "cardinality": fields.String,
}
word_model = similar_api.model("word", word)
similar_response = {"words": fields.List(fields.Nested(word_model))}
similar_response_model = similar_api.model("similar_response_model", similar_response)


@similar_api.doc(
    description="Given a term, return the 20 most similar terms (semantic similarity). "
    "For each term similarity and cardinality (number of occurrences in documents) are reported."
    "When a list of terms is provided similarity values are set to zero.",
    params={
        "term": "A term.",
        "n_term": "Number of similar terms to be extracted (default 20).",
    },
    responses={200: "Success", 404: "Not Found Error"},
    security="apikey",
)
@similar_api.route("similar")
@similar_api.response(200, "Success", similar_response_model)
class SimilarWords(Resource):
    @auth_validator()
    @similar_api.expect(similar_parser)
    def get(self):
        args = similar_parser.parse_args()
        try:
            words = get_similar_words(args["term"], args["n_term"], current_app=app)
            return jsonify(words)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except Exception:
            app.logger.exception("SimilarWords->get")
            abort(500, "Internal server error")
