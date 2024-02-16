import time

from opensearchpy import OpenSearch

from flask import Flask, request, g, Response, json
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import get_jwt_identity

from search.infrastructure.extensions import jwt, logs
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

    with app.app_context():

        # Log requests
        @app.before_request
        def before_request():
            g.start = time.time()

        @app.after_request
        def after_request(response: Response):
            """Logging after every request."""

            if app.testing:
                app.logger.debug(
                    "%s: %s, json: %s",
                    request.path,
                    response.status_code,
                    response.data,
                )
                return response

            username = "unknown"
            try:
                username = get_jwt_identity()
            except Exception:
                pass  # suppress all exceptions

            diff = time.time() - g.start
            error_message = None
            if response.status_code != 200 and response.json:
                if "error" in response.json:
                    error_message = response.json["error"]
                elif "msg" in response.json:
                    error_message = response.json["msg"]
                elif "message" in response.json:
                    error_message = response.json["message"]

            log_json = {
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
            }

            app.logger.info(log_json)

            return response

    return app


def init(app):
    """Initialize the application."""

    app.es = OpenSearch(
        "http://" + app.config["ES_HOST"], verify_certs=False, request_timeout=120
    )

    if not app.testing:
        wait_for_es(app)

    app.logger.info("SeTA-SEARCH is up and running.")


def wait_for_es(app):
    """Wait for the Search Engine to be ready."""

    host = app.config["ES_HOST"]
    esh = f"http://{host}/_cluster/health?pretty"
    app.logger.info(f"Waiting for Search Engine {esh} ...")

    try:
        es_session = requests.Session()
        es_session.trust_env = False
        res = es_session.get(esh)

        if res.ok:
            res = json.loads(res.content)
            app.logger.info("OpenSearch..." + res["status"])
            if res["status"] == "green" or res["status"] == "yellow":
                total = app.es.count(index=app.config["INDEX"][0])["count"]
                app.logger.info(f"Total number of documents indexed: {total}")

                return

        time.sleep(5)
        wait_for_es(app)
    except Exception:
        app.logger.exception("Search Engine not ready yet")

        time.sleep(5)
        wait_for_es(app)


def register_blueprints(app):
    """Register flask blueprints"""

    app.register_blueprint(apis_bp_v1)


def register_extensions(app: Flask):
    """Register application extensions"""

    jwt.init_app(app)

    try:
        logs.init_app(app)
    except Exception:
        app.logger.error("logs config failed")
