"""seta-data configuration."""

import os
import configparser
    
class Config:

    CONFIG_APP_FILE = "/etc/seta/data.conf"
    
    def __init__(self, section_name: str) -> None:
        config = configparser.ConfigParser()
        config.read(Config.CONFIG_APP_FILE)

        sections = config.sections()
        if len(sections) == 0:
            message = f"No configuration section found in the config file ('{Config.CONFIG_APP_FILE}')"
            raise Exception(message)

        if section_name not in sections:
            raise Exception("section_name parameter must be one of " + str(sections))
        
        config_section = config[section_name]
        
        Config._init_env_variables()
        Config._init_config_section(config_section)
        

    @staticmethod
    def _init_config_section(config_section: configparser.SectionProxy):
        #========= Read config section =========#
        #check the seta_config/data.conf file for documentation
        Config.ES_INIT_DATA_CONFIG_FILE = config_section["ES_INIT_DATA_CONFIG_FILE"]
        Config.CRC_ES_INIT_DATA_CONFIG_FILE = config_section["CRC_ES_INIT_DATA_CONFIG_FILE"]
        Config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE = config_section["ES_SUGGESTION_INIT_DATA_CONFIG_FILE"]
        Config.CRC_ES_SUGGESTION_INIT_DATA_CONFIG_FILE = config_section["CRC_ES_SUGGESTION_INIT_DATA_CONFIG_FILE"]
        Config.DELETE_INDEX_ON_CRC_CHECK = config_section.getboolean("DELETE_INDEX_ON_CRC_CHECK", False)

        index = config_section.get("INDEX", fallback="")
        Config.INDEX = index.split(sep=",")

        Config.INDEX_SUGGESTION = config_section["INDEX_SUGGESTION"]
        Config.INDEX_PUBLIC = config_section["INDEX_PUBLIC"]

        Config.MODELS_DOCKER_PATH = config_section["MODELS_DOCKER_PATH"]
        Config.MODELS_PATH = config_section["MODELS_PATH"]
        Config.WORD2VEC_JSON_EXPORT = config_section["WORD2VEC_JSON_EXPORT"]
        Config.WORD2VEC_JSON_EXPORT_CRC = config_section["WORD2VEC_JSON_EXPORT_CRC"]

    @staticmethod
    def _init_env_variables():
        #===== Read environment variables ======#
        Config.ES_HOST = os.environ.get("ES_HOST")