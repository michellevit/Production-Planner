import json
from django.core.management.base import BaseCommand
from api.models import Product

class Command(BaseCommand):
    help = 'Load a list of products from a gtc_products.json into the database'

    def handle(self, *args, **kwargs):
        with open('api/data/gtc_products.json', 'r', encoding='utf-8') as file:
            products = json.load(file)['products']
            for item_name in products:
                Product.objects.get_or_create(item_name=item_name)
                self.stdout.write(self.style.SUCCESS(f'Product {item_name} added'))