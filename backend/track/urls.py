from django.urls import path
from django.urls import re_path

from . import views

app_name = 'track'
urlpatterns = [
    path('me/', views.me, name='me'),
    path('search/', views.search, name='search'),
    path('webhook/', views.github_webhook, name='webhook'),
    re_path(r'^(?:.*)/?$', views.index, name='index'),
]
