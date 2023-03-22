"""seta-ui flask configuration."""
#import os
    
class Config:
    
    ES_HOST = "seta-es:9200"
    ES_INIT_DATA_CONFIG_FILE = "data-mapping.json"
    ES_SUGGESTION_INIT_DATA_CONFIG_FILE = "suggestion-data-mapping.json"

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
    WORD2VEC_JSON_EXPORT_CRC = "json_suggestion.crc"    
    
class TestConfig(Config):
    ES_HOST = "seta-es-test:9200"
    
    WORD2VEC_JSON_EXPORT = "json_suggestion_samples.json"
    WORD2VEC_JSON_EXPORT_CRC = "json_suggestion_samples.crc"