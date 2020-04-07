from django.urls import path
from django.urls import re_path

from . import views

app_name = 'track'
urlpatterns = [
    # path('', views.IndexView.as_view(), name='index'),
    # path('commits/', views.IndexView.as_view(), name='commits'),
    path('search/', views.search, name='search'),
    re_path(r'^(?:.*)/?$', views.IndexView.as_view()),
]
