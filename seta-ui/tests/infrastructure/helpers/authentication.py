from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import random
import string
from typing import Tuple

from flask import json
from flask.testing import FlaskClient

from .util import get_private_key

def generate_signature(private_key: str) -> Tuple[str, str]:
    '''
    Generate a random message and its signature bases on a private key

    :param private_key:
        The encoded private key
    '''

    key = RSA.import_key(private_key)
    # create a message
    random_string = ''.join((random.choice(string.ascii_lowercase) for x in range(20)))
    # Signing
    digest = SHA256.new(random_string.encode())
    signature = pkcs1_15.new(key).sign(digest)

    return random_string, str(signature.hex())

def login_user(client: FlaskClient, user_id: str):

    private_key = get_private_key(user_id)
    message, signature = generate_signature(private_key)


    payload = {
        "user_id": user_id,
        "rsa_original_message": message,
        "rsa_message_signature": signature
        }

    url = "/authentication/v1/user/token"
    data = json.dumps(payload)    
    return client.post(url, data=data, content_type='application/json')

def logout_user(client: FlaskClient, access_token: str):
    return client.post(
        "/logout", headers={"Authorization": f"Bearer {access_token}"}
    )