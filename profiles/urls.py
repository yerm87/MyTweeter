from django.urls import path, include
from profiles.views import get_profile_user, edit_profile

urlpatterns = [
    path('user/<str:username>', get_profile_user),
    path('edit', edit_profile)
]