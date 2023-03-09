from seta_api.config import ProdConfig
from seta_api.factory import create_app

configuration = ProdConfig()  
app = create_app(configuration)

app.logger.debug("seta-ui production run")