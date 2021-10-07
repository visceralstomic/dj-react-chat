from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .serializers import RoomSerial, ParticipantSerial, RoomChangeSerial, QryParamSerial, ParticipantChangeSerial
from .models import Room, Participant
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .chat_permissions import IsParticipantOrCreator



class RoomListView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    permission_classes = [IsAuthenticated, IsParticipantOrCreator]

    def get_queryset(self):
        return self.queryset.filter(participant__user=self.request.user)

    def get_serializer_class(self):
        return RoomChangeSerial if self.request.method == 'POST' else RoomSerial


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    permission_classes = [IsAuthenticated, IsParticipantOrCreator]

    def get_serializer_class(self):
        return RoomChangeSerial if self.request.method in ('PUT','PATCH') else RoomSerial


class ParticipantListView(generics.ListCreateAPIView):
    queryset = Participant.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset.all()
        if self.request.query_params.get('room_id', None):
            qry_params = QryParamSerial(data=self.request.query_params)
            qry_params.is_valid(raise_exception=True)
            queryset = queryset.filter(room__id=qry_params.validated_data['room_id'])
        return queryset

    def get_serializer_class(self):
        return ParticipantChangeSerial if self.request.method == 'POST' else ParticipantSerial


class ParticipantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerial
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return ParticipantChangeSerial if self.request.method in ('PUT','PATCH') else ParticipantSerial


@login_required
def index(request):
    return render(request, 'app_chat/index.html')

@login_required
def room(request, room_name):
    return render(request, 'app_chat/room.html', {
        'room_name': room_name,
        'username': "user_name"
    })