from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver


User = get_user_model()


class Room(models.Model):
    creator = models.ForeignKey(User, related_name="rooms", on_delete=models.CASCADE)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name 


class Message(models.Model):
    author = models.ForeignKey(User, related_name="author_message", on_delete=models.CASCADE)
    text = models.TextField()
    create_date = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)

    def __str__(self):
        return self.text
    
    def last_messages(room_id):
        return reversed(Message.objects.filter(room__id=room_id).select_related('author').order_by("-create_date")[:10])


class Participant(models.Model):
    user = models.ForeignKey(User, related_name='participant', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name='participant', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} in {self.room}"

    class Meta:
        unique_together = [['user', 'room'],]



@receiver(post_save, sender=Room)
def create_paricipant(sender, instance, created, **kwargs):
    if created:
        Participant.objects.create(user=instance.creator, room=instance)
        