from django.contrib import admin
from .models import Message, Room, Participant

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['author', 'text', 'room']

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'creator']

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['room', 'user']
