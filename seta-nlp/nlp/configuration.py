import os
from nlp.internal import config

stage = os.environ.get("STAGE", default="Development")
configuration = config.Config(stage)
