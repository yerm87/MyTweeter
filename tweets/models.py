from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.
class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
    content = models.TextField(null=True, blank=False)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tweets')
    likes = models.ManyToManyField(User, related_name='tweet_user', through=TweetLike)
    timestamp = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['-id']

    def serialize(self):
        if self.parent == None:
            parentTweet = None
        else :
            parentTweet = self.parent.serialize()

        #user = self.user.id

        profile = self.user.profile

        followers_count = profile.followers.count()
        location = profile.location
        bio = profile.bio
        first_name = self.user.first_name
        last_name = self.user.last_name
        following_count = self.user.following.count()
        user = {
            'id': self.user.id,
            'username': self.user.username,
            'location': location,
            'bio': bio,
            'followers_count': followers_count,
            'first_name': first_name,
            'last_name': last_name,
            'following_count': following_count
        }

        return {
            'id': self.id,
            'content': self.content,
            'likes': self.likes.count(),
            'parent': parentTweet,
            'user': user
        }