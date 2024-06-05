# django/api/scripts/initiate_last_active_command.py

import django
import os
from django.core.management import call_command


# Initialize Django environment

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Production_Planner.settings')
django.setup()
call_command('update_last_active')

