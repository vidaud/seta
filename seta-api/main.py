from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from math import sqrt
from flask import Flask, jsonify, request, url_for, redirect, send_from_directory, g, Response
# This is a required workaround for flask_restplus
import werkzeug
from werkzeug.utils import secure_filename
werkzeug.cached_property = werkzeug.utils.cached_property
import flask.scaffold
flask.helpers._endpoint_from_view_func = flask.scaffold._endpoint_from_view_func
# Workaround end
from flask_restplus import Resource, Api, reqparse, inputs, fields
import pandas as pd
import json
import copy
import yaml
import datetime
from gensim.models import KeyedVectors
from tqdm import tqdm
from sklearn.cluster import DBSCAN
from flask_cors import CORS
import re
from gensim.models.doc2vec import Doc2Vec
import itertools
import nltk
from nltk.tokenize import word_tokenize
from nltk.text import ConcordanceIndex
from flask_jwt_extended import JWTManager, create_access_token, decode_token, get_jwt, verify_jwt_in_request
from functools import wraps
import werkzeug
import os
import os.path
from os.path import exists
import subprocess
from pymongo import MongoClient
import secrets

from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii

from log_utils.api_log import ApiLog
from log_utils.log_line import LogLine
import time
from sentence_transformers import SentenceTransformer
from utils.jrcbox_download import seta_init, wait_for_es
from utils.clean import sentenced
import jsonschema
from jsonschema import validate
from utils.embeddings import Embeddings
from flask_apscheduler import APScheduler
from utils.crc import getsha256
import requests
#TODO disable warning to be deleted when certificate for elasticsearch are fixed
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
urllib3.disable_warnings(urllib3.exceptions.SecurityWarning)
#TODO end
config = yaml.load(open("config.yaml"), Loader=yaml.FullLoader)

# initialize scheduler
scheduler = APScheduler()


def now():
    return datetime.datetime.now()

from subprocess import Popen, PIPE, STDOUT


config = yaml.load(open("config.yaml"), Loader=yaml.FullLoader)


def now():
    return datetime.datetime.now()


def gen_data(crc):
    print("suggestion indexing started")
    for word in tqdm(list(terms_model.wv.vocab)):
        phrase = word.replace('_', ' ').lower()
        yield {
            "_index": config["index-suggestion"],
            "phrase": phrase,
            "crc": crc
        }


def delete_all_suggestion(crc):
    if crc:
        print("suggestion delete started")
        query = {"query": {"bool": {"must": [{"match": {"crc.keyword": crc}}]}}}
        res = es.delete_by_query(index=config["index-suggestion"], body=query, wait_for_completion=False)
        print(res)
        print("suggestion delete finished")

def get_crc_from_es():
    query = {"bool": {"must": [{"exists": {"field": "crc_model"}}]}}
    resp = es.search(index=config["index-suggestion"], query=query)
    if resp['hits']['total']['value'] == 0:
        crc_es = None
        crc_id = None
    else:
        crc_es = resp['hits']['hits'][0]['_source']['crc_model']
        crc_id = resp['hits']['hits'][0]['_id']
    return crc_es, crc_id


@scheduler.task('cron', id='suggestion_update_job', hour=4, minute=00)
def suggestion_update_job():
    wait_for_es(config)
    if os.path.exists(models_path + config['models-word2vec-file-crc']):
        crc = open(models_path + config['models-word2vec-file-crc'], 'r').read()
    else:
        crc = getsha256(models_path + config['models-word2vec-file'])
        f = open(models_path + config['models-word2vec-file-crc'],mode='w')
        f.write(crc)
        f.close()

    es_session = requests.Session()
    es_session.trust_env = False
    resp = es_session.put("http://"+config['es-host']+"/"+config["index-suggestion"]+ "?pretty")        
    print (resp)
    current_w2v_crc, crc_id = get_crc_from_es()
    if crc != current_w2v_crc:
        try:
            bulk(es, gen_data(crc))
            crc_model = {"crc_model": crc}
            delete_all_suggestion(current_w2v_crc)
            if crc_id:
                es.update(index=config["index-suggestion"], id=crc_id, doc=crc_model)
            else:
                es.index(index=config["index-suggestion"], document=crc_model)
        except:
            print("errors on suggestion update. New crc: ", crc)


def init():
    seta_init(config)
#    if config['env'] == 'dev':
#        models_path = config['models-path-dev']
#        es = Elasticsearch(config["es-host-dev"], http_auth=(config["user"], config["pass"]))
#    else:
#        models_path = config['models-path-production']
#        es = Elasticsearch(config["es-host"], http_auth=(config["user"], config["pass"]))
#    total = es.count(index=config["index"])['count']
#    print(now(), "Total number of documents indexed by Elastic:", total)
    # models new folder
    # word2vec = KeyedVectors.load(models_path + "models-production/wv-sg0-hs1.bin", mmap="r")
    # models June 2021 folder
#    word2vec = KeyedVectors.load(models_path + "wv-sg0hs1.bin", mmap="r")
#    print(now(), "Loaded %s" % word2vec)

#    es = Elasticsearch(config["es-host"])
#    es = Elasticsearch(config["es-host"], basic_auth=(config["user8.2"], config["pass8.2"]), verify_certs=False, request_timeout=30)
    es = Elasticsearch("http://" + config["es-host"], verify_certs=False, request_timeout=30)
    total = es.count(index=config["index"][0])['count']
    models_path = config['models-path']
    print(now(), "Total number of documents indexed by Elastic:", total)
#    if not os.path.isfile(config['models-word2vec-file']) :
       
    word2vec = KeyedVectors.load(models_path + config['models-word2vec-file'], mmap="r")
    print(now(), "Loaded %s" % word2vec)

    lookup = {}
#    for word in tqdm(list(word2vec.wv.vocab)):
#        for wn in range(len(word)):
#            w = word[:wn + 1]
#            if w not in lookup: lookup[w] = []
#            if len(lookup[w]) < 10: lookup[w].append(word)
#    print('Lookup field created')
    sbert = SentenceTransformer('all-distilroberta-v1')
    sbert.max_seq_length = 512
    print("SeTA-API is up and running.", flush=True)
#    return es, word2vec, lookup, sbert
    return es, word2vec, sbert, models_path

es, terms_model, sbert_model, models_path = init()
app = Flask(__name__)
# app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
CORS(app)

if exists(config['models-path'] + config['secret-key-path']):
    f1 = open(config['models-path'] + config['secret-key-path'], "r")
    app.config["JWT_SECRET_KEY"] = f1.readline()
    f1.close()
else:
    token = secrets.token_hex(16)
    f1 = open(config['models-path'] + config['secret-key-path'], "w")
    app.config["JWT_SECRET_KEY"] = token
    f1.write(token)
    f1.close()
