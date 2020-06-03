from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Tweet

# Create your tests here.
class TestTweet(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='abc', password='123')
        self.tweet = Tweet.objects.create(content='test1', user=self.user)

    def test_tweets(self):
        tweet = Tweet.objects.create(content='test', user=self.user)
        self.assertEqual(tweet.user.username, self.user.username)

    def test_get_tweets(self):
        response = self.client.get('/tweets/')
        json = response.json()
        data = json['data']
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_tweet_likes(self):
        id = self.tweet.id;
        self.client.force_login(self.user)
        response = self.client.get(f'/tweets/{id}', {'action': 'like'})
        likes_count = response.json().get('likes')
        self.assertEqual(likes_count, 1)
        self.assertEqual(response.status_code, 200)

        response = self.client.get(f'/tweets/{id}', {'action': 'like'})
        likes_count = response.json().get('likes')
        self.assertEqual(likes_count, 0)
        self.assertEqual(response.status_code, 200)

    def test_retweet(self):
        id = self.tweet.id
        self.client.force_login(self.user)
        response = self.client.get(f'/tweets/{id}', {'action': 'retweet'})
        newTweet = response.json()
        self.assertEqual(id+1, newTweet.get('id'))
        self.assertEqual(response.status_code, 201)

    def test_tweet_create(self):
        request_data = {'content': 'test data', 'next': '/'}
        self.client.force_login(self.user)
        response = self.client.post('/create-tweet/', request_data,
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        newTweet = response.json()
        self.assertEqual(newTweet.get('content'), 'test data')
        self.assertEqual(response.status_code, 201)

    def test_tweet_delete(self):
        tweet = Tweet.objects.create(content='Some content', user=self.user)
        tweetId = tweet.id
        response = self.client.get(f'/tweets/{tweetId}/delete')
        data = response.json()
        self.assertEqual(data.get('msg'), 'deleted')

    def user_get_tweets(self):
        tweets_count = self.user.tweets.count()
        self.assertEqual(tweets_count, 1)