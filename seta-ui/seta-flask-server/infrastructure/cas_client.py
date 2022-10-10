from cas import CASClient
from flask import current_app as app

cas_client = CASClient(
    version=3,
    service_url = app.config["FLASK_PATH"] +
    "/seta-ui/login",  # ?next=%2Fseta-ui%2Fseta
    server_url = app.config["AUTH_CAS_URL"],
)