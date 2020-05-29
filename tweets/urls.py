from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path('<int:tweetId>', views.tweet_actions, name='tweet_content'),
    path('', views.get_tweet_list),
    path('<int:tweetId>/delete', views.delete_tweet)
]
