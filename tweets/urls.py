from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path('<int:tweetId>', views.tweet_actions, name='tweet_content'),
    path('', views.get_tweet_list),
    path('feed/', views.get_tweets_for_profile),
    path('<int:tweetId>/delete', views.delete_tweet),
    path('tweet_data/<int:tweetId>', views.get_tweet_data)
]
