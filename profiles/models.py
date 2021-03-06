from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

# Create your models here.
class FollowerRelation:
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    location = models.CharField(max_length=45, null=True, blank=True)
    bio = models.TextField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    followers = models.ManyToManyField(User, related_name='following')

    def serialize(self):
        followers_count = self.followers.count()
        first_name = self.user.first_name
        last_name = self.user.last_name
        following = self.user.following.count()
        username = self.user.username
        return {
            'id': self.id,
            'username': username,
            'location': self.location,
            'bio': self.bio,
            'followers_count': followers_count,
            'first_name': first_name,
            'last_name': last_name,
            'following': following
        }


def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_did_save, sender=User)