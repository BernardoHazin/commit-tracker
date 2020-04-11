from django.views import generic
from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.http import HttpResponseForbidden
from django.http import Http404
from django.http import JsonResponse
from django.shortcuts import redirect
import datetime
from .models import Commit

import requests


def get_last_month():
    today = datetime.datetime.now()
    first = today.replace(day=1)
    lastMonth = first - datetime.timedelta(days=1)
    return lastMonth.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    ).isoformat()


def serialize_commit_response(commit):
    return {
        'sha': commit['sha'],
        'committer': commit['commit']['author']['name'],
        'date': commit['commit']['author']['date'],
        'message': commit['commit']['message'],
        'url': commit['commit']['url'],
    }


def index(request):
    request.session.clear_expired()
    if 'access_token' not in request.session:
        return redirect('/')
    return render(request, 'commitTracker/track.html')


def me(request):
    request.session.clear_expired()
    if 'access_token' not in request.session:
        return redirect('/')
    return JsonResponse({
        'name': request.session.__getitem__('name'),
        'login': request.session.__getitem__('login'),
        'avatar_url': request.session.__getitem__('avatar_url'),
        'location': request.session.__getitem__('location'),
    })


def get_commits(access_token, login, project):
    # pylint: disable=no-member
    headers = {'Authorization': 'token ' + access_token}
    path = 'https://api.github.com/repos/' + login + '/' + project + '/commits'
    r = requests.get(
        path, params={'since': get_last_month()}, headers=headers)

    if 'message' in r.json():
        return JsonResponse(r.json(), safe=False)

    for el in list(map(serialize_commit_response, r.json())):
        el['project'] = project
        el['user'] = login
        Commit.objects.update_or_create(sha=el['sha'], defaults=el)


def search(request):
    # pylint: disable=no-member
    if (request.method == 'GET'):
        request.session.clear_expired()
        if 'access_token' not in request.session:
            return HttpResponseForbidden('Não autorizado')
        login = request.session.__getitem__('login')
        access_token = request.session.__getitem__('access_token')

        if 'project' in request.GET:
            get_commits(access_token, login, request.GET['project'])

        commit_list = Commit.objects.filter(user=login).values()
        total = Commit.objects.filter(user=login).count()
        paginator = Paginator(commit_list, request.GET['per_page'])
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        return JsonResponse(
            {'data': list(page_obj), 'total': total}, safe=False)
    return Http404()
