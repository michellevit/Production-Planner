import json
from django.core.management.base import BaseCommand
from api.models import Dimension

class Command(BaseCommand):
    help = 'Import dimensions from a JSON file into the database'

    def handle(self, *args, **kwargs):
        dimensions = 'api/data/gtc_dimensions.json'
        with open(dimensions, 'r') as json_file:
            dimensions_data = json.load(json_file)
        for dimension_data in dimensions_data:
            Dimension.objects.get_or_create(
                length=dimension_data['length'],
                width=dimension_data['width'],
                height=dimension_data['height'],
                package_size=dimension_data['package_size'],
            )
            self.stdout.write(self.style.SUCCESS(f'Dimension {dimension_data["package_size"]} added'))

