from django.shortcuts import render
from django.contrib import admin
from django.shortcuts import redirect
from django.http import HttpResponseServerError
from django.http import HttpResponse
from os import environ
import django.http
import requests


def get_user(token):
    headers = {'Authorization': 'token ' + token}
    return requests.get('https://api.github.com/user', headers=headers).json()


def index(request):
    request.session.clear_expired()
    if 'access_token' in request.session:
        return redirect('/track/')
    return render(request, 'commitTracker/index.html', context={'client_id': environ.get('CLIENT_ID')})


def oauth_cb(request):
    print('Client ID', environ.get('CLIENT_ID'))
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
        user = get_user(params['access_token'])
        print(user)
        request.session.flush()
        request.session.__setitem__('access_token', params['access_token'])
        request.session.__setitem__('login', user['login'])
        request.session.__setitem__('avatar_url', user['avatar_url'])
        request.session.__setitem__('name', user['name'])
        request.session.__setitem__('location', user['location'])
        request.session.set_expiry(300)
        return redirect("/track/")
    if 'error' in params:
        return HttpResponseServerError(params['error'])
    return HttpResponseServerError('Something went wrong')
