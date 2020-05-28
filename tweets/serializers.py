from tweets.models import Tweet
from twitterApp import settings
from rest_framework import serializers

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['content']

    def validate_content(self, value):
        if len(value) > settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError('This tweet is too long')
        return value