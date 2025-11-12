from django.apps import AppConfig

# Eddited
from django.db.models import CharField
from django.db.models.signals import class_prepared

def set_max_length(sender, **kwargs):
    for field in sender._meta.local_fields:
        if isinstance(field, CharField) and field.max_length > 191:
            field.max_length = 191

class StoreConfig(AppConfig):
    name = 'store'

    def ready(self):
        class_prepared.connect(set_max_length)