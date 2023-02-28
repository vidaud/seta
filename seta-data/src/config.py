"""seta-ui flask configuration."""

from datetime import timedelta
from os.path import exists
import os
import secrets
    
class Config:
    """Common configuration"""
    DB_HOST="seta-mongo"
    DB_PORT=27017
    MONGO_URI = ""
    
    ES_HOST = "seta-es:9200"
    ES_INIT_DATA_CONFIG_FILE = "data-mapping.json"
    
    INDEX = ["seta-public-000001", "seta-private-000001"]
    INDEX_SUGGESTION = "seta-suggestion-000001"
    INDEX_PUBLIC = "seta-public-000001"
    INDEX_PRIVATE = "seta-private-000001"
    
    MODELS_DOCKER_PATH = "/home/seta/models_docker/"    
    MODELS_PATH = "/home/seta/models/"    
    MODELS_WORD2VEC_FILE = "wv-sg0-hs1.bin"
    MODELS_WORD2VEC_FILE_CRC = "wv-sg0-hs1.crc"
    MODELS_INIT_FILE = "models.zip"
    WORD2VEC_JSON_EXPORT = "json_suggestion.json"

    
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
    
    
class TestConfig(Config):
    """Test config"""
    
    FLASK_ENV = "test"
    DEBUG = False 
    SCHEDULER_ENABLED = True       
    
class ProdConfig(Config):
    """Production config"""
    
    FLASK_ENV = "production"
    DEBUG = False  
    SCHEDULER_ENABLED = True
