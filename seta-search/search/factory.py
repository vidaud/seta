import time
import logging

from opensearchpy import OpenSearch

from flask import (Flask, request, g, Response, json)
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from search.infrastructure.extensions import (jwt, logs)
from search.apis import apis_bp_v1

import requests


def create_app(config_object):
    """Main app factory"""

    app = Flask(__name__)
    # Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)

    app.config.from_object(config_object)
    # app.logger.debug(app.config)

    register_extensions(app)
    register_blueprints(app)
    
    init(app)

    CORS(app)    

    request_endswith_ignore_list = ['.js', '.css', '.png', '.ico', '.svg', '.map', '.json', 'doc']
    with app.app_context():

        # Log requests
        @app.before_request
        def before_request():
            g.start = time.time()

        @app.after_request
        def after_request(response: Response):
            """ Logging after every request. """
            
            if request.path.endswith(tuple(request_endswith_ignore_list)):
                return response
            
            if app.testing:
                app.logger.debug(request.path + ": " + str(response.status_code) + ", json: " + str(response.data))
                return response  
            
            try:
                verify_jwt_in_request()
            except:
                # return orginal response if jwt verification failed
                return response

            username = get_jwt_identity()
            diff = time.time() - g.start
            error_message = None
            if response.status_code != 200 and response.json:
                if 'error' in response.json:
                    error_message = response.json["error"]
                elif 'msg' in response.json:
                    error_message = response.json["msg"]
                elif 'message' in response.json:
                    error_message = response.json["message"]

            try:
                logger_db = logging.getLogger("mongo")
                if logger_db:
                    logger_db.info("seta-api request",
                                   extra={
                                       "username": username,
                                       "address": request.remote_addr,
                                       "method": request.method,
                                       "path": request.full_path,
                                       "status": response.status,
                                       "content_length": response.content_length,
                                       "referrer": request.referrer,
                                       "error_message": error_message,
                                       "execution_time": diff,
                                       "user_agent": repr(request.user_agent),
                                   })
            except:
                app.logger.exception("seta-api logger db exception")

            return response

    return app


def init(app):
    app.es = OpenSearch("http://" + app.config["ES_HOST"], verify_certs=False, request_timeout=120)

    if not app.testing:
        wait_for_es(app)


    app.logger.info("SeTA-SEARCH is up and running.")


def wait_for_es(app):
    host = app.config["ES_HOST"]
    esh = f"http://{host}/_cluster/health?pretty"
    app.logger.info(f'Waiting for Search Engine {esh} ...')
    
    try:
        es_session = requests.Session()
        es_session.trust_env = False
        res = es_session.get(esh)
        
        if res.ok:
            res = json.loads(res.content)
            app.logger.info("OpenSearch..." + res['status'])
            if res['status'] == 'green' or res['status'] == 'yellow':
                total = app.es.count(index=app.config["INDEX"][0])['count']
                app.logger.info(f"Total number of documents indexed: {total}")
                
                return
            
        time.sleep(5)
        wait_for_es(app)
    except Exception:
        app.logger.exception("Search Engine not ready yet")
        
        time.sleep(5)
        wait_for_es(app)


def register_blueprints(app):
    app.register_blueprint(apis_bp_v1)


def register_extensions(app):
    jwt.init_app(app)    
    
    try:
        logs.init_app(app)
    except:
        app.logger.error("logs config failed")
