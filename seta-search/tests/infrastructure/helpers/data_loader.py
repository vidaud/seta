import json
from pathlib import Path


def _load_file_data(file_path: str) -> dict:
    """Load data from file."""

    base_path = Path(__file__).parent
    full_path = (base_path / file_path).resolve()

    with open(full_path, encoding="utf-8") as f:
        data = json.load(f)

        return data


def load_users_data(file_path="../data/users.json") -> dict:
    """Load test users."""

    return _load_file_data(file_path=file_path)


def load_data_sources(file_path="../data/data_sources.json") -> dict:
    """Load test data sources."""

    return _load_file_data(file_path=file_path)
