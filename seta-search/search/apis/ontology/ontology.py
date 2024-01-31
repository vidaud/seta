from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import current_app as app, jsonify

from search.infrastructure.auth_validator import auth_validator
from search.infrastructure.ApiLogicError import ApiLogicError

from .ontology_logic import build_graph, build_tree

ontology_api = Namespace("Ontology")

term_parser = reqparse.RequestParser()
term_parser.add_argument("term", required=True)


@ontology_api.route("ontology")
@ontology_api.doc(
    description="Return a graph illustrating  the ontology of the specified term. "
    "The output includes a set of nodes and their corresponding links"
    "Each node provides information on its depth within the graph, "
    "identifier (id) representing the term, frequency (size) of occurrences in the document index,"
    " and graph size for visualization purposes. "
    "Links include details such as source (id of the starting node), target (id of the linked node),"
    " and value for graph visualization",
    params={"term": "The term from which build the ontology graph."},
    responses={200: "Success", 404: "Not Found Error"},
    security="apikey",
)
class Ontology(Resource):
    @auth_validator()
    @ontology_api.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()

        try:
            graphjs = build_graph(args["term"], current_app=app)
            return jsonify(graphjs)
        except Exception as ex:
            abort(404, str(ex))


ontology_list_parser = reqparse.RequestParser()
ontology_list_parser.add_argument("term", required=True)
ontology_list_resp = {"nodes": fields.List(fields.List(fields.String))}
ontology_list_response_model = ontology_api.model(
    "ontology_list_response_model", ontology_list_resp
)


@ontology_api.route("ontology-list")
@ontology_api.doc(
    description="Return a ranked list of lists containing similar terms that represent the ontology of the specified "
                "term. The lists are ordered by the strength of their relation to a query term. "
                "The initial node in each list represents a direct relation to the query term, "
                "with subsequent terms in the sublist having a relation to the first node. "
                "Interpret the results as follows: the first item in each sublist signifies a first-level "
                "connection to the query term, while the subsequent terms in the sublists denote "
                "second-level relations to the main query term and maintain a direct connection to the "
                "head of the sublist.",
    params={"term": "The term from which build the ontology tree."},
    responses={200: "Success", 404: "Not Found Error"},
    security="apikey",
)
@ontology_api.response(200, "Success", ontology_list_response_model)
class OntologyList(Resource):
    @auth_validator()
    @ontology_api.expect(ontology_list_parser)
    def get(self):
        args = ontology_list_parser.parse_args()
        try:
            graphjs = build_tree(args["term"], current_app=app)
            return jsonify(graphjs)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except Exception:
            app.logger.exception("OntologyList->get")
            abort(500, "Internal server error")
