from django.conf.urls import url

from .views import (
    SubjectListAPIView,
    SubjectCreateAPIView,
    SubjectDetailAPIView
)

urlpatterns = [
    url(r'^$', SubjectListAPIView.as_view(), name='list'),
    url(r'^create/$', SubjectCreateAPIView.as_view(), name='create'),
    url(r'^(?P<id>\d+)/$', SubjectDetailAPIView.as_view(), name='detail'),
]
