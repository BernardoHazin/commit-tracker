from django.shortcuts import render
from django.contrib import admin
from django.shortcuts import redirect
from django.http import HttpResponseServerError
from django.http import HttpResponse
from os import environ
import django.http
import requests

def index(request):
    request.session.clear_expired()
    print
    if 'access_token' in request.session:
        return redirect('/track/')
    return render(request, 'commitTracker/index.html')


def oauth_cb(request):
    print(environ.get('CLIENT_ID'))
    if 'code' not in request.GET:
        return redirect('/')
    r = requests.post(
        'https://github.com/login/oauth/access_token', data={
            'client_id': environ.get('CLIENT_ID'),
            'client_secret': environ.get('CLIENT_SECRET'),
            'code': request.GET['code']
        })
    query = r.text
    params = dict(x.split('=') for x in query.split('&'))
    if 'access_token' in params:
        print('Access-token', params['access_token'])
        request.session.flush()
        request.session.__setitem__('access_token', params['access_token'])
        request.session.set_expiry(60)
        return redirect("/track/")
    if 'error' in params:
        return HttpResponseServerError(params['error'])
    return HttpResponseServerError('Something went wrong')
