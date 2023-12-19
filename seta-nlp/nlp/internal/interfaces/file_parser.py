from interface import Interface


class IFileParserAsync(Interface):
    async def extract_text(self, content: bytes) -> str:
        """Extracts text from file content."""

        pass
