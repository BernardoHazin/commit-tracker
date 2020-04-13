from django.views import generic
from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.http import HttpResponseForbidden
from django.http import HttpResponseBadRequest
from django.http import Http404
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from os import environ
from .models import Commit
from .models import Hooks
import json
import datetime
import hmac
import hashlib


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
    headers = {}
    if access_token is not None:
        headers = {'Authorization': 'token ' + access_token}
    path = 'https://api.github.com/repos/' + login + '/' + project + '/commits'
    r = requests.get(
        path, params={'since': get_last_month()}, headers=headers)

    if 'message' in r.json():
        return r.json()

    for el in list(map(serialize_commit_response, r.json())):
        el['project'] = project
        el['user'] = login
        Commit.objects.update_or_create(sha=el['sha'], defaults=el)

    return False


def search_filtered_commits(request, project):
    # pylint: disable=no-member
    if (request.method == 'GET'):
        request.session.clear_expired()
        if 'access_token' not in request.session:
            return HttpResponseForbidden('Não autorizado')
        login = request.session.__getitem__('login')
        commit_list = Commit.objects.filter(
            user=login, project=project).values()
        total = Commit.objects.filter(user=login, project=project).count()
        paginator = Paginator(commit_list, request.GET['per_page'])
        page_number = request.GET['page']
        page_obj = paginator.get_page(page_number)

        return JsonResponse(
            {'data': list(page_obj), 'total': total}, safe=False)
    return Http404()


def search(request):
    # pylint: disable=no-member
    if (request.method == 'GET'):
        request.session.clear_expired()
        if 'access_token' not in request.session:
            return HttpResponseForbidden('Não autorizado')
        login = request.session.__getitem__('login')
        access_token = request.session.__getitem__('access_token')

        if 'project' in request.GET:
            get_commits_return_not_found = False
            get_commits_return_not_found = get_commits(
                access_token, login, request.GET['project']
            )
            if (get_commits_return_not_found):
                return JsonResponse(get_commits_return_not_found, safe=False)
            set_webhook(project=request.GET['project'],
                        owner=login, access_token=access_token)

        commit_list = Commit.objects.filter(user=login).values()
        total = Commit.objects.filter(user=login).count()
        paginator = Paginator(commit_list, request.GET['per_page'])
        page_number = request.GET['page']
        page_obj = paginator.get_page(page_number)

        return JsonResponse(
            {'data': list(page_obj), 'total': total}, safe=False)
    return Http404()


def set_webhook(project, owner, access_token):
    # pylint: disable = no-member
    print(project, owner, access_token)
    projectExist = None
    try:
        projectExist = Hooks.objects.get(project=project)
    except ObjectDoesNotExist as error:
        pass

    if not projectExist:
        path = 'https://api.github.com/repos/' + owner + '/' + project + '/hooks'
        headers = {'Authorization': 'token ' + access_token}
        data = {
            "name": "web",
            "active": True,
            "events": [
                "push"
            ],
            "config": {
                "url": environ.get('BACKEND_BASE_URL') + '/track/webhook/',
                "content_type": "json",
                "secret": environ.get('WEBHOOK_SECRET'),
                "insecure_ssl": environ.get('INSECURE_SSL')
            }
        }
        print(path)
        r = requests.post(path, headers=headers, json=data)
        json = r.json()
        if 'id' in json:
            Hooks.objects.create(id=json['id'], project=project)
            print('Created', json)


@csrf_exempt
def github_webhook(request):
    # pylint: disable = no-member
    if 'HTTP_X_HUB_SIGNATURE' not in request.META:
        return HttpResponseBadRequest('Request does not contain X-GITHUB-SIGNATURE header')
    if 'HTTP_X_GITHUB_EVENT' not in request.META:
        return HttpResponseBadRequest('Request does not contain X-GITHUB-EVENT header')

    digest_name, signature = request.META['HTTP_X_HUB_SIGNATURE'].split('=')
    if digest_name != 'sha1':
        return HttpResponseBadRequest('Unsupported X-HUB-SIGNATURE digest mode found: {}'.format(digest_name))

    secret = environ.get('WEBHOOK_SECRET')

    mac = hmac.new(
        secret.encode('utf-8'),
        msg=request.body,
        digestmod=hashlib.sha1
    )

    if not hmac.compare_digest(mac.hexdigest(), signature):
        return HttpResponseBadRequest('Invalid X-HUB-SIGNATURE header found')

    event = request.META['HTTP_X_GITHUB_EVENT']

    if event not in ['push']:
        return HttpResponseBadRequest('Unsupported X-GITHUB-EVENT header found: {}'.format(event))

    payload = json.loads(request.body.decode('utf-8'))

    if 'commits' in payload:
        for el in payload['commits']:
            data = {
                'sha': el['id'],
                'committer': el['author']['name'],
                'message': el['message'],
                'url': el['url'],
                'user': payload['repository']['owner']['login'],
                'project': payload['repository']['name'],
                'date': el['timestamp']
            }
            Commit.objects.update_or_create(sha=data['sha'], defaults=data)
    print('Commits added!')
    return HttpResponse('Ok')
