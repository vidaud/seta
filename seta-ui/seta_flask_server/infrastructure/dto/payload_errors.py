class PayloadErrors(Exception):
    """Raised error on custom payload validation"""

    def __init__(self, message: str, errors: dict):
        if not message:
            message = "Error encountered on parsing payload"

        self.message = message
        self.errors = errors

        super().__init__(self.message)

    @property
    def response_data(self) -> dict:
        return {"message": self.message, "errors": self.errors}
