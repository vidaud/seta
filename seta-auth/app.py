from seta_auth.config import ProdConfig
from seta_auth.factory import create_app

configuration = ProdConfig()  
app = create_app(configuration)

app.logger.debug("seta-auth production run")