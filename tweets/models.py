from django.db import models

# Create your models here.

class Tweet(models.Model):
    content = models.TextField(null=True, blank=False)
    image = models.FileField(upload_to='images/', blank=True, null=True)

    class Meta:
        ordering = ['-id']

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'likes': 1
        }