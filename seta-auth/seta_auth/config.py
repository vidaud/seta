"""seta-auth configuration."""

from datetime import timedelta
import os


class Config:
    """Base class for common configuration"""

    #============Seta Configuration ========#
    #database host - docker container for mongo
    DB_HOST="seta-mongo"

    #database port
    DB_PORT=27017

    #databse name
    DB_NAME="seta"

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
    JWT_COOKIE_CSRF_PROTECT = False

    #Where to look for a JWT when processing a request in the specified order.
    JWT_TOKEN_LOCATION=["headers", "cookies"]
    
    #How long an access token should be valid before it expires.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)

    #How long a refresh token should be valid before it expires.
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=60)
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

        Config.SECRET_KEY = os.environ.get("API_SECRET_KEY")
        Config.JWT_SECRET_KEY = Config.SECRET_KEY

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


class DevConfig(Config):
    """Development config"""

    def __init__(self) -> None:
        super().__init__()


class ProdConfig(Config):
    """Production config"""

    def __init__(self) -> None:
        super().__init__()

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

    #============Flask Configuration========#
    #https://flask.palletsprojects.com/en/2.2.x/config/

    #Enable testing mode
    TESTING = True

    #Exceptions are re-raised rather than being handled by the app's error handlers.
    PROPAGATE_EXCEPTIONS = True

    #ALLOWED_HOSTS = ['*']

    #======================================#