from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile
# Create your tests here.

class ProfileTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(username='User1', password='6621')
        self.user2 = User.objects.create(username='User2', password='3419')

    def test_profiles_created(self):
        count = Profile.objects.all().count()
        self.assertEqual(count, 2)

    def test_following_followers(self):
        profile1 = self.user1.profile
        profile1.followers.add(self.user2)

        user = self.user2.following.get(user=self.user1)
        self.assertTrue(user)

    def test_follow_user(self):
        self.client.force_login(self.user1)
        response = self.client.get(f'/profiles/follow/{self.user2.username}?action=follow')
        data = response.json()
        count = data['followers']
        self.assertEqual(count, 1)

    def test_unfollow_user(self):
        self.client.force_login(self.user1)
        response = self.client.get(f'/profiles/follow/{self.user2.username}?action=unfollow')
        data = response.json()
        count = data['followers']
        self.assertEqual(count, 0)