from rest_framework import serializers
from .models import Room, Participant
from django.contrib.auth import get_user_model


User = get_user_model()


class MiniUserSerial(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class RoomSerial(serializers.ModelSerializer):
    creator = MiniUserSerial()
    
    class Meta:
        model = Room
        fields = ['id', 'name', 'creator']


class RoomChangeSerial(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Room
        fields = ['id', 'name', 'creator']
        

class ParticipantSerial(serializers.ModelSerializer):
    user = MiniUserSerial()

    class Meta:
        model = Participant
        fields = ['id', 'user', 'room']

class ParticipantChangeSerial(serializers.ModelSerializer):
    

    class Meta:
        model = Participant
        fields = ['id', 'user', 'room']



class QryParamSerial(serializers.Serializer):
    room_id = serializers.IntegerField(required=False)