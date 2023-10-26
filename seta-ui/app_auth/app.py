"""Starting point for seta-auth web server."""

import os
from seta_flask_server.config import Config
from seta_flask_server.factory_auth import create_app


stage = os.environ.get("STAGE", default="Production")

configuration = Config(stage)
app = create_app(configuration)

if stage != "Production":
    app.logger.debug(app.url_map)

app.logger.info("seta-auth running in %s", stage)
