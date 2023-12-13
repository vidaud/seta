# Gunicorn config variables
loglevel = "info"
errorlog = "-"  # stderr
accesslog = "-"  # stdout
name = "seta-search"
worker_tmp_dir = "/dev/shm"
graceful_timeout = 0
timeout = 0
keepalive = 5
threads = 4
workers = 1
