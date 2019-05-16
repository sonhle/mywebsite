from django.urls import include, path

from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'contacts', views.ContactsView)

app_name = 'addressBook'
urlpatterns = [
    path('', include(router.urls)),
]