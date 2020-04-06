from django.views import generic
from django.http import HttpResponse
from django.http import HttpResponseForbidden
from django.shortcuts import redirect
import requests


class IndexView(generic.ListView):
    template_name = 'commitTracker/track.html'
    context_object_name = 'commit_list'

    def get_queryset(self):
        return ''


def search(request):
    request.session.clear_expired()
    if 'access_token' not in request.session:
        return HttpResponseForbidden('Não autorizado')
    print(request.GET)
    r = requests.get('https://api.github.com/repos/' +
                     request.GET['user'] + '/' + request.GET['project'] + '/commits')
    return HttpResponse(r)
