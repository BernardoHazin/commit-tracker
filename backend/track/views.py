from django.views import generic

# Create your views here.


class IndexView(generic.ListView):
    template_name = 'commitTracker/track.html'
    context_object_name = 'commit_list'

    def get_queryset(self):
        return ''
