from datetime import datetime


def default_rolling_index(now_date: datetime) -> dict:
    """Default rolling index record."""

    return {
        "rolling_index_name": "default",
        "title": "Default",
        "description": "Default rolling index for data storage",
        "is_default": True,
        "is_disabled": False,
        "created_at": now_date,
        "limits": {"total_files_no": -1, "total_storage_gb": 100},
        "storage": [
            {
                "name": "default_001",
                "parent": "default",
                "sequence": 1,
                "is_active": True,
                "created_at": now_date,
            }
        ],
    }
