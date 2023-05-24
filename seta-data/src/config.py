"""seta-ui flask configuration."""
import os
    
class Config:
    
    ES_HOST = None
    ES_INIT_DATA_CONFIG_FILE = "data-mapping.json"
    CRC_ES_INIT_DATA_CONFIG_FILE = "data-mapping.crc"
    ES_SUGGESTION_INIT_DATA_CONFIG_FILE = "suggestion-data-mapping.json"
    CRC_ES_SUGGESTION_INIT_DATA_CONFIG_FILE = "suggestion-data-mapping.crc"
    DELETE_INDEX_ON_CRC_CHECK = False

    INDEX = ["seta-public-000001", "seta-private-000001"]
    INDEX_SUGGESTION = "seta-suggestion-000001"
    INDEX_PUBLIC = "seta-public-000001"
    INDEX_PRIVATE = "seta-private-000001"

    MODELS_DOCKER_PATH = "/home/seta/models_docker/"    
    MODELS_PATH = "/home/seta/models/"
    WORD2VEC_JSON_EXPORT = "json_suggestion.json"
    WORD2VEC_JSON_EXPORT_CRC = "json_suggestion.crc"  
    
    def __init__(self) -> None:             
        """Read environment variables"""   
        
        Config.ES_HOST = os.environ.get("ES_HOST")
    
class TestConfig(Config):
    
    def __init__(self) -> None:
        super().__init__()
        
        if Config.ES_HOST is None:
            Config.ES_HOST = "seta-es-test:9200"
    
    WORD2VEC_JSON_EXPORT = "json_suggestion_samples.json"
    WORD2VEC_JSON_EXPORT_CRC = "json_suggestion_samples.crc"