#app.config["JWT_SECRET_KEY"] = config['secret-key']
app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["SWAGGER_UI_JSONEDITOR"] = True
app.config['MAX_CONTENT_LENGTH'] = 50 * 1000 * 1000  # 50M


jwt = JWTManager(app)

suggestion_update_job()
scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()

api_log = ApiLog()

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    }
}

app.config.SWAGGER_UI_DOC_EXPANSION = 'full'
ns = Api(app,
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
         doc='/seta-api/doc',
         authorizations=authorizations
         )
ns = ns.namespace('seta-api', description='Seta APIs include different operation such as browsing documents, '
                                          'clustering term, creating ontology and other tasks '
                                          'like extract semantic distance between two terms.')

DEFAULT_SUGGESTION = 6
DEFAULT_TERM_NUMBER = 20
DEFAULT_DOCS_NUMBER = 10
DEFAULT_FROM_DOC_NUMBER = 0
SEARCH_TYPES = ["DOCUMENT_SEARCH", "CHUNK_SEARCH", "ALL_CHUNKS_SEARCH"]

api_root = '/api/v1'
CONNECTION_STRING = config["mongodb-host"] # 'mongodb://127.0.0.1:27017/'
client = MongoClient(CONNECTION_STRING)
mongodb_seta = client.seta


