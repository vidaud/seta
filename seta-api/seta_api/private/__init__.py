from flask_restx import Api
from flask import Blueprint

from .resources import private_resource_ns
from .testing import test_ns

private_bp_v1 = Blueprint('seta-api-private-v1', __name__, url_prefix="/seta-api-private/v1")

private_api = Api(private_bp_v1,
         title='SeTA API - Private',
         version='1.0',
         description='SeTA API Private methods for backend communications',
         doc='/doc',
         default_swagger_filename="/swagger_private.json"
         )

private_api.add_namespace(private_resource_ns, path="/resource")


test_bp = Blueprint('seta-api-test', __name__, url_prefix="/seta-api-test")
test_api= Api(test_bp,
            title='SeTA API - Test',
            version='1.0',
            description='SeTA API Testing',
            doc='/doc',
            default_swagger_filename="/swagger_test.json"
         )
test_api.add_namespace(test_ns, path="/")