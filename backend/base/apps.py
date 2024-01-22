from django.apps import AppConfig

# BaseConfig permet de définir le nom de l'application
class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'
