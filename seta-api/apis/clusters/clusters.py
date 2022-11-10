from flask_restx import Namespace, Resource, reqparse, abort
from flask import current_app as app, jsonify

from infrastructure.auth_validator import auth_validator
from infrastructure.ApiLogicError import ApiLogicError
from .clusters_logic import get_clusters


cluster_parser = reqparse.RequestParser()
cluster_parser.add_argument('term', required=True)
cluster_parser.add_argument('n_terms', type=int)

cluster_api = Namespace('seta-api', description='Clusters')

@cluster_api.route(app.api_root + "/clusters")
@cluster_api.doc(description='Given a term, the 20 most similar terms are extracted. '
                    'Terms are then clustered using the algorithm DBSCAN. '
                    'Clusters may not exist and some terms can be unclustered.'
                    'The number of terms to be clustered can be customized with the parameter n_terms',
        params={'term': 'Term to be searched.',
                'n_terms': 'The number of terms to be clustered (default 20, max 30).'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class Clusters(Resource):
    @auth_validator()
    @cluster_api.expect(cluster_parser)
    def get(self):
        args = cluster_parser.parse_args()
        
        try:
            n_terms = args['n_terms']
            if n_terms is None:
                n_terms = app.config["DEFAULT_TERM_NUMBER"]
            
            clusters = get_clusters(app.terms_model, args['term'], n_terms)
            return jsonify(clusters)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("Clusters->get")
            abort(500, "Internal server error")
    
  