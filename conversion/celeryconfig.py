BROKER_URL = "amqp://admin:tester@localhost:5672//"
CELERY_RESULT_BACKEND = "amqp"
CELERY_IMPORTS = ("tasks", )