def custom_validator(role=None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            #disable token authorization for the moment
            return fn(*args, **kwargs)
            
            verify_jwt_in_request()
            claims = get_jwt()
            print(claims)
            token_str = request.headers['Authorization']
            revoked_token = mongodb_seta.users.find_one({"username": claims['sub'],
                                                         "is-revoked-token": True,
                                                         "jwt": token_str})
            if role:
                if not (claims['role'] == role):
                    response = jsonify({"msg": "Unauthorized access"})
                    response.status_code = 403
                    return response
            print('revoked', revoked_token)

            if not revoked_token:
                return fn(*args, **kwargs)
            else:
                response = jsonify({"msg": "Roveked token"})
                response.status_code = 403
                return response
        return decorator
    return wrapper

"""
def autenticate_user(username, message, signature):
    item = mongodb_seta.users.find({"username": username, "is-rsa-key": True, "is-public-key": True, "is-private-key": False})
    if item.count_documents() > 0:
        public = item[0]['value']
    else:
        response = jsonify({"error": "Invalid Username"})
        response.status_code = 501
        return False, response
    public_key = RSA.import_key(public)
    digest = SHA256.new(message.encode())
    try:
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception as e:
        response = jsonify({"error": str(e)})
        response.status_code = 502
        return False, response
    return True, None


def autenticate_user(username, message, signature):
    if mongodb_seta.users.count_documents({"username": username, "is-rsa-key": True, "is-public-key": True, "is-private-key": False}) > 0:
        item = mongodb_seta.users.find({"username": username, "is-rsa-key": True, "is-public-key": True, "is-private-key": False})
        public = item[0]['value']
        public_key = RSA.import_key(public)
        digest = SHA256.new(message.encode())
        try:
            pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
        except Exception as e:
            response = jsonify({"error": str(e)})
            response.status_code = 502
            return False, response
        return True, None

    else:
        response = jsonify({"error": "Invalid Username"})
        response.status_code = 501
        return False, response

"""

def authenticate_user(username, message, signature):
    item = mongodb_seta.users.find({"username": username, "is-rsa-key": True, "is-public-key": True, "is-private-key": False})
    if item.count() > 0:
        public = item[0]['value']
        role = item[0]['role']
        # TODO update source and limit with mongodb fields
        source_limit = {"source": item[0]['username'], "limit": 5}
    else:
        response = jsonify({"error": "Invalid Username"})
        response.status_code = 501
        return False, response, None
    public_key = RSA.import_key(public)
    digest = SHA256.new(message.encode())
    try:
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception as e:
        response = jsonify({"error": str(e)})
        response.status_code = 502
        return False, response, None
    return True, None, role, source_limit



@ns.route('/example_get-token_guest.py')
class ExampleGuest(Resource):
    def get(self):
        return send_from_directory(directory='static', path=config['example-guest'])


@ns.route('/example_get-token_user.py')
class ExampleUser(Resource):
    def get(self):
        return send_from_directory(directory='static', path=config['example-user'])


auth_data = ns.model(
    "get_token_params",
    {'username': fields.String(description="Username"),
     'rsa_original_message': fields.String(description="Original message"),
     'rsa_message_signature': fields.String(description="Signature using hex format, string of hexadecimal numbers.")})


@app.before_request
def before_request():
    g.start = time.time()


@app.after_request
def after_request(response: Response):
    diff = time.time() - g.start
    header = request.headers
    username = None
    if "Authorization" in header:
        token = str.replace(request.headers['Authorization'], 'Bearer ','')
        try:
            username = decode_token(token)['sub']
        except:
            pass

    error_message = None

    if response.status_code != 200 and response.json:
        if 'error' in response.json:
            error_message = response.json["error"]
        if 'msg' in response.json:
            error_message = response.json["msg"]

    line = LogLine(username, str(now()), request.remote_addr, request.full_path, response.status_code,
                   diff, error_message)
    api_log.write_log(line)
    return response


@ns.route(api_root + "/get-token", methods=['POST', 'GET'])
class JWTtoken(Resource):
    @ns.doc(description="JWT token for users, expiration 1 day.\n"
                        'Python example <a href="example_get-token_user.py" target="_blank" download="example_get-token_user.py">here</a>',
            responses={200: 'Success',
                       501: 'Invalid Username',
                       502: 'Invalid Signature'})
    @ns.expect(auth_data)

    def post(self):
        args = request.get_json(force=True)
        valid, response, role, source_limit = authenticate_user(args['username'], args['rsa_original_message'],
                                                                args['rsa_message_signature'])
        if valid:
            additional_claims = {"role": role, "source_limit": source_limit}
            access_token = "Bearer " + create_access_token(identity=args['username'],
                                                           expires_delta=datetime.timedelta(days=1),
                                                           additional_claims=additional_claims)
            return jsonify(access_token=access_token)
        else:
            return response

    @ns.doc(description='JWT token for GUEST users, expiration 1 hour.\n'
                        'Python example <a href="example_get-token_guest.py" target="_blank" download="example_get-token_guest.py">here</a>',
            responses={200: 'Success'})
    def get(self):
        user_number = str(time.time())
        additional_claims = {"role": None}
        access_token = "Bearer " + create_access_token(identity="guest-" + user_number,
                                                       expires_delta=datetime.timedelta(hours=1),
                                                       additional_claims=additional_claims)
        return jsonify(access_token=access_token)


cluster_parser = reqparse.RequestParser()
cluster_parser.add_argument('term', required=True)
cluster_parser.add_argument('n_terms', type=int)


@ns.route(api_root + "/clusters")
@ns.doc(description='Given a term, the 20 most similar terms are extracted. '
                    'Terms are then clustered using the algorithm DBSCAN. '
                    'Clusters may not exist and some terms can be unclustered.'
                    'The number of terms to be clustered can be customized with the parameter n_terms',
        params={'term': 'Term to be searched.',
                'n_terms': 'The number of terms to be clustered (default 20, max 30).'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class Clusters(Resource):
    @custom_validator()
    @ns.expect(cluster_parser)
    def get(self):
        args = cluster_parser.parse_args()
        response = get_clusters(args['term'], args['n_terms'])
        return response


suggestions_parser = reqparse.RequestParser()
suggestions_parser.add_argument('chars', required=True)
suggestions_parser.add_argument('n_suggestions', type=int)


@ns.route(api_root + "/suggestions")
@ns.doc(description="Retrieve terms by initial letters. By default it returns 6 terms,"
                    " with the parameter n_suggestions is possible to set the number of suggestions to be shown.",
        params={'chars': 'Initial letters.', 'n_suggestions': 'Number of terms to be returned (default 6).'},
        security='apikey')
@ns.expect(suggestions_parser)
class Suggestions(Resource):
    @custom_validator()
    def get(self):
        args = suggestions_parser.parse_args()
        return get_word_suggestions(args['chars'], args['n_suggestions'])

def delete_doc(id, index):
    try:
        es.delete(index=index, id=id)
        response = jsonify({"deleted document id": id})
        response.status_code = 200
        return response
    except:
        response = jsonify({"msg": "id not found"})
        response.status_code = 403
        return response


@ns.route(api_root + "/corpus/<string:id>", methods=['GET', 'DELETE'])
class Corpus(Resource):
    @custom_validator()
    @ns.doc(description='Given the elasticsearch unique _id, the relative document from EU corpus is shown.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS,JRC PUBSY, EU Open Data Portal, etc..',
            params={'id': 'Return the document with the specified _id'},
            responses={200: 'Success', 404: 'Not Found Error'},
            security='apikey')
    def get(self, id):
        return docbyid(id, config['index_public'])

    @custom_validator("admin")
    @ns.doc(description='Given the elasticsearch unique _id, the relative document is deleted.',
            params={'id': 'Delete the document with the specified _id'},
            responses={200: 'Success', 404: 'Not Found Error'},
            security='apikey')
    def delete(self, id):
        return delete_doc(id, config['index_private'])


corpus_parser = reqparse.RequestParser()
corpus_parser.add_argument('term')
corpus_parser.add_argument('n_docs', type=int)
corpus_parser.add_argument('from_doc', type=int)
corpus_parser.add_argument('search_type')
corpus_parser.add_argument('source', action='split')
corpus_parser.add_argument('collection', action='split')
corpus_parser.add_argument('subject', action='split')
corpus_parser.add_argument('reference', action='split')
corpus_parser.add_argument('eurovoc_concept', action='split')
corpus_parser.add_argument('eurovoc_domain', action='split')
corpus_parser.add_argument('eurovoc_mth', action='split')
corpus_parser.add_argument('ec_priority', action='split')
corpus_parser.add_argument('sdg_domain', action='split')
corpus_parser.add_argument('sdg_subdomain', action='split')
corpus_parser.add_argument('euro_sci_voc', action='split')
corpus_parser.add_argument('in_force', type=inputs.boolean)
corpus_parser.add_argument('sort', action='split')
corpus_parser.add_argument('semantic_sort_id')
corpus_parser.add_argument('author', action='split')
corpus_parser.add_argument('date_range', action='split')
corpus_parser.add_argument('aggs')

metadata = {}
metadata["label"] = fields.String()
metadata["validated"] = fields.String()
metadata["classifier"] = fields.String()
metadata["version"] = fields.String()

keywords = {}
keywords["keyword"] = fields.String()
keywords["score"] = fields.Float()

corpus_put_data = ns.model(
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
        "eurovoc_concept": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "eurovoc_domain": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "eurovoc_mth": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "ec_priority": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "sdg_domain": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "sdg_subdomain": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "euro_sci_voc": fields.List(fields.Nested(ns.model('metadata', metadata))),
        "keywords": fields.List(fields.Nested(ns.model('keywords', keywords))),
        "other": fields.List(fields.String())
    }
)

query_corpus_post_data = ns.model(
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
inputSchemaCorpusPut = {"type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "id_alias": {"type": "string"},
                            "source": {"type": "string"},
                            "title": {"type": "string"},
                            "abstract": {"type": "string"},
                            "text": {"type": "string"},
                            "collection": {"type": "string"},
                            "reference": {"type": "string"},
                            "author": {"type": "string"},
                            "date": {"type": "string"},
                            "link_origin": {"type": "string"},
                            "link_alias": {"type": "string"},
                            "link_related": {"type": "string"},
                            "link_reference": {"type": "string"},
                            "mime_type": {"type": "string"},
                            "in_force": {"type": "string"},
                            "language": {"type": "string"},
                            "eurovoc_concept": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                                "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "eurovoc_domain": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                               "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "eurovoc_mth": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                            "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "ec_priority": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                            "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "sdg_domain": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                           "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "sdg_subdomain": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                              "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "euro_sci_voc": [{"label": {"type": "string"}, "validated": {"type": "string"},
                                             "classifier": {"type": "string"}, "version": {"type": "string"}}],
                            "keywords": {"keyword": {"type": "string"}, "score": {"type": "number"}},
                            "other": {"type": "object"}
                        },
                        "required": ["source", "title", "text"]}


def insert_doc(args, index):
    new_doc = {}
    new_doc["id"] = is_field_in_doc(args, "id")
    new_doc["id_alias"] = is_field_in_doc(args, "id_alias")
    new_doc["source"] = is_field_in_doc(args, "source")
    new_doc["title"] = is_field_in_doc(args, "title")
    new_doc["abstract"] = is_field_in_doc(args, "abstract")
    new_doc["collection"] = is_field_in_doc(args, "collection")
    new_doc["reference"] = is_field_in_doc(args, "reference")
    new_doc["author"] = is_field_in_doc(args, "author")
    new_doc["date"] = is_field_in_doc(args, "date")
    new_doc["link_origin"] = is_field_in_doc(args, "link_origin")
    new_doc["link_alias"] = is_field_in_doc(args, "link_alias")
    new_doc["link_related"] = is_field_in_doc(args, "link_related")
    new_doc["link_reference"] = is_field_in_doc(args, "link_reference")
    new_doc["mime_type"] = is_field_in_doc(args, "mime_type")
    new_doc["in_force"] = is_field_in_doc(args, "in_force")
    new_doc["language"] = is_field_in_doc(args, "language")
    new_doc["eurovoc_concept"] = is_field_in_doc(args, "eurovoc_concept")
    new_doc["eurovoc_domain"] = is_field_in_doc(args, "eurovoc_domain")
    new_doc["eurovoc_mth"] = is_field_in_doc(args, "eurovoc_mth")
    new_doc["ec_priority"] = is_field_in_doc(args, "ec_priority")
    new_doc["sdg_domain"] = is_field_in_doc(args, "sdg_domain")
    new_doc["sdg_subdomain"] = is_field_in_doc(args, "sdg_subdomain")
    new_doc["euro_sci_voc"] = is_field_in_doc(args, "euro_sci_voc")
    new_doc["other"] = is_field_in_doc(args, "other")
    new_doc["keywords"] = is_field_in_doc(args, "keywords")

    res = es.index(index=index, document=new_doc)
    doc_id = res["_id"]
    embs = Embeddings.get_embeddings(args["title"], args["abstract"], args["text"])
    first = True
    for emb in embs:
        if first:
            update_fields = {"chunk_text": emb["text"], "document_id": doc_id, "chunk_number": emb["chunk"],
                             "sbert_embedding": emb["vector"]}
            es.update(index=index, id=doc_id, doc=update_fields)
            first = False
        else:
            new_doc["chunk_text"] = emb["text"]
            new_doc["document_id"] = doc_id
            new_doc["chunk_number"] = emb["chunk"]
            new_doc["sbert_embedding"] = emb["vector"]
            es.index(index=index, document=new_doc)

    response = jsonify({"Document indexed. First chunk indexed has id": doc_id})
    response.status_code = 200
    return response


def check_user_limit(index):
    claims = get_jwt()
    source = claims['source_limit']['source']
    limit = claims['source_limit']['limit']
    query = {"bool": {"must": [{"match": {"source": source}}]}}
    res = es.search(index=index, query=query, size=0, track_total_hits=True)
    if res['hits']['total']['value'] < limit:
        return True
    else:
        return False


@ns.route(api_root + "/corpus", methods=['POST', 'GET', 'PUT'])
class CorpusQuery(Resource):
    @custom_validator()
    @ns.doc(description='Retrieve documents related to a term from EU corpus.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc..',
            security='apikey')
    @ns.expect(query_corpus_post_data)
    def post(self):
        args = request.get_json(force=True)
        print(args)
        if is_field_in_doc(args, 'term') or is_field_in_doc(args, 'semantic_sort_id') \
                or is_field_in_doc(args, 'sbert_embedding') or is_field_in_doc(args, 'aggs') \
                or is_field_in_doc(args, 'source'):
            return corpus(is_field_in_doc(args, 'term'), is_field_in_doc(args, 'n_docs'),
                          is_field_in_doc(args, 'from_doc'), is_field_in_doc(args, 'source'),
                          is_field_in_doc(args, 'collection'), is_field_in_doc(args, 'reference'),
                          is_field_in_doc(args, 'eurovoc_concept'), is_field_in_doc(args, 'eurovoc_domain'),
                          is_field_in_doc(args, 'eurovoc_mth'), is_field_in_doc(args, 'ec_priority'),
                          is_field_in_doc(args, 'sdg_domain'), is_field_in_doc(args, 'sdg_subdomain'),
                          is_field_in_doc(args, 'euro_sci_voc'), is_field_in_doc(args, 'in_force'),
                          is_field_in_doc(args, 'sort'), is_field_in_doc(args, 'semantic_sort_id'),
                          is_field_in_doc(args, 'sbert_embedding'), is_field_in_doc(args, 'author'),
                          is_field_in_doc(args, 'date_range'), is_field_in_doc(args, 'aggs'),
                          is_field_in_doc(args, 'search_type'))

    @custom_validator("admin")
    @ns.doc(description='Put a document into corpus index.',
            security='apikey')
    @ns.expect(corpus_put_data)
    def put(self):
        args = request.get_json(force=True)
        try:
            validate(instance=args, schema=inputSchemaCorpusPut)
        except jsonschema.ValidationError as err:
            return err.message
        if check_user_limit(config["index_private"]):
            return insert_doc(args, config["index_private"])
        else:
            response = jsonify('Index documents limit exeded!')
            response.status_code = 404
            return response

    @ns.expect(corpus_parser)
    @custom_validator()
    @ns.doc(description='Retrieve documents related to a term from EU corpus.'
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
            return corpus(args['term'], args['n_docs'], args['from_doc'], args['source'], args['collection'],
                          args['reference'], args['eurovoc_concept'], args['eurovoc_domain'], args['eurovoc_mth'],
                          args['ec_priority'], args['sdg_domain'], args['sdg_subdomain'], args['euro_sci_voc'],
                          args['in_force'], args['sort'], args['semantic_sort_id'], None, args['author'],
                          args['date_range'], args['aggs'], args['search_type'])


@ns.doc(description='Given an ID, the relative document from Wikipedia is shown.',
        params={'id': 'Return the document with the specified ID'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
@ns.route(api_root + "/wiki/<string:id>")
class Wiki(Resource):
    @custom_validator()
    def get(self, id):
        return {}


document_parser = reqparse.RequestParser()
document_parser.add_argument('term')
document_parser.add_argument('n_docs', type=int)


@ns.doc(description='Retrieve documents related to a term from Wikipedia',
        params={'term': 'Return documents related to the specified term.',
                'n_docs': 'Number of documents to be shown (default 10).'},
        security='apikey')
@ns.route(api_root + "/wiki")
class WikiQuery(Resource):
    @custom_validator()
    @ns.expect(document_parser)
    def get(self):
        return {}

similar_parser = reqparse.RequestParser()
similar_parser.add_argument('term', required=True)
similar_parser.add_argument('n_term', type=int)


@ns.doc(description='Given a term, return the 20 most similar terms (semantic similarity). '
                    'For each term similarity and cardinality '
                    '(number of occurrences in documents) are reported.',
        params={'term': 'The original term.',
                'n_term': 'Number of similar terms to be extracted (default 20).'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
@ns.route(api_root + "/similar")
class SimilarWords(Resource):
    @custom_validator()
    @ns.expect(similar_parser)
    def get(self):
        args = similar_parser.parse_args()
        return get_similar_words(args['term'], args['n_term'])


term_parser = reqparse.RequestParser()
term_parser.add_argument('term', required=True)


@ns.route(api_root + "/ontology")
@ns.doc(description='Return a graph that describes the ontology of the specified term. '
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
    @custom_validator()
    @ns.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()
        return build_graph(args['term'])


@ns.route(api_root + "/ontology-list")
@ns.doc(description='Return a list of lists of similar terms that describes the ontology of the specified term. '
                    'Lists are ranked by the relation strenght to a query term. The first node in each list is'
                    ' direct relation to query term. The following terms in each sublist have relation to'
                    ' the first node in a sublist.'
                    'The result should be interpretd as follows: the first item in each sublist is first level'
                    ' connection to the query term. The following terms in sublists have second level relation'
                    ' to the main query term and direct connection to the head of sublist.',
        params={'term': 'The term from which build the ontology tree.'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class OntologyList(Resource):
    @custom_validator()
    @ns.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()
        return build_tree(args['term'])


@ns.route(api_root + "/decade")
@ns.doc(description='Return data that describes how documents are placed among decades.',
        params={'term': 'The term'},
        security='apikey')
class DecadeGraph(Resource):
    @custom_validator()
    @ns.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()
        return build_decade_graph(args['term'])


@ns.route(api_root + "/term-exists")
@ns.doc(description='Return True if the word exists in the trained model else False',
        params={'term': 'The term'},
        security='apikey')
class Term(Resource):
    @custom_validator()
    @ns.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()
        return word_exists(args['term'])


distance_parser = reqparse.RequestParser()
distance_parser.add_argument('term1', required=True)
distance_parser.add_argument('term2', required=True)


@ns.route(api_root + "/distance")
@ns.doc(description='Return the semantic distance (cosine distance of vectors) between two terms.',
        params={'term1': 'First term', 'term2': 'Second term'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class Distance(Resource):
    @custom_validator()
    @ns.expect(distance_parser)
    def get(self):
        args = distance_parser.parse_args()
        return semantic_distance(args['term1'], args['term2'])


most_similar_parser = reqparse.RequestParser()
most_similar_parser.add_argument('term', required=True)
most_similar_parser.add_argument('term_list', required=True, action='split')
most_similar_parser.add_argument('top_n', type=int)


@ns.route(api_root + "/most-similar")
@ns.doc(description='Given a term and a list of terms (comma separated list), '
                    'return the 3 terms in the list that are more similar with the initial term.'
                    'Similarities are computed using semantic distance.',
        params={'term': 'The initial term.',
                'term_list': 'The list of terms from whom extract the most similar ones to the initial '
                             '(comma separated list).',
                'top_n': 'The number of terms that are returned, default 3, maximum the length of the list.'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class MostSimilar(Resource):
    @custom_validator()
    @ns.expect(most_similar_parser)
    def get(self):
        args = most_similar_parser.parse_args()
        return most_similar(args['term'], args['term_list'], args['top_n'])


parser_file = reqparse.RequestParser()
parser_file.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
parser_file.add_argument('text')


def compute_embeddings(text):
    if text is None:
        response = jsonify('No text provided.')
        response.status_code = 404
        return response
    vector = sbert_model.encode([text], convert_to_numpy=True)
    emb = {
        "embeddings": {
            "version": "sbert_vector - SentenceTransformer model all-distilroberta-v1",
            "vector": vector[0].tolist()
        }
    }
    return jsonify(emb)


def process_file(file):
    dir_name = os.path.dirname(__file__)
    target = os.path.join(dir_name, '.')
    filename = secure_filename(file.filename)
    destination = os.path.join(target, filename)
    file.save(destination)
    parsed_file = subprocess.check_output(['java', '-jar', 'tika/tika-app-2.3.0.jar', '--text', destination])
    parsed_content = parsed_file.decode('utf-8')
    os.remove(destination)
    return parsed_content


@ns.route(api_root + "/compute_embeddings")
@ns.doc(
    description='Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec. '
                'Tika is used to extract text from the provided file. '
                'If both file and text are provided, function will return text embeddings.',
    params={'file': 'File to be uploaded from which building embeddings.',
            'text': 'Plain text from which building embeddings.'},
    responses={200: 'Success'},
    security='apikey')
class ComputeEmb(Resource):
    @custom_validator()
    @ns.expect(parser_file)
    def post(self):
        args = parser_file.parse_args()
        if args['text']:
            return compute_embeddings(args['text'])
        if 'file' in request.files:
            fin = request.files['file']
            if fin:
                fin.seek(0)
                p = Popen(['java', '-jar', 'tika/tika-app-2.4.1.jar', '--text'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
                parsed_file = p.communicate(input=fin.read())[0]
                return compute_embeddings(parsed_file.decode('utf-8'))
        response = jsonify('No text provided.')
        response.status_code = 400
        return response


def get_word_suggestions(chars, n_suggestions=6):
    current_crc, crc_id = get_crc_from_es()
    if n_suggestions is None:
        n_suggestions = DEFAULT_SUGGESTION
    chars = chars.replace('"', '').lower()
    query_suggestion = {"bool": {"must": [{"prefix": {"phrase.keyword": {"value": chars}}},
                                                    {"match": {"crc.keyword": current_crc}}]}}
    resp = es.search(index=config["index-suggestion"], query=query_suggestion, size=n_suggestions)
    suggestions = []
    for sugg in resp["hits"]["hits"]:
        suggestions.append(sugg["_source"]["phrase"])
    return jsonify({"words": suggestions})


def sanitize_input(word):
    return word.replace(' ', '_').lower()


def get_similar_words(term, n_term):
    if n_term is None:
        n_term = DEFAULT_TERM_NUMBER
    term = sanitize_input(term)
    words = {'words': []}
    if not word_exists(term):
        response = jsonify(words)
        response.status_code = 200
        return response
    for x, y in terms_model.wv.most_similar(term, topn=n_term):
        words['words'].append({"similarity": str(y)[:4],
                               "similar_word": x.replace('_', ' '),
                               "cardinality": str(+terms_model.wv.vocab[x].count)})
    return jsonify(words)



def is_field_in_doc(source, field):
    if field in source:
        return source[field]
    else:
        return None


def get_vector(semantic_sort_id):
    query = {"bool": {"must": [{"match": {"_id": {"query": semantic_sort_id}}}]}}
    res = es.search(index=config['index'], query=query, _source=["sbert_embedding"])
    vector = None
    if res['hits']['total']['value'] > 0:
        vector = res['hits']['hits'][0]['_source']['sbert_embedding']
    return vector


def corpus(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
           ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort, semantic_sort_id, emb_vector, author,
           date_range, aggs, search_type):
    if search_type is None or search_type not in SEARCH_TYPES:
        search_type = "CHUNK_SEARCH"
    documents = {"total_docs": None, "documents": []}
    list_of_aggs_fields = ["source", "eurovoc_concept"]
    if aggs and aggs not in list_of_aggs_fields:
        response = jsonify('Malformed query. Wrong aggs parameter')
        response.status_code = 404
        return response


    print(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom,
          eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort,
          semantic_sort_id, emb_vector, author, date_range, aggs, search_type)


    body = build_corpus_request(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom,
                                eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort,
                                semantic_sort_id, emb_vector, author, date_range, aggs, search_type)
    print("body", body)
    res = es.msearch(searches=body)
    print("res", res)
    for k in res["responses"]:
        if "error" in k:
            response = jsonify('Malformed query.')
            response.status_code = 404
            return response
        if search_type == "DOCUMENT_SEARCH" or search_type == "ALL_CHUNKS_SEARCH":
            documents["total_docs"] = k['hits']['total']['value']
        elif search_type == "CHUNK_SEARCH":
            documents["total_docs"] = k['aggregations']['total']['value']
        if aggs:
            documents["aggregations"] = k["aggregations"][aggs]["buckets"]
        for document in k["hits"]["hits"]:
            abstract = document['_source']['abstract'] if isinstance(document['_source']['abstract'], str) else ""
            text = is_field_in_doc(document['_source'], "chunk_text")
            concordance = []
            terms = []
            if term:
                terms = toTermList(term)
            if abstract and term:
                concordance = getConcordance(abstract, terms, 100, 100)
            if text and term:
                concordance = concordance + getConcordance(text, terms, 100, 100)
            if document['_id'] == semantic_sort_id:
                # for semantic sort the semantic_sort_id document is shown on top page and must be removed from the list
                continue
            documents["documents"].append({"_id": document['_id'],
                                           "id": is_field_in_doc(document['_source'], "id"),
                                           "id_alias": is_field_in_doc(document['_source'], "id_alias"),
                                           "document_id": is_field_in_doc(document['_source'], "document_id"),
                                           "title": is_field_in_doc(document['_source'], "title"),
                                           "abstract": is_field_in_doc(document['_source'], "abstract"),
                                           "chunk_text": text,
                                           "date": is_field_in_doc(document['_source'], "date"),
                                           "source": document['_source']['source'],
                                           "score": document['_score'],
                                           "language": is_field_in_doc(document['_source'], "language"),
                                           "in_force": is_field_in_doc(document['_source'], "in_force"),
                                           "collection": is_field_in_doc(document['_source'], "collection"),
                                           "reference": is_field_in_doc(document['_source'], "reference"),
                                           "author": is_field_in_doc(document['_source'], "author"),
                                           "eurovoc_concept": is_field_in_doc(document['_source'], "eurovoc_concept"),
                                           #"eurovoc_dom": is_field_in_doc(document['_source'], "eurovoc_domain"),
                                           #"eurovoc_mth": is_field_in_doc(document['_source'], "eurovoc_mth"),
                                           "ec_priority": is_field_in_doc(document['_source'], "ec_priority"),
                                           "sdg_domain": is_field_in_doc(document['_source'], "sdg_domain"),
                                           "sdg_subdomain": is_field_in_doc(document['_source'], "sdg_subdomain"),
                                           "euro_sci_voc": is_field_in_doc(document['_source'], "euro_sci_voc"),
                                           "keywords": is_field_in_doc(document['_source'], "keywords"),
                                           "other": is_field_in_doc(document['_source'], "other"),
                                           "concordance": concordance})
    return jsonify(documents)


def toTermList(term):
    ts = term.replace('(', '').replace(')', '').replace(' ', '_').replace('_AND_', ' ').replace('_OR_', ' ').split(' ')
    return [t.replace('_', ' ').strip("\"") for t in ts]


def getConcordance(text="", phrases=[], width=150, lines=25):  # lines=0 is unlimited number of concordance lines
    mlen = 0
    for p in phrases:
        if mlen < len(p):
            mlen = len(p)
    tokens = word_tokenize(text)
    concInd = ConcordanceIndex(tokens, (lambda s: s.lower()))
    concs = []
    for phrase in phrases:
        conc = concordance(concInd, phrase, width, lines, mlen)
        for i in conc:
            concs.append(i)
    return concs


def concordance(ci, phrase, width=150, lines=25, width_add=10):
    """
    Rewrite of nltk.text.ConcordanceIndex.print_concordance that returns results
    instead of printing them. And accepts phrases.

    See:
    http://www.nltk.org/api/nltk.html#nltk.text.ConcordanceIndex.print_concordance
    """
    ptokens = word_tokenize(phrase.lower())
    context = width // 4  # approx number of words of context

    results = []
    plen = len(ptokens)
    tlen = len(ci._tokens)
    offsets = ci.offsets(ptokens[0])

    if offsets:
        phrase = []
        if lines != 0:
            lines = min(lines, len(offsets))
        else:
            lines = len(offsets)
        for i in offsets:
            if lines <= 0:
                break
            ii = 0
            for y in range(plen):
                if ci._tokens[i + y].lower() == ptokens[y]:
                    if y + 1 == plen:
                        if i - context < 0:
                            left = (' ' * width +
                                    detokenize(ci._tokens[0:i]))
                        else:
                            left = (' ' * width +
                                    detokenize(ci._tokens[i - context:i]))
                        if i + y + context > tlen:
                            right = detokenize(ci._tokens[i + 1 + y:tlen])
                        else:
                            right = detokenize(ci._tokens[i + 1 + y:i + y + context])
                        left = left[-width:]
                        right = right[:width + +width_add]
                        ph = detokenize(ci._tokens[i:i + y + 1])
                        line = (left, ph, right)
                        #                        line = '%s <em>%s</em> %s' % (left, ph, right)
                        #                        line = line[:((2*width)+width_add)]
                        results.append(line)
                        lines -= 1
                else:
                    break
    return results


def detokenize(words):
    """
    Untokenizing a text undoes the tokenizing operation, restoring
    punctuation and spaces to the places that people expect them to be.
    Ideally, `untokenize(tokenize(text))` should be identical to `text`,
    except for line breaks.
    """
    text = ' '.join(words)
    step1 = text.replace("`` ", '"').replace(" ''", '"').replace('. . .', '...')
    step2 = step1.replace(" ( ", " (").replace(" ) ", ") ")
    step3 = re.sub(r' ([.,:;?!%]+)([ \'"`])', r"\1\2", step2)
    step4 = re.sub(r' ([.,:;?!%]+)$', r"\1", step3)
    step5 = step4.replace(" '", "'").replace(" n't", "n't").replace(
        "can not", "cannot")
    step6 = step5.replace(" ` ", " '")
    return step6.strip()

def docbyid(doc_id, index):
    try:
        q = es.get(index=index, id=doc_id)
        doc = q['_source']
        return doc
    except:
        response = jsonify('ID not found.')
        response.status_code = 404
        return response


def build_graph(term):
    term = sanitize_input(term)
    if not word_exists(term):
        response = jsonify('Term out of vocabulary.')
        response.status_code = 404
        return response
    size = terms_model.wv.vocab[term].count
    graphjs = {"nodes": [{"id": term, "depth": '0', "size": size, 'graph_size': sqrt(size) // 40 + 3}],
               "links": []}
    maxwords = 7
    nodes = [x for x, y in terms_model.wv.most_similar(term, topn=maxwords)]
    done = copy.deepcopy(nodes)
    done2 = []
    for c, n in enumerate(nodes):
        size = terms_model.wv.vocab[n].count
        graphjs["nodes"].append({"id": n, "depth": '1', "size": size, "graph_size": sqrt(size) // 20 + 3})
        graphjs["links"].append({"source": term, "target": n, "value": .2})
        for m in [x for x, y in terms_model.wv.most_similar(n, topn=5)]:
            if m not in done and m != term and m not in done2:
                size = terms_model.wv.vocab[m].count
                done2.append(m)
                graphjs["nodes"].append({"id": m, "depth": '2', "size": size, "graph_size": sqrt(size) // 20 + 3})
                graphjs["links"].append({"source": n, "target": m, "value": .1})
            elif m in done2:
                graphjs["links"].append({"source": n, "target": m, "value": .1})
    return jsonify(graphjs)


def build_tree(term):
    term = sanitize_input(term)
    if not word_exists(term):
        response = jsonify('Term out of vocabulary.')
        response.status_code = 404
        return response
    graphjs = {"nodes": []}

    nodes = [sanitize_input(x) for x, y in terms_model.wv.most_similar(term, topn=20)]
    nodes2 = []
    done = []
    done2 = []
    for i in range(0, len(nodes)):
        n1 = nodes[i]
        if n1 not in done and n1 != term and n1 not in done2:
            done.append(n1)
            r = [n1]
            for j in range(i + 1, len(nodes)):
                n2 = nodes[j]
                if terms_model.similarity(n1, n2) > 0.7:
                    if n2 not in done and n2 != term and n2 not in done2:
                        done2.append(n2)
                        r.append(n2)
            nodes2.append(r)
    nodes2 = nodes2[:15]
    done = list(itertools.chain.from_iterable(nodes2))
    done2 = []
    for r in nodes2:
        r2 = copy.deepcopy(r)
        for n in r:
            for m in [sanitize_input(x) for x, y in terms_model.wv.most_similar(n, topn=7)]:
                if m not in done and m != term and m not in done2:
                    done2.append(m)
                    r2.append(m)
        graphjs["nodes"].append(r2)
    return jsonify(graphjs)


def get_clusters(term, n_terms):
    if n_terms is None:
        n_terms = DEFAULT_TERM_NUMBER
    if n_terms > 30:
        n_terms = 30
    term = sanitize_input(term)
    if not word_exists(term):
        response = jsonify('Term out of vocabulary.')
        response.status_code = 404
        return response
    words = [w for w, x in terms_model.wv.most_similar_cosmul(term, topn=n_terms)]
    df = pd.DataFrame(terms_model.wv[words], index=words)
    db = DBSCAN(eps=0.3, min_samples=2, metric='cosine', metric_params=None, algorithm='brute', p=None,
                n_jobs=1).fit(df)
    n_clusters_ = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
    print('clusters', n_clusters_, db.labels_)
    cl = {n: [] for n in db.labels_}
    for n, k in enumerate(db.labels_): cl[k].append(words[n])
    clusters = {'n_terms': n_terms, 'clusters': []}
    for k in sorted(cl):
        cluster = str(k) if k > -1 else 'Unclustered'
        clusters['clusters'].append({'cluster': cluster, 'words': cl[k]})
    return jsonify(clusters)


def build_decade_graph(word):
    query = {
        "_source": ["date"],
        "size": 0,
        "aggs": {
            "years": {
                "terms": {"field": "date", "size": 1000000}
            }

        },
        "query": {
            "bool": {
                "must": {"multi_match": {
                    "query": word.replace('_', ' '),
                    "type": "phrase",
                    "fields": ["title^10", "opening-text^3", "chunk_text", "sentences"]
                }
                },
                "filter": {"match": {"source": "bookshop OR eurlex OR cordis OR pubsy OR opendataportal"}}
            }
        }
    }
    search_arr = []
    search_arr.append({'index': config['index']})
    search_arr.append(query)
    request = ''

    for each in search_arr:
        request += '%s \n' % json.dumps(each)
    res = es.msearch(searches=request)
    a = {}
    for r in res["responses"]:
        for k in r["aggregations"]["years"]["buckets"]:
            year = int(k['key_as_string'].split("-")[0]) // 5 * 5
            if year > 2015: continue
            if year < 1990: year = year // 10 * 10
            if year not in a: a[year] = 0
            a[year] += k['doc_count']
    print('conteggio years....:', a)
    x = sorted([str(w) + "-" + str(w + 9) if w < 1990 else str(w) + "-" + str(w + 4) for w in list(a)])
    print('sorted x....:', x)

    y = [a[w] for w in sorted(list(a))]
    print('sorted y....:', y)

    decade = {'graph': [{'years': a, 'x': x, 'y': y}]}
    return jsonify(decade)


def semantic_distance(w1, w2):
    w1 = sanitize_input(w1)
    w2 = sanitize_input(w2)

    if not word_exists(w1):
        response = jsonify('Term 1 out of vocabulary.')
        response.status_code = 404
        return response

    if not word_exists(w2):
        response = jsonify('Term 2 out of vocabulary.')
        response.status_code = 404
        return response

    dist = {'distance': terms_model.wv.distance(w1, w2)}
    return jsonify(dist)


def most_similar(term, term_list, top_n):
    if top_n is None:
        top_n = 3
    if top_n > len(term_list):
        top_n = len(term_list)
    distances = {}
    term = sanitize_input(term)
    if not word_exists(term):
        response = jsonify('Term out of vocabulary.')
        response.status_code = 404
        return response
    for item in term_list:
        item = sanitize_input(item)
        if word_exists(item):
            distances[item] = terms_model.wv.distance(term, item)
    distances = sorted(distances.items(), key=lambda kv: (kv[1], kv[0]))
    out = {'most-similar': []}
    for i in distances[:top_n]:
        out['most-similar'].append({'term': i[0], 'distance': i[1]})
    return jsonify(out)


def word_exists(path):
    path = sanitize_input(path)
    try:
        terms_model.wv.vocab[path]
        return True
    except:
        return False


def tellnow_rmme():
    return datetime.datetime.now()


def parse_search_term(search_term):
    phrase = []
    if '"' not in search_term:
        best = search_term
        return best, phrase
    if search_term.count('"') % 2 == 0:
        text = search_term
        search_results = re.finditer(r'\".*?\"', text)
        for item in search_results:
            text = text.replace(item.group(0), '')
            phrase.append(item.group(0).replace('"', ''))
        best = text
        return best, phrase
    else:
        best = search_term
        return best, phrase


def bluid_search_phrase_block(search_term_phrase):
    full_block = []
    for text in search_term_phrase:
        block = {"multi_match": {
            "query": text,
            "type": "phrase",
            "fields": ["title^10", "abstract^3", "sentences", "chunk_text"],
            "zero_terms_query": "all"
        }}
        full_block.append(block)
    return full_block



def bluid_metadata_param_blocks(collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
                                ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc,
                                in_force, author, date_range, sources, search_type):
    full_block = []
    if sources:
        or_block = {"bool": {"should": []}}
        for param in sources:
            block = {"match": {"source.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if collection:
        or_block = {"bool": {"should": []}}
        for param in collection:
            block = {"match": {"collection.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if reference:
        for param in reference:
            block = {"match": {"reference.keyword": param}}
            full_block.append(block)
    if eurovoc_concept:
        or_block = {"bool": {"should": []}}
        for param in eurovoc_concept:
            block = {"match": {"eurovoc_concept.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if eurovoc_dom:
        or_block = {"bool": {"should": []}}
        for param in eurovoc_dom:
            block = {"match": {"eurovoc_domain.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if eurovoc_mth:
        or_block = {"bool": {"should": []}}
        for param in eurovoc_mth:
            block = {"match": {"eurovoc_mth.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if ec_priority:
        or_block = {"bool": {"should": []}}
        for param in ec_priority:
            block = {"match": {"ec_priority.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if sdg_domain:
        or_block = {"bool": {"should": []}}
        for param in sdg_domain:
            block = {"match": {"sdg_domain.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if sdg_subdomain:
        or_block = {"bool": {"should": []}}
        for param in sdg_subdomain:
            block = {"match": {"sdg_subdomain.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if euro_sci_voc:
        or_block = {"bool": {"should": []}}
        for param in euro_sci_voc:
            block = {"match": {"euro_sci_voc.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if in_force is not None:
        block = {"match": {"in_force": in_force}}
        full_block.append(block)
    if author:
        or_block = {"bool": {"should": []}}
        for param in author:
            block = {"match": {"author.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if date_range:
        range_block = {"range": {"date": {}}}
        for param in date_range:
            var = param.split(':')
            range_block["range"]["date"][var[0]] = var[1]
        full_block.append(range_block)
    if search_type == "DOCUMENT_SEARCH":
        block = {"match": {"chunk_number": 1}}
        full_block.append(block)
    return full_block


def build_search_query(search_term, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
                       ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, author, date_range, search_type):
    query = build_search_query_json(search_term)

    metadata_param_blocks = bluid_metadata_param_blocks(collection, reference, eurovoc_concept, eurovoc_dom,
                                                        eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain,
                                                        euro_sci_voc,
                                                        in_force, author, date_range, sources, search_type)

    if len(metadata_param_blocks) > 0:
        if not query:
            query = {"bool": {"must": []}}
        for block in metadata_param_blocks:
            query['bool']['must'].append(block)
    elif not query:
        query = {"match_all": {}}
    return query


def build_search_query_json(search_term):
    if search_term:
        search_term = search_term.replace('/', '\\\/')
        if 'AND' in search_term or 'OR' in search_term:
            search_term = search_term.replace('"', '\\"')
            query_string = '{"bool": {"must": [{"query_string": {"fields": ["title^10","abstract^3","chunk_text"],"query": "' \
                           + search_term + '","type": "phrase" }}]}}'
            
            query = json.loads(query_string)
        else:
            search_term_best, search_term_phrase = parse_search_term(search_term)
            query_string = '{"bool": {"must": [ {"multi_match": {"query": "' + search_term_best + \
                           '","type": "best_fields","fields": ["title^10", "abstract^3", "chunk_text"],' \
                           '"zero_terms_query": "all"}}]}}'
            query = json.loads(query_string)
            phrase_block = []
            if len(search_term_phrase) > 0:
                phrase_block = bluid_search_phrase_block(search_term_phrase)
            if len(phrase_block) > 0:
                for block in phrase_block:
                    query['bool']['must'].append(block)
        return query
    else:
        return None


def build_sort_body(sort):
    sort_list = []
    for item in sort:
        item_list = item.split(':')
        sort_item = {item_list[0]: {"order": item_list[1]}}
        sort_list.append(sort_item)
    return sort_list


def build_corpus_request(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom,
                         eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort,
                         semantic_sort_id, emb_vector, author, date_range, aggs, search_type):
    query = build_search_query(term, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
                               ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, author, date_range,
                               search_type)
    if semantic_sort_id or emb_vector:
        sort = None
        if semantic_sort_id:
            vector = get_vector(semantic_sort_id)
        else:
            vector = emb_vector
        if not vector:
            response = jsonify('Sbert vector is not retrieved')
            response.status_code = 404
            return response
        query_to_use = {"script_score": {
            "query": query, "script": {
                "source": "1 / (1 + l1norm(params.queryVector, 'sbert_embedding'))",
                "params": {"queryVector": vector}}}}
    else:
        query_to_use = query
    if n_docs is None:
        n_docs = DEFAULT_DOCS_NUMBER
    if from_doc is None:
        from_doc = DEFAULT_FROM_DOC_NUMBER
    if sort:
        sort_list = build_sort_body(sort)

    print(query_to_use)
    body = {       
        "size": n_docs,
        "from": from_doc,
        "track_total_hits": True,
        "query": query_to_use,
        "_source": ["id", "id_alias", "document_id", "source", "title", "abstract", "chunk_text", "collection",
                    "reference", "author",
                    "date", "link_origin", "link_alias", "link_related", "link_reference", "mime_type", "in_force",
                    "language", "eurovoc_concept",
                    "eurovoc_domain", "eurovoc_mth", "ec_priority", "sdg_domain", "sdg_subdomain", "euro_sci_voc",
                    "keywords", "other"]
    }

    if search_type == "CHUNK_SEARCH":
        body["collapse"] = {"field": "document_id"}
        body["aggs"] = {"total": {"cardinality": {"field": "document_id"}}}
    if sort:
        body['sort'] = []
        for sort_item in sort_list:
            body['sort'].append(sort_item)
    if aggs:
        if aggs == "source" or aggs == "eurovoc_concept":
            f_aggs = aggs + '.keyword'
        if body["aggs"]:
            body['aggs'][aggs] = {"terms": {"field": f_aggs}}
        else:
            body['aggs'] = {aggs: {"terms": {"field": f_aggs}}}
    search_arr = []
    search_arr.append({'index': config['index'][0]})
    search_arr.append(body)
    request = ''
    for each in search_arr:
        request += '%s \n' % json.dumps(each)
    return request

if __name__ == '__main__':
    app.run(host=config['api-host'], port=config['api-port'])
