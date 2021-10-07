from rest_framework import permissions


class IsParticipantOrCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user.id in obj.participant.values_list('user', flat=True)
        return request.user == obj.creator
