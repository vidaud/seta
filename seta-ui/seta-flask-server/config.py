"""seta-ui flask configuration."""

from datetime import timedelta
from os.path import exists
import os
import secrets

    
class Config:
    """Common configuration"""
        
    #AUTH_CAS_URL = "https://ecas.ec.europa.eu/cas/"
    AUTH_CAS_URL = "https://webgate.ec.europa.eu/cas/"
    DB_HOST="seta-mongo"
    DB_PORT=27017
    MONGO_URI = ""
    #MONGO_URI = "mongodb://seta-mongo:27017/seta"
    
    #JWT variables
    SECRET_KEY_PATH = "/home/seta/models/key.txt"
    JWT_SECRET_KEY = ""    
    JWT_IDENTITY_CLAIM="seta_id"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_TOKEN_LOCATION=["headers", "cookies"]
    
    #Scheduler variables
    SCHEDULER_API_ENABLED = False
    
    #Flask env variables
    FLASK_PATH = ""
    API_TARGET_PATH = ""
    
    #LogSetup variables
    LOG_TYPE = "stream"
    LOG_LEVEL = "INFO"
    LOG_DIR = "/"
    APP_LOG_NAME = ""
    WWW_LOG_NAME = ""
    SCHEDULER_LOG_NAME = ""
    LOG_MAX_BYTES = "100_000"
    LOG_COPIES = "5"
    
    ROOT_USERS = []
    
    #disable the mask documentation in swagger
    RESTX_MASK_SWAGGER=False
        
    def __init__(self) -> None:             
        """Read environment variables"""               
        
        #read key from the key.txt file
        if exists(Config.SECRET_KEY_PATH):
            with open(Config.SECRET_KEY_PATH, "r") as fobj:
                self.SECRET_KEY = fobj.readline()
        else:
            self.SECRET_KEY = secrets.token_hex(16)
            
            with open(Config.SECRET_KEY_PATH, "w") as f1:
                f1.write(self.SECRET_KEY)

        Config.MONGO_URI = f"mongodb://{Config.DB_HOST}:{Config.DB_PORT}/seta"        
            
        Config.JWT_SECRET_KEY = self.SECRET_KEY
        
        #Read admin users and change values to lower
        root_users = os.environ.get('ROOT_USERS')
        #print("ROOT_USERS " + str(root_users))
        if root_users is not None:
            admins = root_users.split(sep=";")
            Config.ROOT_USERS = list(map(str.lower,admins))
            #print("ROOT_USERS after split: " + str(Config.ROOT_USERS))
        
        #Read flask environment variables
        Config.FLASK_PATH = os.environ.get('FLASK_PATH', 'http://localhost')
        Config.API_TARGET_PATH = os.environ.get('FLASK_PATH', 'seta-api:8081/seta-api/api/v1')
        
        #Read logging environment variables
        Config.LOG_TYPE = os.environ.get("LOG_TYPE", "stream")
        Config.LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
        Config.LOG_DIR = os.environ.get("LOG_DIR", "/var/log")
        Config.APP_LOG_NAME = os.environ.get("APP_LOG_NAME", "app.log")
        Config.WWW_LOG_NAME = os.environ.get("WWW_LOG_NAME", "www.log")
        Config.SCHEDULER_LOG_NAME = os.environ.get("SCHEDULER_LOG_NAME", "sched.log")
        Config.LOG_MAX_BYTES = os.environ.get("LOG_MAX_BYTES", 100_000_000)  # 100MB in bytes
        Config.LOG_COPIES = os.environ.get("LOG_COPIES", 5)
        
            
class DevConfig(Config):  
    """Development config"""
    
    FLASK_ENV = "development"
    DEBUG = True
    SCHEDULER_ENABLED = False
    
    #JWT variables
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_COOKIE_SECURE = False
    
    GITHUB_CLIENT_ID = "ea09540bb092bd7af2f4"
    GITHUB_CLIENT_SECRET = "b9e76828307f1bb849f7b47a97c1b7c9ca3361df"
    
    
    
class TestConfig(Config):
    """Test config"""
    
    FLASK_ENV = "test"
    DEBUG = False 
    SCHEDULER_ENABLED = False       
    
    #JWT variables
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24)    
    JWT_COOKIE_SECURE = True
    
    GITHUB_CLIENT_ID = "ea09540bb092bd7af2f4"
    GITHUB_CLIENT_SECRET = "b9e76828307f1bb849f7b47a97c1b7c9ca3361df"
    
class ProdConfig(Config):
    """Production config"""
    
    FLASK_ENV = "production"
    DEBUG = False  
    SCHEDULER_ENABLED = True
    
    #JWT variables
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=2)
    JWT_COOKIE_SECURE = True
    
    GITHUB_CLIENT_ID = "ea09540bb092bd7af2f4"
    GITHUB_CLIENT_SECRET = "b9e76828307f1bb849f7b47a97c1b7c9ca3361df"