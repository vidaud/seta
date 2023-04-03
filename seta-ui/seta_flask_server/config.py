"""seta-ui flask configuration."""

from datetime import timedelta
import os

    
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
    
    #disable scheduler
    SCHEDULER_ENABLED = False
    
    #web application home url
    HOME_ROUTE = "/"
    
    #seta-api url for internal docker LAN calls
    PRIVATE_API_URL = "http://seta-api:8081/seta-api-private/v1/"
    
    #======================================#
    
    
    #===========Flask-PyMongo Configuration========#
    #https://flask-pymongo.readthedocs.io/en/latest/
    
    @property
    def MONGO_URI(self):
        return f"mongodb://{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
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
                
        Config.SECRET_KEY = os.environ["API_SECRET_KEY"]            
        Config.JWT_SECRET_KEY = Config.SECRET_KEY
        
        #set web home route
        Config.HOME_ROUTE = os.environ.get("HOME_ROUTE", "/seta-ui")
        
        #Read admin users and change values to lower
        root_users = os.environ.get('ROOT_USERS')
        if root_users is not None:
            admins = root_users.split(sep=";")
            Config.ROOT_USERS = list(map(str.lower,admins))
                
        #Read logging environment variables
        Config.LOG_TYPE = os.environ.get("LOG_TYPE", "stream")
        Config.LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
        Config.LOG_DIR = os.environ.get("LOG_DIR", "/var/log")
        Config.APP_LOG_NAME = os.environ.get("APP_LOG_NAME", "app.log")
        Config.WWW_LOG_NAME = os.environ.get("WWW_LOG_NAME", "www.log")
        Config.SCHEDULER_LOG_NAME = os.environ.get("SCHEDULER_LOG_NAME", "sched.log")
        Config.LOG_MAX_BYTES = os.environ.get("LOG_MAX_BYTES", 100_000_000)  # 100MB in bytes
        Config.LOG_COPIES = os.environ.get("LOG_COPIES", 5)
        
        #read database env variables
        Config.DB_HOST = os.environ.get("DB_HOST")        
        Config.DB_NAME = os.environ.get("DB_NAME")        
        port = os.environ.get("DB_PORT")
        if port:
            Config.DB_PORT = int(port)
            
        #============Flask-GitHub Configuration========#
        #https://github-flask.readthedocs.io/en/latest/
        
        Config.GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
        Config.GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")
        
        #======================================#
        
            
class DevConfig(Config):  
    """Development config"""
    
    def __init__(self) -> None:
        super().__init__()    
    
    #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
    
    #How long an access token should be valid before it expires.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    
    #How long a refresh token should be valid before it expires. 
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=2)
    
    #Controls if the secure flag should be placed on cookies
    JWT_COOKIE_SECURE = False
    
    #======================================#
    
    
class ProdConfig(Config):
    """Production config"""
    
    def __init__(self) -> None:
        super().__init__()
    
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
    
class TestConfig(Config):
    """Test config"""
    
    def __init__(self) -> None:
        super().__init__()
        
        if Config.DB_HOST is None:
            Config.DB_HOST = "seta-mongo-test"
            
        if Config.DB_PORT is None:
            Config.DB_PORT = 27017
            
        if Config.DB_NAME is None:
            Config.DB_NAME = "seta-test"
            
    #============Seta Configuration ========#
                
    PRIVATE_API_URL = "http://seta-api-test:8081/seta-api-private/v1/"
    
    #======================================#
            
    #============Flask Configuration========#
    #https://flask.palletsprojects.com/en/2.2.x/config/
        
    #Enable testing mode
    TESTING = True
    
    #Exceptions are re-raised rather than being handled by the app's error handlers.     
    PROPAGATE_EXCEPTIONS = True
        
    #ALLOWED_HOSTS = ['*']
    
    #======================================#
    
     #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
           
    #How long an access token should be valid before it expires.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    
    #How long a refresh token should be valid before it expires.
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24)
    
    #Controls if the secure flag should be placed on cookies
    JWT_COOKIE_SECURE = False
    
    #======================================#