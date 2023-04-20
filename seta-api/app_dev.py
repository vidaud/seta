
from seta_api.config import DevConfig
from seta_api.factory import create_app

configuration = DevConfig() 
app = create_app(configuration)

app.logger.info(app.url_map)

app.logger.debug(f"seta-api dev run")