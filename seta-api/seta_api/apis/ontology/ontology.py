from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import current_app as app, jsonify

from seta_api.infrastructure.auth_validator import auth_validator
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from .ontology_logic import build_graph, build_tree

ontology_api = Namespace('seta-api-ontology', description='Ontology')

term_parser = reqparse.RequestParser()
term_parser.add_argument('term', required=True)


@ontology_api.route("ontology")
@ontology_api.doc(description='Return a graph that describes the ontology of the specified term. '
                              'A set of nodes and relative links are provided.'
                              'For each node depth, id, size and graph size are returned, '
                              'depth indicates the depth of the node in the graph, id is the identifier of the term for the node,'
                              ' size indicates the number of occurrences of the term in the document corpus '
                              'and graph size is useful to visualize the graph.'
                              'For each link source, target and value are returned, '
                              'source indicates the node (its id) from which the link starts, '
                              'target is the node (its id) linked to source'
                              'and value is used to visualize the graph.',
                  params={'term': 'The term from which build the ontology graph.'},
                  responses={200: 'Success', 404: 'Not Found Error'},
                  security='apikey')
class Ontology(Resource):
    @auth_validator()
    @ontology_api.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()

        try:
            graphjs = build_graph(args['term'], current_app=app)
            return jsonify(graphjs)
        except Exception as ex:
            abort(404, str(ex))


ontology_list_parser = reqparse.RequestParser()
ontology_list_parser.add_argument('term', required=True)
ontology_list_resp = {"nodes": fields.List(fields.List(fields.String))}
ontology_list_response_model = ontology_api.model("ontology_list_response_model", ontology_list_resp)


@ontology_api.route("ontology-list")
@ontology_api.doc(
    description='Return a list of lists of similar terms that describes the ontology of the specified term. '
                'Lists are ranked by the relation strenght to a query term. The first node in each list is'
                ' direct relation to query term. The following terms in each sublist have relation to'
                ' the first node in a sublist.'
                'The result should be interpretd as follows: the first item in each sublist is first level'
                ' connection to the query term. The following terms in sublists have second level relation'
                ' to the main query term and direct connection to the head of sublist.',
    params={'term': 'The term from which build the ontology tree.'},
    responses={200: 'Success', 404: 'Not Found Error'},
    security='apikey')
@ontology_api.response(200, 'Success', ontology_list_response_model)
class OntologyList(Resource):
    @auth_validator()
    @ontology_api.expect(ontology_list_parser)
    def get(self):
        args = ontology_list_parser.parse_args()
        try:
            graphjs = build_tree(args['term'], current_app=app)
            return jsonify(graphjs)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("OntologyList->get")
            abort(500, "Internal server error")
