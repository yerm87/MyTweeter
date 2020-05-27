from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from tweets.models import Tweet
from tweets.forms import TweetForm

# Create your views here.

def get_home_page(request):
    return render(request, 'tweets/pages/home.html')

def create_tweet(request):
    form = TweetForm()
    if request.method == 'POST':
        form = TweetForm(request.POST)
        if form.is_valid():
            nextUrl = request.POST['next']
            tweet = form.save(commit=False)
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
    list_tweets = [tweet.serialize() for tweet in tweets]

    return JsonResponse({'data': list_tweets})


def get_tweet_data(request, tweetId):
    obj = {
        'id': tweetId
    }
    try:
        model = Tweet.objects.get(id=tweetId)
        obj['content'] = model.content
        status = 200
    except:
        obj['message'] = 'Not Found',
        status = 404
    return JsonResponse(obj, status=status)
