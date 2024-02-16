import os


class Config:

    def __init__(self) -> None:

        Config.DB_NAME = os.environ.get("DB_NAME")
        Config.MONGODB_HOST = os.environ.get("MONGODB_HOST")

        Config.MONGODB_PORT = 27017
        port = os.environ.get("MONGODB_PORT")
        if port:
            Config.MONGODB_PORT = int(port)

        Config.POSTGRES_HOST = os.environ.get("POSTGRES_HOST")

        Config.POSTGRES_PORT = 5432
        port = os.environ.get("POSTGRES_PORT")
        if port:
            Config.POSTGRES_PORT = int(port)

        Config.POSTGRES_USER = os.environ.get("POSTGRES_USER")
        Config.POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
