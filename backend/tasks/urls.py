from django.conf.urls import url

from .views import (
    TaskCreateAPIView
)

urlpatterns = [
    url(r'^create/$', TaskCreateAPIView.as_view(), name='create'),
]
