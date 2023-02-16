from .config import DevConfig
from .factory import create_app

configuration = DevConfig() 
app = create_app(configuration)

app.logger.debug(app.url_map)

env = app.config["FLASK_ENV"]
app.logger.debug(f"seta-ui {env} run")