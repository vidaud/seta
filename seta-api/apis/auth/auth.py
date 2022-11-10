from flask_restx import Namespace, Resource, fields
from flask import current_app as app, jsonify, request
from flask_jwt_extended import create_access_token
import datetime
import time

from infrastructure.db.db_users_broker import getDbUser
from .auth_logic import validate_public_key

auth_api = Namespace('seta-api', description='JWT token')

auth_data = auth_api.model(
    "get_token_params",
    {'username': fields.String(description="Username"),
     'rsa_original_message': fields.String(description="Original message"),
     'rsa_message_signature': fields.String(description="Signature using hex format, string of hexadecimal numbers.")
     }
)

@auth_api.route(app.api_root + "/get-token", methods=['POST', 'GET'])
class JWTtoken(Resource):
    @auth_api.doc(description="JWT token for users, expiration 1 day.\n"
                        'Python example <a href="example_get-token_user.py" target="_blank" download="example_get-token_user.py">here</a>',
            responses={200: 'Success',
                       501: 'Invalid Username',
                       502: 'Invalid Signature'})
    @auth_api.expect(auth_data)

    def post(self):
        args = request.get_json(force=True)
        
        exists, role, public, source_limit = getDbUser(args['username'])
        if not exists:
            return jsonify({"error": "Invalid Username"}), 501
        
        if not validate_public_key(public, args['rsa_original_message'], args['rsa_message_signature']):
            return jsonify({"error": "Invalid Signature"}), 502
        
       
        additional_claims = {"role": role, "source_limit": source_limit}
        access_token = "Bearer " + create_access_token(identity=args['username'],
                                                        expires_delta=datetime.timedelta(days=1),
                                                        additional_claims=additional_claims)
        return jsonify(access_token=access_token)
       

    @auth_api.doc(description='JWT token for GUEST users, expiration 1 hour.\n'
                        'Python example <a href="example_get-token_guest.py" target="_blank" download="example_get-token_guest.py">here</a>',
            responses={200: 'Success'})
    def get(self):
        user_number = str(time.time())
        additional_claims = {"role": None}
        access_token = "Bearer " + create_access_token(identity="guest-" + user_number,
                                                       expires_delta=datetime.timedelta(hours=1),
                                                       additional_claims=additional_claims)
        return jsonify(access_token=access_token)
    
   