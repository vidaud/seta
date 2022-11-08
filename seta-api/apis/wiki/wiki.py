from flask_restplus import Namespace, Resource, reqparse
from flask import current_app as app
from infrastructure.auth_validator import auth_validator

wiki_api = Namespace('seta-api', description='Wiki')

@wiki_api.doc(description='Given an ID, the relative document from Wikipedia is shown.',
        params={'id': 'Return the document with the specified ID'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
@wiki_api.route(app.api_root + "/wiki/<string:id>")
class Wiki(Resource):
    @auth_validator()
    def get(self, id):
        return {}
    
document_parser = reqparse.RequestParser()
document_parser.add_argument('term')
document_parser.add_argument('n_docs', type=int)


@wiki_api.doc(description='Retrieve documents related to a term from Wikipedia',
        params={'term': 'Return documents related to the specified term.',
                'n_docs': 'Number of documents to be shown (default 10).'},
        security='apikey')
@wiki_api.route(app.api_root + "/wiki")
class WikiQuery(Resource):
    @auth_validator()
    @wiki_api.expect(document_parser)
    def get(self):
        return {}    