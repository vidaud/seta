import json
from pathlib import Path


def load_users_data(file_path: str = "../data/users.json") -> dict:
    """Load test users."""

    base_path = Path(__file__).parent
    users_full_path = (base_path / file_path).resolve()

    with open(users_full_path, encoding="utf-8") as fp:
        data = json.load(fp)

        return data
