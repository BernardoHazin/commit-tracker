from django.contrib.messages.storage.fallback import FallbackStorage
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory, TestCase
from django.urls import reverse
from django.test import TestCase
from .views import index, me, search, search_filtered_commits
from .models import Commit
import json
import datetime


class IndexViewTests(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()

    def test_should_redirect_without_authentication(self):
        request = self.factory.get(reverse('track:index'))
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session.save()
        response = index(request)
        self.assertEqual(response.status_code, 302)

    def test_should_return_react_template(self):
        request = self.factory.get(reverse('track:index'))
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session['access_token'] = 'some_token'
        request.session.save()
        response = index(request)
        self.assertEqual(response.status_code, 200)


class MeViewTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_should_redirect_without_authentication(self):
        request = self.factory.get(reverse('track:me'))
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session.save()
        response = me(request)
        self.assertEqual(response.status_code, 302)

    def test_should_return_user_data(self):
        request = self.factory.get(reverse('track:me'))
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session['access_token'] = 'some_token'
        request.session['name'] = 'name'
        request.session['login'] = 'login'
        request.session['avatar_url'] = 'avatar_url'
        request.session['location'] = 'location'
        request.session.save()
        response = me(request)
        self.assertJSONEqual(response.content, {
            'name': 'name',
            'login': 'login',
            'avatar_url': 'avatar_url',
            'location': 'location'
        })


class SearchViewTests(TestCase):
    # pylint: disable=no-member
    def setUp(self):
        today = datetime.datetime.now()
        yesterday = today - datetime.timedelta(1)
        last_week = today - datetime.timedelta(7)
        self.commits = Commit.objects.bulk_create(
            [
                Commit(
                    sha="da39a3ee5e6b4b0d3255bfef95601890afd80709",
                    user="user 1",
                    date=today.isoformat()
                ),
                Commit(
                    sha="620aba75c0866bd0fc7c11a7fb70611312cb6ed4",
                    user="user 1",
                    date=yesterday.isoformat()
                ),
                Commit(
                    sha="d92431e5127244c07f9264467d9ac3fa3ef5fbe9",
                    user="user 1",
                    date=last_week.isoformat()
                )
            ]
        )
        self.factory = RequestFactory()

    def test_should_not_authorize_without_authentication(self):
        request = self.factory.get(reverse('track:search'))
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session.save()
        response = search(request)
        self.assertEqual(response.status_code, 403)

    def test_should_return_commits_list(self):
        request = self.factory.get(
            reverse('track:search'),
            {'page': 1, 'per_page': 2}
        )
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session['access_token'] = 'some_token'
        request.session['login'] = 'user 1'
        request.session.save()
        response = search(request)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['total'], 3)
        self.assertEqual(len(data['data']), 2)


class FilteredSearchViewTests(TestCase):
    # pylint: disable=no-member
    def setUp(self):
        today = datetime.datetime.now()
        yesterday = today - datetime.timedelta(1)
        last_week = today - datetime.timedelta(7)
        self.commits = Commit.objects.bulk_create(
            [
                Commit(
                    sha="da39a3ee5e6b4b0d3255bfef95601890afd80709",
                    user="user 1",
                    project="project_1",
                    date=today.isoformat()
                ),
                Commit(
                    sha="620aba75c0866bd0fc7c11a7fb70611312cb6ed4",
                    user="user 1",
                    project="project_1",
                    date=yesterday.isoformat()
                ),
                Commit(
                    sha="d92431e5127244c07f9264467d9ac3fa3ef5fbe9",
                    user="user 1",
                    project="project_2",
                    date=last_week.isoformat()
                )
            ]
        )
        self.factory = RequestFactory()

    def test_should_not_authorize_without_authentication(self):
        request = self.factory.get(
            reverse('track:filtered_search', kwargs={'project': 'project_1'})
        )
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session.save()
        response = search_filtered_commits(request, project='project_1')
        self.assertEqual(response.status_code, 403)

    def test_should_return_filtered_commits_list(self):
        request = self.factory.get(
            reverse('track:filtered_search', kwargs={'project': 'project_1'}),
            {'page': 1, 'per_page': 2}
        )
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session['access_token'] = 'some_token'
        request.session['login'] = 'user 1'
        request.session.save()
        response = search_filtered_commits(request, project='project_1')
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['total'], 2)
        self.assertEqual(len(data['data']), 2)
