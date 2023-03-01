from datetime import timedelta

class TestConfig:
    
    #============Seta Configuration ========#
    #EU LOGIN authentication url
    #AUTH_CAS_URL = "https://ecas.ec.europa.eu/cas/"
    AUTH_CAS_URL = "https://webgate.ec.europa.eu/cas/"
    
    #database host
    DB_HOST="localhost"
    
    #database port
    DB_PORT=27017
    
    #databse name
    DB_NAME="seta_test"
        
    #administrators email list - new user is set as admin if email present in this list
    ROOT_USERS = []
    
    #seta-ui root path - used in third-party authentication callbacks    
    APP_ROOT_PATH = "http://localhost"
    
    #disable scheduler
    SCHEDULER_ENABLED = False
    
    @property
    def MONGO_URI(self):
        return f"mongodb://{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    #======================================# 
    
    #============Flask Configuration========#
    #https://flask.palletsprojects.com/en/2.2.x/config/
    
    #Whether debug mode is enabled
    DEBUG = False
    
    #Enable testing mode
    TESTING = True
    
    #Exceptions are re-raised rather than being handled by the app's error handlers.     
    PROPAGATE_EXCEPTIONS = True
    
    #A secret key that will be used for securely signing the session cookie    
    SECRET_KEY="f9bf78b9a18ce6d46a0cd2b0b86df9da"
        
    #ALLOWED_HOSTS = ['*']
    
    #======================================#
    
    
    #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
    
    #The secret key used to encode and decode JWTs    
    JWT_SECRET_KEY = "f9bf78b9a18ce6d46a0cd2b0b86df9da"    
    
    #The claim in a JWT that is used as the source of identity
    JWT_IDENTITY_CLAIM="seta_id"
    
    #Enable Cross Site Request Forgery (CSRF) protection
    JWT_COOKIE_CSRF_PROTECT = False
    
    #Where to look for a JWT when processing a request in the specified order.
    JWT_TOKEN_LOCATION=["headers", "cookies"]
    
    #How long an access token should be valid before it expires.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    
    #How long a refresh token should be valid before it expires.
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24)
    
    #Controls if the secure flag should be placed on cookies
    JWT_COOKIE_SECURE = False
    
    #======================================#
        
    #============Seta Configuration ========#
    
    #disable scheduler
    SCHEDULER_ENABLED = False
    
    #======================================#
    
    
    
    #===========LogSetup Configuration========#
    #https://medium.com/tenable-techblog/the-boring-stuff-flask-logging-21c3a5dd0392
    #https://github.com/tenable/flask-logging-demo
    
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
    
        
    #============Flask-GitHub Configuration========#
    #https://github-flask.readthedocs.io/en/latest/
    
    #GitHub client id
    #Register Seta application at https://github.com/settings/applications 
    GITHUB_CLIENT_ID = "ea09540bb092bd7af2f4"
    
    #Seta GitHub application secret
    GITHUB_CLIENT_SECRET = "b9e76828307f1bb849f7b47a97c1b7c9ca3361df"
    
    #======================================#