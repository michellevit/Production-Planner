
# django/api/management/commands/update_last_active.py

from django.core.management.base import BaseCommand
from api.models import LastUpdate
from django.utils import timezone

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        current_datetime = timezone.now()  
        LastUpdate.objects.update(last_active=current_datetime)
