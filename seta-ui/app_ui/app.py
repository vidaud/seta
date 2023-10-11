import os
from seta_flask_server.config import Config
from seta_flask_server.factory import create_app


stage = os.environ.get("STAGE", default="Production")
    
configuration = Config(stage) 
app = create_app(configuration)

if stage == "Development":
    app.logger.debug(app.url_map)

app.logger.info("seta-ui running in " + stage)