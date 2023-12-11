import configparser


class Config:
    """Application configuration"""

    CONFIG_APP_FILE = "/etc/seta/nlp.conf"

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

        Config._init_config_section(config_section)

    @staticmethod
    def _init_config_section(config_section: configparser.SectionProxy):
        """Check the seta_config/nlp.conf file for documentation."""

        Config.JWT_TOKEN_INFO_URL = config_section.get("JWT_TOKEN_INFO_URL")
        Config.TESTING = config_section.getboolean("TESTING", fallback=False)
