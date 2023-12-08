import os
import configparser


class Config:
    """Application configuration"""

    CONFIG_APP_FILE = "/etc/seta/data.conf"

    def __init__(self, section_name: str) -> None:
        config = configparser.ConfigParser()
        config.read(Config.CONFIG_APP_FILE)

        sections = config.sections()
        if len(sections) == 0:
            message = f"No configuration section found in the config file ('{Config.CONFIG_APP_FILE}')"
            raise Exception(message)  # pylint: disable=broad-exception-raised

        if section_name not in sections:
            # pylint: disable-next=broad-exception-raised
            raise Exception("section_name parameter must be one of " + str(sections))

        config_section = config[section_name]

        Config._init_env_variables()
        Config._init_config_section(config_section)

    @staticmethod
    def _init_config_section(config_section: configparser.SectionProxy):
        # check the seta_config/data.conf file for documentation
        Config.ES_INIT_DATA_CONFIG_FILE = config_section["ES_INIT_DATA_CONFIG_FILE"]
        Config.CRC_ES_INIT_DATA_CONFIG_FILE = config_section[
            "CRC_ES_INIT_DATA_CONFIG_FILE"
        ]
        Config.MODELS_PATH = config_section["MODELS_PATH"]

    @staticmethod
    def _init_env_variables():
        # ===== Read environment variables ======#
        Config.ES_HOST = os.environ.get("ES_HOST")
