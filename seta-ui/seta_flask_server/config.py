"""seta-ui flask configuration."""

from datetime import timedelta
from os.path import exists
import os
import secrets

    
class Config:
    """Base class for common configuration"""
        
    #============Seta Configuration ========#
    
    #EU LOGIN authentication url
    #AUTH_CAS_URL = "https://ecas.ec.europa.eu/cas/"
    AUTH_CAS_URL = "https://webgate.ec.europa.eu/cas/"
    
    #database host - docker container for mongo
    DB_HOST="seta-mongo"
    
    #database port
    DB_PORT=27017
    
    #databse name
    DB_NAME="seta"
    
    #administrators email list - new user is set as admin if email present in this list
    #set from docker ENV variable
    ROOT_USERS = []
    
    #seta-ui root path - used in third-party authentication callbacks
    #set from docker ENV variable
    APP_ROOT_PATH = ""
    
    #======================================#
    
    
    #===========Flask-PyMongo Configuration========#
    #https://flask-pymongo.readthedocs.io/en/latest/
    
    MONGO_URI = f"mongodb://{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    #======================================#  
    
    
    #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
    
    #The secret key used to encode and decode JWTs
    #set from file at SECRET_KEY_PATH
    JWT_SECRET_KEY = ""    
    
    #The claim in a JWT that is used as the source of identity
    JWT_IDENTITY_CLAIM="seta_id"
    
    #Enable Cross Site Request Forgery (CSRF) protection
    JWT_COOKIE_CSRF_PROTECT = True
    
    #Where to look for a JWT when processing a request in the specified order.
    JWT_TOKEN_LOCATION=["headers", "cookies"]
    #======================================#
    
    #============Flask-APScheduler Configuration========#
    #https://viniciuschiele.github.io/flask-apscheduler/rst/configuration.html
    
    #disable Flask-APScheduler build-in API
    SCHEDULER_API_ENABLED = False
    #======================================#   
    
    #============Flask Configuration========#
    #https://flask.palletsprojects.com/en/2.2.x/config/
    
    #Exceptions are re-raised rather than being handled by the app's error handlers.     
    PROPAGATE_EXCEPTIONS = True
    
    #A secret key that will be used for securely signing the session cookie
    #set from file at SECRET_KEY_PATH
    SECRET_KEY = ""
    
    #======================================#
    
    #===========LogSetup Configuration========#
    #https://medium.com/tenable-techblog/the-boring-stuff-flask-logging-21c3a5dd0392
    #https://github.com/tenable/flask-logging-demo
    
    #These configs are read from Docker ENV variables
    
    # Logging Setup
    LOG_TYPE = "stream"
    LOG_LEVEL = "INFO"
    
    # File Logging Setup
    LOG_DIR = "/var/log"
    APP_LOG_NAME = "app.log"
    WWW_LOG_NAME = "www.log"
    SCHEDULER_LOG_NAME = "sched.log"
    LOG_MAX_BYTES = "100_000" # 10MB in bytes
    LOG_COPIES = "5" 
    #======================================#       
    
    
    #===========Flask-RESTX Configuration========#
    #https://flask-restx.readthedocs.io/en/latest/configuration.html
    
    #disable the mask documentation in swagger
    RESTX_MASK_SWAGGER=False    
    #======================================# 
        
    def __init__(self) -> None:             
        """Read environment variables"""               
        
        '''
        #read key from the key.txt file        
        if exists(Config.SECRET_KEY_PATH):
            with open(Config.SECRET_KEY_PATH, "r") as fobj:
                Config.SECRET_KEY = fobj.readline()
        else:
            Config.SECRET_KEY = secrets.token_hex(16)
            
            with open(Config.SECRET_KEY_PATH, "w") as f1:
                f1.write(Config.SECRET_KEY)
        '''
                
        Config.SECRET_KEY = os.environ["API_SECRET_KEY"]            
        Config.JWT_SECRET_KEY = Config.SECRET_KEY
        
        #Read admin users and change values to lower
        root_users = os.environ.get('ROOT_USERS')
        if root_users is not None:
            admins = root_users.split(sep=";")
            Config.ROOT_USERS = list(map(str.lower,admins))
        
        #Read flask environment variables
        Config.APP_ROOT_PATH = os.environ.get('APP_ROOT_PATH', 'http://localhost')
        
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
    
    #============Seta Configuration ========#
    
    #disable scheduler
    SCHEDULER_ENABLED = False
    
    #======================================#
    
    #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
    
    #How long an access token should be valid before it expires.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    
    #How long a refresh token should be valid before it expires. 
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=2)
    
    #Controls if the secure flag should be placed on cookies
    JWT_COOKIE_SECURE = False
    
    #======================================#
    
    #============Flask-GitHub Configuration========#
    #https://github-flask.readthedocs.io/en/latest/
    
    #GitHub client id
    #Register Seta application at https://github.com/settings/applications 
    GITHUB_CLIENT_ID = "ea09540bb092bd7af2f4"
    
    #Seta GitHub application secret
    GITHUB_CLIENT_SECRET = "b9e76828307f1bb849f7b47a97c1b7c9ca3361df"
    
    #======================================#
    
    #======================================#
    
class ProdConfig(Config):
    """Production config"""
    #============Seta Configuration ========#
    
    #enable scheduler tasks
    SCHEDULER_ENABLED = True
    
    #======================================#
    
    
    #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
    
    #How long an access token should be valid before it expires.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    
    #How long a refresh token should be valid before it expires.
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=2)
    
    #Controls if the secure flag should be placed on cookies
    JWT_COOKIE_SECURE = True
    
    #======================================#
    
    #============Flask-GitHub Configuration========#
    #https://github-flask.readthedocs.io/en/latest/
    
    #GitHub client id
    #Register Seta application at https://github.com/settings/applications 
    GITHUB_CLIENT_ID = "ea09540bb092bd7af2f4"
    
    #Seta GitHub application secret
    GITHUB_CLIENT_SECRET = "b9e76828307f1bb849f7b47a97c1b7c9ca3361df"
    
    #======================================#