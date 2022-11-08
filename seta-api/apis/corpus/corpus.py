from flask_restplus import Namespace, Resource, fields, abort
from flask import current_app as app, jsonify, request

from infrastructure.auth_validator import auth_validator
from infrastructure.ApiLogicError import ApiLogicError
from .corpus_logic import docbyid, delete_doc, insert_doc, corpus
from .variables import corpus_parser, metadata, keywords

from infrastructure.helpers import is_field_in_doc

corpus_api = Namespace('seta-api', description='Corpus')

@corpus_api.route(app.api_root + "/corpus/<string:id>", methods=['GET', 'DELETE'])
class Corpus(Resource):
    @auth_validator()
    @corpus_api.doc(description='Given the elasticsearch unique _id, the relative document from EU corpus is shown.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS,JRC PUBSY, EU Open Data Portal, etc..',
            params={'id': 'Return the document with the specified _id'},
            responses={200: 'Success', 404: 'Not Found Error'},
            security='apikey')
    def get(self, id):
        try:
            return docbyid(id, current_app=app)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("Corpus->get")
            abort(500, "Internal server error")

    @auth_validator("admin")
    @corpus_api.doc(description='Given the elasticsearch unique _id, the relative document is deleted.',
            params={'id': 'Delete the document with the specified _id'},
            responses={200: 'Success', 404: 'Not Found Error'},
            security='apikey')
    def delete(self, id):
        try:
            delete_doc(id, current_app=app)
            return jsonify({"deleted document id": id}), 200
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("Corpus->delete")
            abort(500, "Internal server error")
        
corpus_put_data = corpus_api.model(
    "corpus_put_params",
    {
        'id': fields.String(),
        'id_alias': fields.String(),
        'source': fields.String(),
        'title': fields.String(),
        "abstract": fields.String(),
        "text": fields.String(),
        "collection": fields.String(),
        "reference": fields.String(),
        "author": fields.List(fields.String()),
        "date": fields.Date(),
        "link_origin": fields.List(fields.String()),
        "link_alias": fields.List(fields.String()),
        "link_related": fields.List(fields.String()),
        "link_reference": fields.List(fields.String()),
        "mime_type": fields.String(),
        "in_force": fields.String(),
        "language": fields.String(),
        "eurovoc_concept": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "eurovoc_domain": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "eurovoc_mth": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "ec_priority": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "sdg_domain": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "sdg_subdomain": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "euro_sci_voc": fields.List(fields.Nested(corpus_api.model('metadata', metadata))),
        "keywords": fields.List(fields.Nested(corpus_api.model('keywords', keywords))),
        "other": fields.List(fields.String())
    }
)

query_corpus_post_data = corpus_api.model(
    "corpus_post_params",
    {
        'term': fields.String(description="term to be searched", example="data"),
        'n_docs': fields.Integer(description='Number of documents to be shown (default 10)', example=10),
        'from_doc': fields.Integer(description='Defines the number of hits to skip, defaulting to 0.', example=0),
        'search_type': fields.String(description="search type to be used, possible values are 'DOCUMENT_SEARCH', "
                                                 "'CHUNK_SEARCH', 'ALL_CHUNKS_SEARCH', default is 'CHUNK_SEARCH'"),
        'source': fields.List(fields.String, description='By default contains all the corpus: '
                                                         'eurlex,bookshop,cordis,pubsy,opendataportal.'
                                                         'It is possible to choose from which corpus retrieve documents.'),
        'reference': fields.List(fields.String, description='eurlex metadata reference'),
        'collection': fields.List(fields.String, description='eurlex metadata collection'),
        'eurovoc_dom': fields.List(fields.String, description='eurlex metadata eurovoc_dom'),
        'eurovoc_mth': fields.List(fields.String, description='eurlex metadata eurovoc_mth'),
        'eurovoc_tt': fields.List(fields.String, description='eurlex metadata eurovoc_tt'),
        'ec_priority': fields.List(fields.String, description='metadata ec_priority'),
        'sdg_domain': fields.List(fields.String, description='metadata sdg_domain'),
        'sdg_subdomain': fields.List(fields.String, description='metadata sdg_subdomain'),
        'euro_sci_voc': fields.List(fields.String, description='metadata euro_sci_voc'),
        'in_force': fields.Boolean(description='eurlex metadata info_force'),
        'sort': fields.List(fields.String, description='sort results field:order'),
        'semantic_sort_id': fields.String(description='sort results by semantic distance among documents'),
        'sbert_embedding': fields.List(fields.Float, description='embeddings vector'),
        'author': fields.String(description='author'),
        'date_range': fields.List(fields.String,
                                  description='examples: gte:yyyy-mm-dd,lte:yyyy-mm-dd,gt:yyyy-mm-dd,lt:yyyy-mm-dd'),
        'aggs': fields.String(
            description='field to be aggregated, allowed fields are: "source", "eurovoc_concept"')
    }
)      
        
