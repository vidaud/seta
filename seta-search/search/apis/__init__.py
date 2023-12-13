from flask_restx import Api
from flask import Blueprint

from .suggestions.suggestions import suggestions_api
from .corpus.corpus import corpus_api
from .similar.similar import similar_api
from .ontology.ontology import ontology_api
from .term_enrichment.term_enrichment import term_enrichment_api
from .export.export import export_api

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    }
}

api_root = "/seta-search/api/v1"
apis_bp_v1 = Blueprint('seta-search-v1', __name__, url_prefix=api_root)

api = Api(apis_bp_v1,
         version='beta',
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
         doc='/doc',
         authorizations=authorizations,
         default_swagger_filename="/swagger_api.json",
         )

api.add_namespace(suggestions_api, path="/")
api.add_namespace(corpus_api, path="/")
api.add_namespace(similar_api, path="/")
api.add_namespace(ontology_api, path="/")
api.add_namespace(term_enrichment_api, path="/")
api.add_namespace(export_api, path="/")
