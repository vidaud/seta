import config
from factory import create_app

configuration = config.DevConfig() 
app = create_app(configuration)

env = app.config["FLASK_ENV"]
app.logger.debug(f"seta-ui {env} run")