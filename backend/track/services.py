from django.core.exceptions import ObjectDoesNotExist
from os import environ
from .models import Commit, Hooks
import datetime
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


def set_webhook(project, owner, access_token):
    # pylint: disable = no-member
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
