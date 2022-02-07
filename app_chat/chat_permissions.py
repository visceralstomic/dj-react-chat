from rest_framework import permissions
from .models import Room, Participant

class IsParticipantOrCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user.id in obj.participant.values_list('user', flat=True)
        return request.user == obj.creator

class IsCreator(permissions.BasePermission):
    def has_permission(self, request, view):

        if request.method in permissions.SAFE_METHODS:
            return True

        if request.data.get('room', None):
            room_id = request.data.get('room', None)
        elif view.kwargs.get('pk', None):
            participant = Participant.objects.get(id=view.kwargs.get('pk'))
            room_id = participant.room.id

        room = Room.objects.get(id=room_id)

        

        return request.user == room.creator 