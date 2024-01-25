from http import HTTPStatus
from requests import Response
from Crypto.PublicKey import RSA


def auth_headers(access_token: str) -> dict:
    """Authorization header."""

    return {"Authorization": f"Bearer {access_token}"}


def get_private_key(user_id: str, user_key_pairs: dict) -> str:
    """Read private key from rsa pairs collection."""

    pair = user_key_pairs.get(user_id, None)

    if pair:
        return pair["privateKey"]

    return None


def get_public_key(user_id: str, user_key_pairs: dict) -> str:
    """Read public key from rsa pairs collection."""

    pair = user_key_pairs.get(user_id, None)

    if pair:
        return pair["publicKey"]

    return None


def get_access_token(response: Response) -> str:
    """Read access token from response."""

    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    return response_json["access_token"]


def generate_rsa_pair() -> dict:
    """Generate rsa pair."""

    key_pair = RSA.generate(bits=4096)

    # public key
    pub_key = key_pair.public_key()
    pub_key_pem = pub_key.export_key()
    decoded_pub_key_pem = pub_key_pem.decode("ascii")

    # private key
    priv_key_pem = key_pair.export_key()
    decoded_priv_key_pem = priv_key_pem.decode("ascii")

    return {"privateKey": decoded_priv_key_pem, "publicKey": decoded_pub_key_pem}
