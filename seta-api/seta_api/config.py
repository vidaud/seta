"""seta-ui flask configuration."""
import os
    
class Config:
    """Base class for common configuration"""
    
    #============Seta Configuration ========#
     
    #database host - docker container for mongo
    DB_HOST="seta-mongo"
    
    #database port
    DB_PORT=27017
    
    #database name
    DB_NAME="seta"
    
    #corpus
    DEFAULT_SUGGESTION = 6
    DEFAULT_TERM_NUMBER = 20
    DEFAULT_DOCS_NUMBER = 10
    DEFAULT_FROM_DOC_NUMBER = 0
    SEARCH_TYPES = ["DOCUMENT_SEARCH", "CHUNK_SEARCH", "ALL_CHUNKS_SEARCH"]
    
    ES_HOST = "seta-es:9200"
    ES_INIT_DATA_DUMP_FILE = "seta-public-000001-8.2-data.zip"
    ES_UPDATE_DATA_DUMP_FILE = "dump10000_up.zip"
    ES_INIT_DATA_CONFIG_FILE = "seta-public-000001-8.2-mapping.json"
    
    INDEX = ["seta-public-000001", "seta-private-000001"]
    INDEX_SUGGESTION = "seta-suggestion-000001"
    INDEX_PUBLIC = "seta-public-000001"
    INDEX_PRIVATE = "seta-private-000001"

    EXAMPLE_GUEST = "example_get-token_guest.py"
    EXAMPLE_USER = "example_get-token_user.py"
    JRCBOX_ID = "DbdH9B1dc5hD0TM"
    JRCBOX_PATH = "https://jrcbox.jrc.ec.europa.eu/index.php/s/"
    JRCBOX_PASS = "Op-next-seta-2022-14-14"
    JRCBOX_WEBDAV = "https://jrcbox.jrc.ec.europa.eu/public.php/webdav/"

    TIKA_PATH = "tika/tika-app-2.4.1.jar"
    #======================================#
    
    #===========Flask-PyMongo Configuration========#
    #https://flask-pymongo.readthedocs.io/en/latest/
    
    #MONGO_URI = f"mongodb://{DB_HOST}:{DB_PORT}/{DB_NAME}"
    @property
    def MONGO_URI(self):
        return f"mongodb://{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    #======================================#  
    
    #============Flask Configuration========#
    #https://flask.palletsprojects.com/en/2.1.x/config/
    
    #Exceptions are re-raised rather than being handled by the app's error handlers.     
    PROPAGATE_EXCEPTIONS = True
    
    #A secret key that will be used for securely signing the session cookie
    SECRET_KEY = "no-need-for-secret"
    
    MAX_CONTENT_LENGTH = 50 * 1000 * 1000  # 50M 
    
    #======================================#
    
    #===========Flask-RESTX Configuration========#
    #https://flask-restx.readthedocs.io/en/latest/configuration.html
    
    #disable the mask documentation in swagger
    RESTX_MASK_SWAGGER=False    
    
    #no info about this one!
    SWAGGER_UI_JSONEDITOR = True
    #======================================# 
    
        
    #============Flask-JWT-Extended Configuration========#
    #https://flask-jwt-extended.readthedocs.io/en/stable/options/
    
    #The secret key used to encode and decode JWTs    
    JWT_SECRET_KEY = "no-need-for-secret"
    
    #The claim in a JWT that is used as the source of identity
    JWT_IDENTITY_CLAIM="seta_id"
    
    #Enable Cross Site Request Forgery (CSRF) protection
    JWT_COOKIE_CSRF_PROTECT = False
    
    #Where to look for a JWT when processing a request in the specified order.
    JWT_TOKEN_LOCATION=["headers", "cookies"]
    
    #api endpoint to decode the JWT token
    JWT_TOKEN_INFO_URL="http://seta-auth:8082/authorization/v1/token_info"
    #======================================#
    
    #============Flask-APScheduler Configuration========#
    #https://viniciuschiele.github.io/flask-apscheduler/rst/configuration.html
    
    #enable Flask-APScheduler build-in API
    SCHEDULER_API_ENABLED = True
    SCHEDULER_API_PREFIX = "/seta-api/scheduler"
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
    
    
   
        
    def __init__(self) -> None:             
        """Read environment variables"""         
                
        #Read logging environment variables
        Config.LOG_TYPE = os.environ.get("LOG_TYPE", "stream")
        Config.LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
        Config.LOG_DIR = os.environ.get("LOG_DIR", "/var/log")
        Config.APP_LOG_NAME = os.environ.get("APP_LOG_NAME", "app.log")
        Config.WWW_LOG_NAME = os.environ.get("WWW_LOG_NAME", "www.log")
        Config.LOG_MAX_BYTES = os.environ.get("LOG_MAX_BYTES", 100_000_000)  # 100MB in bytes
        Config.LOG_COPIES = os.environ.get("LOG_COPIES", 5)   
             
        #read services env variables
        Config.ES_HOST = os.environ.get("ES_HOST")
        
        Config.DB_HOST = os.environ.get("DB_HOST")        
        Config.DB_NAME = os.environ.get("DB_NAME")
        
        port = os.environ.get("DB_PORT")
        if port:
            Config.DB_PORT = int(port)
            
class DevConfig(Config):  
    """Development config"""
    
    def __init__(self) -> None:
        super().__init__()        
    
    #============Seta Configuration ========#
    
    #disable scheduler
    SCHEDULER_ENABLED = False
    
    #======================================#    
    
class ProdConfig(Config):
    """Production config"""
    
    def __init__(self) -> None:
        super().__init__()    
    
    #============Seta Configuration ========#
    
    #disable scheduler tasks
    SCHEDULER_ENABLED = False
    
    #======================================#
    
class TestConfig(Config):
    """Testing configuration"""
    
    def __init__(self) -> None:
        super().__init__()
        
        if Config.ES_HOST is None:
            Config.ES_HOST = "seta-es-test:9200"
            
        if Config.DB_HOST is None:
            Config.DB_HOST = "seta-mongo-test"
            
        if Config.DB_PORT is None:
            Config.DB_PORT = 27017
            
        if Config.DB_NAME is None:
            Config.DB_NAME = "seta-test"
    
    #============Seta Configuration ========#
    
    #disable scheduler tasks
    SCHEDULER_ENABLED = False   
    
    
    #======================================#
    
    #============Flask Configuration========#
        
    #Enable testing mode
    TESTING = True
    
    #======================================#    
    
    #============Flask-APScheduler Configuration========#
    #disable Flask-APScheduler build-in API
    SCHEDULER_API_ENABLED = False
    #======================================#  
