
# django/api/management/commands/update_last_active.py

from django.core.management.base import BaseCommand
from api.models import LastUpdate
from django.utils import timezone
from django.db import DatabaseError

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
            try:
                current_datetime = timezone.now()

                # Check if any LastUpdate record exists
                if LastUpdate.objects.exists():
                    LastUpdate.objects.update(last_active=current_datetime)
                else:
                    # Optional: Create a new record if you want to ensure an entry exists
                    LastUpdate.objects.create(last_updated=current_datetime, last_active=current_datetime)

            except DatabaseError as e:
                self.stdout.write(self.style.ERROR(f'Failed to update LastUpdate table: {str(e)}'))
