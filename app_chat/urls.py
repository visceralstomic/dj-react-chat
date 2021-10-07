from django.urls import path
from .views import (index, room, RoomDetailView, ParticipantListView,
                    RoomListView, ParticipantDetailView )


app_name = 'app_chat'
urlpatterns = [
    path('index/', index, name='index'),
    path('index/<int:room_name>/', room, name='room'),
    path('room/', RoomListView.as_view(), name='room-list'),
    path('room/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('participant/', ParticipantListView.as_view(), name='participant-list'),
    path('participant/<int:pk>/', ParticipantDetailView.as_view(), name='participant-detail'),
]