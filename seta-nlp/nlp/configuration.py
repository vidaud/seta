import os
from nlp.internal import config

STAGE = "Development"
CONFIG_APP_FILE = "/etc/seta/nlp.conf"

configuration: config.Config = None


def init():
    """Initialize configuration"""

    global configuration, STAGE  # pylint: disable=global-statement

    STAGE = os.environ.get("STAGE", default="Development")
    configuration = config.Config(section_name=STAGE, config_file=CONFIG_APP_FILE)
