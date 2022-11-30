from flask_restx import Api, Resource, fields
from flask import Blueprint
from flask import jsonify, request, abort
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity, jwt_required
import time
from infrastructure.helpers import validate_public_key

from db.db_users_broker import getDbUser
from db.db_rsa_keys_broker import getDbRsaKey

token_auth = Blueprint('token_auth', __name__)
auth_api = Api(token_auth, 
               version="1.0",
               title="JWT token authentication",
               doc="/doc",
               description="JWT authetication for user and guests"
               )
ns_auth = auth_api.namespace("", "Authentication endpoints")


auth_data = ns_auth.model(
    "token_params",
    {'username': fields.String(required=True, description="Username"),
     'rsa_original_message': fields.String(required=True, description="Original message"),
     'rsa_message_signature': fields.String(required=True, description="Signature using hex format, string of hexadecimal numbers.")
     }
)

@ns_auth.route("/user/token", methods=['POST'])
class JWTUserToken(Resource):
    @auth_api.doc(description="JWT token for users",
            responses={200: 'Success',
                       501: 'Invalid Username',
                       502: 'Invalid Signature'})
    @auth_api.expect(auth_data)

    def post(self):
        args = request.get_json(force=True)
        
        username = args['username']
        user = getDbUser(username)
        if not user:
            abort(501, "Invalid Username")
            
        public = getDbRsaKey(username, True)        
        if not validate_public_key(public, args['rsa_original_message'], args['rsa_message_signature']):
            abort(502, "Invalid Signature")        
       
        access_token = create_access_token(identity=username, fresh=True)
        refresh_token = create_refresh_token(identity=username)
        
        return jsonify(access_token=access_token, refresh_token=refresh_token)
    
@ns_auth.route("/user/guest", methods=['POST'])
class JWTGuestToken(Resource):
    @auth_api.doc(description="JWT token for guests",
            responses={200: 'Success'})
    
    def post(self):
        iat = time.time()
        username = "guest-" + str(iat)
        
        additional_claims = {
            "user": {"username": username},
            "iat": iat,
            "iss": "SETA Flask server",
            "sub": username,
            "role": "guest",
            "source_limit": 5
        }     
       
        access_token = create_access_token(identity=username, fresh=True, additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=username, additional_claims=additional_claims)
        
        return jsonify(access_token=access_token, refresh_token=refresh_token)
    
refresh_parser = ns_auth.parser()
refresh_parser.add_argument("Authorization", location="headers", required=False, type="apiKey")
refresh_parser.add_argument("X-CSRF-TOKEN", location="headers", required=False, type="string")

@ns_auth.route("/refresh", methods=['POST']) 
@ns_auth.expect(refresh_parser)   
class JWTRefreshToekn(Resource):
    @auth_api.doc(description="JWT refresh access token",
            responses={200: 'Success', 401: "Refresh token verification failed"})
    
    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity, fresh=False)
        return jsonify(access_token=access_token)        
    

    