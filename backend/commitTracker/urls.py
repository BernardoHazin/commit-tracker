from django.conf.urls import include, url  # noqa
from django.urls import path
from django.contrib import admin
from django.shortcuts import redirect
from . import views

import django_js_reverse.views


urlpatterns = [
    path("", views.index),
    path("oauth", views.oauth_cb),
    # path("", lambda request : redirect("/exampleapp/")),
    # path("admin/", admin.site.urls, name="admin"),
    path('track', include("track.urls"), name="track"),
    path("jsreverse/", django_js_reverse.views.urls_js, name="js_reverse"),
    path("exampleapp/", include("exampleapp.urls"), name="exampleapp"),
]
