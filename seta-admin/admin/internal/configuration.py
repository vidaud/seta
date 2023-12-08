import os
from admin.config import Config

stage = os.environ.get("STAGE", default="Development")
configuration = Config(stage)
