from django.conf.urls import url

from .views import (
    TaskCreateAPIView,
    TaskTeacherListAPIView,
    TaskDestroyAPIView,
    TaskUpdateAPIView
)

urlpatterns = [
    url(r'^tasks-teacher/$', TaskTeacherListAPIView.as_view(), name='create'),
    url(r'^create/$', TaskCreateAPIView.as_view(), name='create'),
    url(r'^(?P<id>\d+)/task-visibility/$', TaskUpdateAPIView.as_view(), name='update'),
    url(r'^(?P<id>\d+)/delete/$', TaskDestroyAPIView.as_view(), name='destroy'),
]
