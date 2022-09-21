import os
from datetime import timedelta
from os.path import exists
import secrets


FLASK_APP = "app.py"
FLASK_ENV = "docker"
LOGIN_EXPIRY_DEV = timedelta(minutes=30)
REFRESH_EXPIRY_DEV = timedelta(days=6)
LOGIN_EXPIRY_TEST = timedelta(minutes=60)
REFRESH_EXPIRY_TEST = timedelta(days=6)
LOGIN_EXPIRY_PROD = timedelta(minutes=60)
REFRESH_EXPIRY_PROD = timedelta(days=6)
SECRET_KEY_PATH = "/home/seta/models/key.txt"

if exists(SECRET_KEY_PATH):
    f1 = open(SECRET_KEY_PATH, "r")
    SECRET_KEY = f1.readline()
    f1.close()
else:
    token = secrets.token_hex(16)
    f1 = open(SECRET_KEY_PATH, "w")
    SECRET_KEY = token
    f1.write(token)
    f1.close()


SCHEDULER_API_ENABLED= False
JWT_IDENTITY_CLAIM="username"
ROOT_USERS = ["vidas.daudaravicius@ec.europa.eu","lucia.noce@ext.ec.europa.eu"]


# os.environ variables will be taken from .env file
# environment = os.environ.get("FLASK_ENV")

# SECRET_KEY = os.environ.get("SECRET_KEY")

if "serve" == FLASK_ENV:
    ANGULAR_PATH = "http://localhost:4200"
    FLASK_PATH = "http://localhost:8080"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_EXPIRY_INTERVAL = 3600
    JWT_ACCESS_TOKEN_EXPIRES = LOGIN_EXPIRY_DEV
    MONGO_DB = "mongodb://localhost:27017/"
    JWT_REFRESH_TOKEN_EXPIRES = REFRESH_EXPIRY_DEV


if "dev" == FLASK_ENV:
    FLASK_PATH = "http://localhost:8080"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_EXPIRY_INTERVAL = 3600
    JWT_ACCESS_TOKEN_EXPIRES = LOGIN_EXPIRY_DEV
    MONGO_DB = "mongodb://localhost:27017/"
    JWT_REFRESH_TOKEN_EXPIRES = REFRESH_EXPIRY_DEV

if "docker" == FLASK_ENV:
    FLASK_PATH = "http://localhost"
#    API_TARGET_PATH = "host.docker.internal/seta-api/api/v1"
    API_TARGET_PATH = "seta-api:8081/seta-api/api/v1"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_EXPIRY_INTERVAL = 3600
    JWT_ACCESS_TOKEN_EXPIRES = LOGIN_EXPIRY_DEV
    JWT_REFRESH_TOKEN_EXPIRES = REFRESH_EXPIRY_TEST
#    MONGO_DB = "mongodb://host.docker.internal:27017/"
    MONGO_DB = "mongodb://seta-mongo:27017/"


if "test" == FLASK_ENV:
    FLASK_PATH = "https://seta-test.emm4u.eu"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_EXPIRY_INTERVAL = 3600
    JWT_ACCESS_TOKEN_EXPIRES = LOGIN_EXPIRY_TEST
    JWT_REFRESH_TOKEN_EXPIRES = REFRESH_EXPIRY_TEST
    MONGO_DB = "mongodb://localhost:27017/"



if "production" == FLASK_ENV:
    FLASK_PATH = "https://seta.emm4u.eu"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_EXPIRY_INTERVAL = 3600
    JWT_ACCESS_TOKEN_EXPIRES = LOGIN_EXPIRY_PROD
    JWT_REFRESH_TOKEN_EXPIRES = REFRESH_EXPIRY_PROD
    MONGO_DB = "mongodb://seta-mongo:27017/"

JWT_EXPIRY_INTERVAL = float(JWT_EXPIRY_INTERVAL)