@corpus_api.route(app.api_root + "/corpus", methods=['POST', 'GET', 'PUT'])
class CorpusQuery(Resource):
    @auth_validator()
    @corpus_api.doc(description='Retrieve documents related to a term from EU corpus.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc..',
            security='apikey')
    @corpus_api.expect(query_corpus_post_data)
    def post(self):
        args = request.get_json(force=True)
        app.logger.debug(str(args))        
        
        if is_field_in_doc(args, 'term') or is_field_in_doc(args, 'semantic_sort_id') \
                or is_field_in_doc(args, 'sbert_embedding') or is_field_in_doc(args, 'aggs') \
                or is_field_in_doc(args, 'source'):
            try:
                documents = corpus(is_field_in_doc(args, 'term'), is_field_in_doc(args, 'n_docs'),
                            is_field_in_doc(args, 'from_doc'), is_field_in_doc(args, 'source'),
                            is_field_in_doc(args, 'collection'), is_field_in_doc(args, 'reference'),
                            is_field_in_doc(args, 'eurovoc_concept'), is_field_in_doc(args, 'eurovoc_domain'),
                            is_field_in_doc(args, 'eurovoc_mth'), is_field_in_doc(args, 'ec_priority'),
                            is_field_in_doc(args, 'sdg_domain'), is_field_in_doc(args, 'sdg_subdomain'),
                            is_field_in_doc(args, 'euro_sci_voc'), is_field_in_doc(args, 'in_force'),
                            is_field_in_doc(args, 'sort'), is_field_in_doc(args, 'semantic_sort_id'),
                            is_field_in_doc(args, 'sbert_embedding'), is_field_in_doc(args, 'author'),
                            is_field_in_doc(args, 'date_range'), is_field_in_doc(args, 'aggs'),
                            is_field_in_doc(args, 'search_type'), 
                            current_app=app)
                
                return jsonify(documents)
            except ApiLogicError as aex:
                abort(404, str(aex))
            except:
                app.logger.exception("CorpusQuery->post")
                abort(500, "Internal server error")

    @auth_validator("admin")
    @corpus_api.doc(description='Put a document into corpus index.',
            security='apikey')
    @corpus_api.expect(corpus_put_data)
    def put(self):
        args = request.get_json(force=True)
        doc_id = insert_doc(args, current_app=app)
        return jsonify({"Document indexed. First chunk indexed has id": doc_id}), 200

    @corpus_api.expect(corpus_parser)
    @auth_validator()
    @corpus_api.doc(description='Retrieve documents related to a term from EU corpus.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc..',
            params={'term': 'Return documents related to the specified term',
                    'n_docs': 'Number of documents to be shown (default 10).',
                    'from_doc': 'Defines the number of hits to skip, defaulting to 0.',
                    'search_type': 'Defines the type of search to be used admitted values are "DOCUMENT_SEARCH",'
                                   ' "CHUNK_SEARCH", "ALL_CHUNKS_SEARCH", default is "CHUNK_SEARCH"',
                    'source': 'By default contains all the corpus: '
                              'eurlex,bookshop,cordis,pubsy,opendataportal.'
                              'It is possible to choose from which corpus retrieve documents.',
                    'collection': 'eurlex metadata collection',
                    'reference': 'eurlex metadata reference',
                    'eurovoc_concept': 'eurlex metadata eurovoc_concept',
                    'eurovoc_domain': 'eurlex metadata eurovoc_dom',
                    'eurovoc_mth': 'eurlex metadata eurovoc_mth',
                    'ec_priority': 'eurlex metadata ec_priority',
                    'sdg_domain': 'eurlex metadata sdg_domain',
                    'sdg_subdomain': 'eurlex metadata sdg_subdomain',
                    'euro_sci_voc': 'eurlex metadata euro_sci_voc',
                    'in_force': 'eurlex metadata in_force',
                    'sort': 'sort results field:order',
                    'semantic_sort_id': 'sort results by semantic distance among documents',
                    'author': 'description',
                    'date_range': 'gte:yyyy-mm-dd,lte:yyyy-mm-dd,gt:yyyy-mm-dd,lt:yyyy-mm-dd',
                    'aggs': 'field to be aggregated, allowed fields are: "source", "eurovoc_concept"'},
            security='apikey')
    def get(self):
        args = corpus_parser.parse_args()
        print("args: ", args)
        if args['term'] or args['semantic_sort_id'] or args['aggs'] or args['source']:
            try:
                documents = corpus(args['term'], args['n_docs'], args['from_doc'], args['source'], args['collection'],
                          args['reference'], args['eurovoc_concept'], args['eurovoc_domain'], args['eurovoc_mth'],
                          args['ec_priority'], args['sdg_domain'], args['sdg_subdomain'], args['euro_sci_voc'],
                          args['in_force'], args['sort'], args['semantic_sort_id'], None, args['author'],
                          args['date_range'], args['aggs'], args['search_type'], 
                          current_app=app)
                
                return jsonify(documents), 200
            except ApiLogicError as aex:
                abort(404, str(aex))
            except:
                app.logger.exception("CorpusQuery->get")
                abort(500, "Internal server error")
        
    
    