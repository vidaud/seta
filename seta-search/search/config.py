"""seta-api web server configuration."""
import configparser
import os
    
class Config:
    """Seta-api configuration"""

    CONFIG_APP_FILE = "/etc/seta/search.conf"
    CONFIG_LOGS_FILE = "/etc/seta/logs.conf"
     
    @property
    def MONGO_URI(self):
        return f"mongodb://{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}"
    
    def __init__(self, section_name: str) -> None:

        config = configparser.ConfigParser()
        config.read([Config.CONFIG_LOGS_FILE, Config.CONFIG_APP_FILE])

        sections = config.sections()
        if len(sections) == 0:
            message = f"No configuration section found in the config files ('{Config.CONFIG_LOGS_FILE}','{Config.CONFIG_APP_FILE}')"
            raise Exception(message)

        if section_name not in sections:
            raise Exception("section_name parameter must be one of " + str(sections))
        
        config_section = config[section_name]    

        Config._init_config_section(config_section)
        Config._init_env_variables()   


    @staticmethod
    def _init_config_section(config_section: configparser.SectionProxy):
        #========= Read config section =========#
        #check the seta_config/*.conf files for documentation

        #flask
        Config.SECRET_KEY = config_section.get("SECRET_KEY", fallback="no-need-for-secret")
        Config.PROPAGATE_EXCEPTIONS = config_section.getboolean("PROPAGATE_EXCEPTIONS", fallback=True)        
        Config.TESTING = config_section.getboolean("TESTING", fallback=False)
        Config.MAX_CONTENT_LENGTH = config_section.getint("MAX_CONTENT_LENGTH", fallback=52_428_800)

        #JWT Extended
        Config.JWT_SECRET_KEY = Config.SECRET_KEY
        Config.JWT_IDENTITY_CLAIM = config_section.get("JWT_IDENTITY_CLAIM", fallback="seta_id")
        Config.JWT_COOKIE_CSRF_PROTECT = config_section.getboolean("JWT_COOKIE_CSRF_PROTECT", fallback=True)
        Config.JWT_COOKIE_SECURE = config_section.getboolean("JWT_COOKIE_SECURE", fallback=False)

        token_location = config_section.get("JWT_TOKEN_LOCATION", fallback="headers,cookies")
        Config.JWT_TOKEN_LOCATION = token_location.split(sep=",")

        Config.JWT_TOKEN_INFO_URL = config_section.get("JWT_TOKEN_INFO_URL")

        #restx
        Config.RESTX_MASK_SWAGGER = config_section.getboolean("RESTX_MASK_SWAGGER", fallback=False)
        Config.SWAGGER_UI_JSONEDITOR = config_section.getboolean("SWAGGER_UI_JSONEDITOR", fallback=False)

        #custom
        Config.DEFAULT_SUGGESTION = config_section.getint("DEFAULT_SUGGESTION", fallback=6)
        Config.DEFAULT_TERM_NUMBER = config_section.getint("DEFAULT_TERM_NUMBER", fallback=20)
        Config.DEFAULT_DOCS_NUMBER = config_section.getint("DEFAULT_DOCS_NUMBER", fallback=10)
        Config.DEFAULT_FROM_DOC_NUMBER = config_section.getint("DEFAULT_FROM_DOC_NUMBER", fallback=0)
        Config.PAGINATION_DOC_LIMIT = config_section.getint("PAGINATION_DOC_LIMIT", fallback=0)
        Config.KNN_SEARCH_K = config_section.getint("KNN_SEARCH_K", fallback=5000)
        Config.KNN_SEARCH_NUM_CANDIDATES = config_section.getint("KNN_SEARCH_NUM_CANDIDATES", fallback=5000)
        Config.SIMILARITY_THRESHOLD = config_section.getfloat("SIMILARITY_THRESHOLD", fallback=0)
        Config.AGG_MISSING_NAME = config_section.get("AGG_MISSING_NAME", fallback="NO_CLASS")

        search_types = config_section.get("SEARCH_TYPES", fallback="DOCUMENT_SEARCH,CHUNK_SEARCH,ALL_CHUNKS_SEARCH")
        Config.SEARCH_TYPES = search_types.split(sep=",")

        Config.DEFAULT_ENRICHMENT_TYPE = config_section.get("DEFAULT_ENRICHMENT_TYPE", fallback="similar")
        Config.EXPORT_DOCUMENT_LIMIT = config_section.getint("EXPORT_DOCUMENT_LIMIT", fallback=5000)

        Config.ES_INIT_DATA_DUMP_FILE = config_section.get("ES_INIT_DATA_DUMP_FILE")
        Config.ES_UPDATE_DATA_DUMP_FILE = config_section.get("ES_UPDATE_DATA_DUMP_FILE")
        Config.ES_INIT_DATA_CONFIG_FILE = config_section.get("ES_INIT_DATA_CONFIG_FILE")

        index = config_section.get("INDEX", fallback="")
        Config.INDEX = index.split(sep=",")

        Config.INDEX_SUGGESTION = config_section.get("INDEX_SUGGESTION")
        Config.INDEX_PUBLIC = config_section.get("INDEX_PUBLIC")
        Config.INDEX_PRIVATE = config_section.get("INDEX_PRIVATE")

        Config.EXAMPLE_GUEST = config_section.get("EXAMPLE_GUEST")
        Config.EXAMPLE_USER = config_section.get("EXAMPLE_USER")

        Config.TIKA_PATH = config_section.get("TIKA_PATH")

        Config.CATALOGUE_API_ROOT_URL = config_section.get("CATALOGUE_API_ROOT_URL")

        #Read logging environment variables
        Config.LOG_TYPE = config_section.get("LOG_TYPE", "stream")
        Config.LOG_LEVEL = config_section.get("LOG_LEVEL", "INFO")
        Config.LOG_DIR = config_section.get("LOG_DIR", "/var/log")
        Config.APP_LOG_NAME = config_section.get("APP_LOG_NAME", "app.log")
        Config.WWW_LOG_NAME = config_section.get("WWW_LOG_NAME", "www.log")
        Config.SCHEDULER_LOG_NAME = config_section.get("SCHEDULER_LOG_NAME", "sched.log")
        Config.LOG_MAX_BYTES = config_section.getint("LOG_MAX_BYTES", 100_000_000)  # 100MB in bytes
        Config.LOG_COPIES = config_section.getint("LOG_COPIES", 5)

    @staticmethod
    def _init_env_variables():
        #===== Read environment variables ======#

        Config.ES_HOST = os.environ.get("ES_HOST")        
        Config.DB_HOST = os.environ.get("DB_HOST")
        Config.DB_NAME = os.environ.get("DB_NAME")
        Config.DB_PORT = 27017

        port = os.environ.get("DB_PORT")
        if port:
            Config.DB_PORT = int(port)