
# django/api/management/commands/update_last_active.py

from django.core.management.base import BaseCommand
from api.models import LastUpdate
from datetime import datetime

class Command(BaseCommand):
    help = 'Updates the LastUpdate last_active fields with the current date and time'

    def handle(self, *args, **kwargs):
        current_datetime = datetime.now()
        LastUpdate.objects.update(last_active=current_datetime)
