"""flask server configuration."""
import os
import configparser

class Config:
    """Application configuration"""

    CONFIG_APP_FILE = "/etc/seta/ui.conf"
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
        
        Config.AUTH_CAS_URL = config_section.get("AUTH_CAS_URL")
        Config.HOME_ROUTE = config_section.get("HOME_ROUTE", fallback="/")
        Config.PRIVATE_API_URL = config_section["PRIVATE_API_URL"]

        Config.SCHEDULER_ENABLED = config_section.getboolean("SCHEDULER_ENABLED", fallback=False)        
        Config.DISABLE_SWAGGER_DOCUMENTATION = config_section.getboolean("DISABLE_SWAGGER_DOCUMENTATION", fallback=True)
        Config.AUTO_APPROVE_CHANGE_REQUEST = config_section.getboolean("AUTO_APPROVE_CHANGE_REQUEST", fallback=False)    

        identity_providers = config_section.get("SETA_IDENTITY_PROVIDERS", fallback="ECAS")
        Config.SETA_IDENTITY_PROVIDERS = identity_providers.split(sep=",")  

        Config.UNBLOCK_TOKENS_HOURS = config_section.getint("UNBLOCK_TOKENS_HOURS", fallback=48)

        Config.JWT_IDENTITY_CLAIM = config_section.get("JWT_IDENTITY_CLAIM", fallback="seta_id")
        Config.JWT_COOKIE_CSRF_PROTECT = config_section.getboolean("JWT_COOKIE_CSRF_PROTECT", fallback=True)
        Config.JWT_COOKIE_SECURE = config_section.getboolean("JWT_COOKIE_SECURE", fallback=False)

        token_location = config_section.get("JWT_TOKEN_LOCATION", fallback="headers,cookies")
        Config.JWT_TOKEN_LOCATION = token_location.split(sep=",")

        Config.JWT_ACCESS_TOKEN_EXPIRES = config_section.getint("JWT_ACCESS_TOKEN_EXPIRES", fallback=900)
        Config.JWT_REFRESH_TOKEN_EXPIRES = config_section.getint("JWT_REFRESH_TOKEN_EXPIRES", fallback=86400)

        Config.SCHEDULER_API_ENABLED = config_section.getboolean("SCHEDULER_API_ENABLED", fallback=False)
        Config.RESTX_MASK_SWAGGER = config_section.getboolean("RESTX_MASK_SWAGGER", fallback=False)

        Config.PROPAGATE_EXCEPTIONS = config_section.getboolean("PROPAGATE_EXCEPTIONS", fallback=True)
        Config.TESTING = config_section.getboolean("TESTING", fallback=False)
        #=======================================#

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

        Config.SECRET_KEY = os.environ.get("API_SECRET_KEY")
        Config.JWT_SECRET_KEY = Config.SECRET_KEY

        #Read admin users and change values to lower
        root_users = os.environ.get('ROOT_USERS')
        if root_users is not None:
            admins = root_users.split(sep=";")
            Config.ROOT_USERS = list(map(str.lower,admins))

        #read database env variables
        Config.DB_HOST = os.environ.get("DB_HOST")
        Config.DB_NAME = os.environ.get("DB_NAME")
        Config.DB_PORT = 27017

        port = os.environ.get("DB_PORT")
        if port:
            Config.DB_PORT = int(port)

        #============Flask-GitHub Configuration========#
        #https://github-flask.readthedocs.io/en/latest/

        Config.GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
        Config.GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")
        #=======================================#