from seta_flask_server.config import ProdConfig
from seta_flask_server.factory_auth import create_app

configuration = ProdConfig()  
app = create_app(configuration)

app.logger.debug("seta-auth production run")