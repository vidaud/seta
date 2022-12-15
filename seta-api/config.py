"""seta-ui flask configuration."""

from datetime import timedelta
import os
    
class Config:
    """Common configuration"""
    DB_HOST="seta-mongo"
    DB_PORT=27017
    MONGO_URI = ""
    
    
    #JWT variables
    SECRET_KEY_PATH = "/home/seta/models/key.txt"
    JWT_SECRET_KEY = "no-need-for-secret"    
    JWT_IDENTITY_CLAIM="sub"
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_TOKEN_LOCATION=["headers", "cookies"]
    JWT_TOKEN_INFO_URL="http://seta-ui:8080/authorization/v1/token_info"
    
    #Scheduler variables
    SCHEDULER_API_ENABLED = True
    SCHEDULER_API_PREFIX = "/seta-api/scheduler"
        
    #LogSetup variables
    LOG_TYPE = "stream"
    LOG_LEVEL = "INFO"
    LOG_DIR = "/"
    APP_LOG_NAME = ""
    WWW_LOG_NAME = ""
    SCHEDULER_LOG_NAME = ""
    LOG_MAX_BYTES = "100_000"
    LOG_COPIES = "5"
    
    
    PROPAGATE_EXCEPTIONS = True
    SWAGGER_UI_JSONEDITOR = True
    MAX_CONTENT_LENGTH = 50 * 1000 * 1000  # 50M
    
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
    #index-wiki: seta-wiki-000002
    
    MODELS_PATH = "/home/seta/models/"    
    MODELS_WORD2VEC_FILE = "wv-sg0-hs1.bin"
    MODELS_WORD2VEC_FILE_CRC = "wv-sg0-hs1.crc"
    MODELS_INIT_FILE = "models.zip"
    
    EXAMPLE_GUEST = "example_get-token_guest.py"
    EXAMPLE_USER = "example_get-token_user.py"
    JRCBOX_ID = "DbdH9B1dc5hD0TM"
    JRCBOX_PATH = "https://jrcbox.jrc.ec.europa.eu/index.php/s/"
    JRCBOX_PASS = "Op-next-seta-2022-14-14"
    JRCBOX_WEBDAV = "https://jrcbox.jrc.ec.europa.eu/public.php/webdav/"
        
    def __init__(self) -> None:             
        """Read environment variables"""               
        
        #read key from the key.txt file
        '''
        if exists(Config.SECRET_KEY_PATH):
            with open(Config.SECRET_KEY_PATH, "r") as fobj:
                self.SECRET_KEY = fobj.readline()
        else:
            self.SECRET_KEY = secrets.token_hex(16)
            
            with open(Config.SECRET_KEY_PATH, "w") as f1:
                f1.write(self.SECRET_KEY)
                
        Config.JWT_SECRET_KEY = self.SECRET_KEY
        '''                

        Config.MONGO_URI = f"mongodb://{Config.DB_HOST}:{Config.DB_PORT}/seta"            
        
        
        #Read flask environment variables
        Config.FLASK_PATH = os.environ.get('FLASK_PATH', 'http://localhost')
        
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
    
    LOG_LEVEL = "DEBUG"
    
    #JWT variables
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=2)
    
    
class TestConfig(Config):
    """Test config"""
    
    FLASK_ENV = "test"
    DEBUG = False 
    SCHEDULER_ENABLED = True       
    
    #JWT variables
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24)
    
class ProdConfig(Config):
    """Production config"""
    
    FLASK_ENV = "production"
    DEBUG = False  
    SCHEDULER_ENABLED = True
    
    #JWT variables
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=2)