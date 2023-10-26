from flask import current_app


def auth_headers(access_token: str) -> dict:
    """Authorization header."""

    return {"Authorization": f"Bearer {access_token}"}


def get_private_key(user_id: str) -> str:
    """Read private key from local file."""

    data_path = "../tests/infrastructure/data"
    # read private key
    key_path = f"{data_path}/{user_id}.key"
    with current_app.open_resource(resource=key_path) as fk:
        return fk.read().decode("utf8")
