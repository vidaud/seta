from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import random
import string
from typing import Tuple
import requests

from flask import json

from .util import get_private_key


def generate_signature(private_key: str) -> Tuple[str, str]:
    """
    Generate a random message and its signature bases on a private key

    :param private_key:
        The encoded private key
    """

    key = RSA.import_key(private_key)
    # create a message
    random_string = "".join((random.choice(string.ascii_lowercase) for x in range(20)))
    # Signing
    digest = SHA256.new(random_string.encode())
    signature = pkcs1_15.new(key).sign(digest)

    return random_string, str(signature.hex())


def login_user(
    auth_url: str, user_id: str, user_key_pairs: dict, provider: str = "ECAS"
):
    private_key = get_private_key(user_id, user_key_pairs)

    if not private_key:
        raise Exception(f"{user_id} not found in the test rsa pairs!")

    message, signature = generate_signature(private_key)

    payload = {
        "username": user_id.lower(),
        "provider": provider.lower(),
        "rsa_original_message": message,
        "rsa_message_signature": signature,
    }

    data = json.dumps(payload)
    return requests.post(
        auth_url, data=data, headers={"Content-Type": "application/json"}
    )
