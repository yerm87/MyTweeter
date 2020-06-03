from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile
# Create your tests here.

class ProfileTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(username='User1', password='6621')
        self.user2 = User.objects.create(username='User2', password='3419')

    def profiles_created(self):
        count = Profile.objects.all().count()
        self.assertEqual(count, 2)