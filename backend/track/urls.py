from django.urls import path

from . import views

app_name = 'track'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('search/', views.search, name='search')
]
