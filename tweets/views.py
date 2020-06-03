from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from tweets.models import Tweet
from tweets.forms import TweetForm
from twitterApp import settings
from tweets.serializers import TweetSerializer

# Create your views here.

def get_home_page(request):
    return render(request, 'tweets/pages/home.html')

"""
def create_tweet(request):
    if request.method == 'POST':
        user = request.user
        serializer = TweetSerializer(data=request.POST)

        if serializer.is_valid():
            serializer.save(user=user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse({}, status=400)
"""

def create_tweet(request):
    form = TweetForm()
    if request.method == 'POST':
        if not request.user.is_authenticated:
            if request.is_ajax():
                return JsonResponse({}, status=401)
            return redirect(settings.LOGIN_URL)
        form = TweetForm(request.POST)
        if form.is_valid():
            nextUrl = request.POST['next']
            tweet = form.save(commit=False)
            tweet.user = request.user
            tweet.save()
            if request.is_ajax():
                return JsonResponse(tweet.serialize(), status=201)
            return redirect(nextUrl)
        else:
            return JsonResponse(form.errors, status=400)
    return render(request, 'tweets/components/form.html', {'form': form})

def get_tweet_list(request):
    """
    REST API to get all tweets

    Consume by javascript, Swift/Android

    :return: list of tweets
    """
    tweets = Tweet.objects.all()
    #username = request.GET.get('username')
    user = request.user
    username = user.username
    if username != None:
        tweets = tweets.filter(user__username=username)

    list_tweets = [tweet.serialize() for tweet in tweets]
    print(username)
    return JsonResponse({'data': list_tweets}, status=200)


def get_tweet_data(request, tweetId):
    tweet = Tweet.objects.get(id=tweetId)
    if request.is_ajax():
        if tweet:
            return JsonResponse(tweet.serialize(), status=200)
        return JsonResponse({'msg': 'tweet not found'}, status=404)
    return render(request, 'tweets/pages/home.html')


def delete_tweet(request, tweetId):
    if request.user.is_authenticated:
        tweet = Tweet.objects.get(id=tweetId)
        tweet.delete()
    return JsonResponse({'msg': 'deleted'})

def tweet_actions(request, tweetId):
    tweet = Tweet.objects.get(id=tweetId)
    user = request.user
    action = request.GET['action']
    likes = tweet.likes.all()
    users = []
    for like in likes:
        users.append(like)
    print(users)

    if user.is_authenticated:
        if action == 'like':
            if user in tweet.likes.all():
                tweet.likes.remove(user)
            else:
                tweet.likes.add(user)
            count = tweet.likes.count()
            return JsonResponse({'likes': count}, status=200)
        elif action == 'retweet':
            newTweet = Tweet.objects.create(user=user, parent=tweet, content=tweet.content)
            for user in users:
                newTweet.likes.add(user)
            return JsonResponse(newTweet.serialize(), status=201)
    return JsonResponse({}, status=401)
