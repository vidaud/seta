class ApiLogicError(Exception):
    pass


class ForbiddenResourceError(Exception):
    """
        Exception raised for user permission to the resource
    """

    def __init__(self, resource_id: str, message: str = None) -> None:
        self.resource_id = resource_id

        if message is None:

            if resource_id is not None:
                message = f"User does not have a valid permission for the {resource_id} resource!"
            else:
                message = "User does not have access to any resources."

        self.message = message

        super().__init__(self.message)