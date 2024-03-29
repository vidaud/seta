"""Flask seta-ui application factory"""

from flask import Flask, Response, request
from sqlalchemy import text
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import get_jwt_identity
from flask_injector import FlaskInjector

from seta_flask_server.infrastructure.extensions import (
    scheduler,
    jwt,
    logs,
    db,
    migrate,
)

from seta_flask_server.postg_dependency import PostgresDbClientModule


#! used by flask-migration
# pylint: disable-next=wildcard-import, unused-wildcard-import
from seta_flask_server.repository.orm_models import *


def create_app(config_object):
    """Web service app factory"""

    app = Flask(__name__)
    # Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)

    app.config.from_object(config_object)

    # use flask.json in all modules instead of python built-in json
    # app.json_provider_class = MongodbJSONProvider

    register_extensions(app)

    with app.app_context():
        register_blueprints(app)

        try:
            db.session.execute(text("SELECT 1"))

            app.logger.info("Database connection established.")
        except Exception as e:
            app.logger.error("Database connection failed: %s", e)

    request_endswith_ignore_list = [
        ".js",
        ".css",
        ".png",
        ".ico",
        ".svg",
        ".map",
        ".json",
        "doc",
    ]

    @app.after_request
    def after_request(response: Response):
        """Logging after every request."""

        if request.path.endswith(tuple(request_endswith_ignore_list)):
            return response

        if app.testing:
            # pylint: disable-next=no-member
            app.logger.debug(
                {
                    "path": request.path,
                    "status_code": response.status_code,
                    "json": response.data,
                }
            )
            return response

        user_id = "unknown"
        try:
            identity = get_jwt_identity()

            if identity:
                user_id = identity["user_id"]
        except Exception:
            pass  # suppress all exceptions

        log_json = {
            "user_id": user_id,
            "address": request.remote_addr,
            "method": request.method,
            "path": request.full_path,
            "status": response.status,
            "content_length": response.content_length,
            "referrer": request.referrer,
            "user_agent": repr(request.user_agent),
        }

        app.logger.info(log_json)

        return response

    if app.config.get("SCHEDULER_ENABLED", False):
        # pylint: disable-next=import-outside-toplevel, unused-import
        from seta_flask_server.infrastructure.scheduler import (
            tasks,
            events,
        )

        scheduler.start()
        # pylint: disable-next=no-member
        app.logger.info("Tasks scheduler has started.")

    FlaskInjector(
        app=app,
        modules=[PostgresDbClientModule()],
    )

    return app


def register_blueprints(app):
    """Register seta-ui blueprints"""

    # pylint: disable=import-outside-toplevel
    from .blueprints.profile import profile_bp_v1
    from .blueprints.catalogue import catalogue_bp_v1
    from .blueprints.admin import admin_bp
    from .blueprints.data_sources import data_sources_bp_v1

    api_root_v1 = "/seta-ui/api/v1"

    app.register_blueprint(profile_bp_v1, url_prefix=api_root_v1)

    app.register_blueprint(catalogue_bp_v1, url_prefix=api_root_v1)

    app.register_blueprint(data_sources_bp_v1, url_prefix=api_root_v1)

    app.register_blueprint(admin_bp, url_prefix=api_root_v1)


def register_extensions(app: Flask):
    """Register application extensions"""

    db.init_app(app)
    migrate.init_app(app, db)
    scheduler.init_app(app)
    jwt.init_app(app)

    try:
        logs.init_app(app)
    except Exception as e:
        app.logger.error("logs config failed", e)
