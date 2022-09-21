class LogLine:
    def __init__(self, username, created_at, ip_address, api_name, response_code, execution_time, error_message):
        self.username = username
        self.created_at = created_at
        self.ip_address = ip_address
        self.api_name = api_name
        self.response_code = response_code
        self.execution_time = execution_time
        self.error_message = error_message

