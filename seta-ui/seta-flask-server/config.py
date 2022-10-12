"""seta-ui flask configuration."""

from datetime import timedelta
from os.path import exists
import os
import secrets

    
class Config:
    """Common configuration"""
    
    AUTH_CAS_URL = "https://webgate.ec.europa.eu/cas/"
    
    MONGO_URI = "mongodb://seta-mongo:27017/seta"
    
    SECRET_KEY_PATH = "/home/seta/models/key.txt"
    SECRET_KEY = "" 
    JWT_SECRET_KEY = ""    
    JWT_IDENTITY_CLAIM="username"
    JWT_EXPIRY_INTERVAL = float(3600)
    
    SCHEDULER_API_ENABLED= False
    
    FLASK_ENV = "development"
    DEBUG = False
    
    
    #ROOT_USERS = ["vidas.daudaravicius@ec.europa.eu","lucia.noce@ext.ec.europa.eu"]    
        
    def __init__(self) -> None:             
        """Read the secret from the key file"""
        
        if exists(self.SECRET_KEY_PATH):
            with open(self.SECRET_KEY_PATH, "r") as fobj:
                self.SECRET_KEY = fobj.readline()
        else:
            self.SECRET_KEY = secrets.token_hex(16)
            
            with open(self.SECRET_KEY_PATH, "w") as f1:
                f1.write(self.SECRET_KEY)                
            
        self.JWT_SECRET_KEY = self.SECRET_KEY
        
        """Read environment variables"""        
        self.FLASK_PATH = os.environ.get('FLASK_PATH', 'http://localhost')
        self.API_TARGET_PATH = os.environ.get('FLASK_PATH', 'seta-api:8081/seta-api/api/v1')
        
            
class DevConfig(Config):
    Config.FLASK_ENV = "development"
    Config.DEBUG = True
    #API_TARGET_PATH = "seta-api:8081/seta-api/api/v1"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=1)
    
class TestConfig(Config):
    Config.FLASK_ENV = "test"
    Config.DEBUG = True
    #API_TARGET_PATH = "seta-api:8081/seta-api/api/v1"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24)    
    
class ProdConfig(Config):
    Config.FLASK_ENV = "production"
    Config.DEBUG = False
    #API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=6)

"""
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
"""