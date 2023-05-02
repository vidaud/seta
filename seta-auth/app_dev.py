from seta_auth.config import DevConfig
from seta_auth.factory import create_app

configuration = DevConfig() 
app = create_app(configuration)

app.logger.debug(app.url_map)

app.logger.debug(f"seta-auth development run")