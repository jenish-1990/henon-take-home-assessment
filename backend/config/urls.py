import os

from django.conf import settings
from django.contrib import admin
from django.http import FileResponse
from django.urls import include, path


def index(request):
    html = os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist', 'index.html')
    return FileResponse(open(html, 'rb'), content_type='text/html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('dashboard.urls')),
    path('', index),
]
