from seta_flask_server.config import DevConfig
from seta_flask_server.factory import create_app

configuration = DevConfig() 
app = create_app(configuration)

app.logger.debug(app.url_map)

env = app.config["FLASK_ENV"]
app.logger.debug(f"seta-ui {env} run")