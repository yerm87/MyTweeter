from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path('<int:tweetId>/', views.get_tweet_data, name='tweet_content'),
    path('', views.get_tweet_list)
]