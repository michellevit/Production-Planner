from django.shortcuts import render
import datetime


# Create your views here.


def index(request):
    now = datetime.datetime.today().strftime("%B %d")
    return render(request, "open_orders_app/index.html", {"date": now})
