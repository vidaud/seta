import os
import asyncio
import logging
from interface import implements

from nlp.internal.interfaces import file_parser

logger = logging.getLogger(__name__)


class TikaParser(implements(file_parser.IFileParserAsync)):
    def __init__(self, tika_path: str):
        self.tika_path = tika_path

    async def extract_text(self, content: bytes) -> str:
        """Extracts text from file content."""

        proc = await asyncio.create_subprocess_shell(
            f"java -jar {self.tika_path} --text",
            stdout=asyncio.subprocess.PIPE,
            stdin=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await proc.communicate(input=content)

        if stdout:
            return stdout.decode(encoding="utf-8")

        if stderr:
            logger.error(stderr.decode(encoding="utf-8"))
        # TODO: raise an exception for stderr.decode(encoding="utf-8")

        return None


async def get_file_parser():
    """Creates a Tika parser client."""

    #! see ENV variable in Dockerfile
    tika_path = os.environ["TIKA_PATH"]

    return TikaParser(tika_path=tika_path)
