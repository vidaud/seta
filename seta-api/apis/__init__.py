# This is a required workaround for flask_restplus
import werkzeug
import flask
import werkzeug.utils
werkzeug.cached_property = werkzeug.utils.cached_property
import flask.scaffold
flask.helpers._endpoint_from_view_func = flask.scaffold._endpoint_from_view_func
from flask_restplus import Api

from .examples import ex_api
from .auth.auth import auth_api
from .clusters.clusters import cluster_api
from .suggestions.suggestions import suggestions_api
from .corpus.corpus import corpus_api
from .wiki.wiki import wiki_api
from .similar.similar import similar_api
from .ontology.ontology import ontology_api
from .decade.decade import decade_api
from .term.term import term_api
from .distance.distance import distance_api
from .embeddings.embeddings import emb_api

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    }
}

api = Api(version='beta',
         title='SeTA API',
         description='SeTA<style>.models {display: none !important}</style> - Semantic Text Analysis. \n'
                     'SeTa applies advanced text analysis techniques to large document collections, helping policy '
                     'analysts to understand the concepts expressed in thousands of documents and to see in a visual '
                     'manner the relationships between these concepts and their development over time.'
                     'A pilot version of this tool has been populated with hundreds of thousands of documents from '
                     'EUR-Lex, the EU Bookshop and other sources, and used at the JRC in a number of policy-related '
                     'use cases including impact assessment, the analysis of large data infrastructures, '
                     'agri-environment measures and natural disasters. The document collection which have been used, '
                     'the technical approach chosen and key use cases are described here: '
                     'https://ec.europa.eu/jrc/en/publication/semantic-text-analysis-tool-seta',
         doc='/seta-api/doc',
         authorizations=authorizations
         )


api.add_namespace(ex_api)
api.add_namespace(auth_api)
api.add_namespace(cluster_api)
api.add_namespace(suggestions_api)
api.add_namespace(corpus_api)
api.add_namespace(wiki_api)
api.add_namespace(similar_api)
api.add_namespace(ontology_api)
api.add_namespace(decade_api)
api.add_namespace(term_api)
api.add_namespace(distance_api)
api.add_namespace(emb_api)