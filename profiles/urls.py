from django.urls import path, include
from profiles.views import get_profile_user, edit_profile, user_follow_view, profile_info

urlpatterns = [
    path('user/<str:username>', get_profile_user),
    path('edit', edit_profile),
    path('follow/<str:username>', user_follow_view),
    path('info', profile_info)
]