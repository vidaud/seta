from http import HTTPStatus
from requests import Response


def auth_headers(access_token: str) -> dict:
    return {"Authorization": "Bearer {}".format(access_token)}


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
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    return response_json["access_token"]
