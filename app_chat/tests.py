from django.test import TestCase
from .models import Room, Message, Participant
from django.contrib.auth import get_user_model
from django.urls import reverse
import json 

from rest_framework.test import APITestCase
from rest_framework import status



User = get_user_model()


class TestSetUp(APITestCase):
	
	def setUp(self):
		self.admin_user = User.objects.create_user(
			username="admin", password="1234y",
			is_staff=True, is_superuser=True
		)

		self.testuser1 = User.objects.create_user(
			username="testuser1", password="1234y"
		)

		self.testuser2 = User.objects.create_user(
			username="testuser2", password="1234y"
		)

		self.testroom1 = Room.objects.create(
			creator=self.admin_user,
			name="Room 101"
		)

		self.testroom2 = Room.objects.create(
			creator=self.testuser1,
			name="Room 102"
		)

		self.testroom3 = Room.objects.create(
			creator=self.testuser2,
			name="Room 103"
		)  

		self.participant1 = Participant.objects.create(
			user=self.admin_user,
			room=self.testroom2
		) 



class RoomTest(TestSetUp):

	def test_auth_user_create_room(self):
		url = reverse('app_chat:room-list')
		self.client.login(username="admin", password="1234y")
		new_room = {"name": 'Room 1'}
		response = self.client.post(url, new_room)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data.get("name"), new_room['name'])

	def test_unauth_user_create_room(self):
		url = reverse('app_chat:room-list')
		new_room = {"name": 'Room 1'}
		response = self.client.post(url, new_room) 
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
	
	def test_creator_delete_room(self):
		url = reverse('app_chat:room-detail', kwargs={"pk":self.testroom1.id})
		self.client.login(username="admin", password="1234y")
		count_before_delete = Room.objects.count()
		response = self.client.delete(url)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertEqual(count_before_delete - 1, Room.objects.count())

	def test_nonauth_delete_room(self):
		url = reverse('app_chat:room-detail', kwargs={"pk":self.testroom1.id})
		response = self.client.delete(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_noncreator_delete_room(self):
		url = reverse('app_chat:room-detail', kwargs={"pk":self.testroom1.id})
		self.client.login(username="testuser1", password="1234y")
		count_before_delete = Room.objects.count()
		response = self.client.delete(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(count_before_delete, Room.objects.count())			

	def test_creator_added_as_participant(self):
		url = reverse('app_chat:room-list')
		self.client.login(username="admin", password="1234y")
		response = self.client.post(url, {"name": 'Room 1'})
		new_room = Room.objects.get(id=response.data.get('id'))
		self.assertIn('admin', new_room.participant.values_list("user__username", flat=True))

	def test_non_other_user_added_as_participant(self):
		url = reverse('app_chat:room-list')
		self.client.login(username="admin", password="1234y")
		response = self.client.post(url, {"name": 'Room 1'})
		new_room = Room.objects.get(id=response.data.get('id'))
		self.assertNotIn(self.testuser1.username, new_room.participant.values_list("user__username", flat=True))

	def test_user_sees_only_his_rooms(self):
		url = reverse('app_chat:room-list')
		self.client.login(username="admin", password="1234y")
		response = self.client.get(url)
		self.assertEqual(len(response.data), Room.objects.filter(participant__user=self.admin_user).count())

	def test_user_cant_visit_unallowed_rooms(self):
		url = reverse('app_chat:room-detail', kwargs={"pk":self.testroom3.id})
		self.client.login(username="testuser1", password="1234y")
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_user_can_visit_allowed_rooms(self):
		url = reverse('app_chat:room-detail', kwargs={"pk":self.testroom2.id})
		self.client.login(username="admin", password="1234y")
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)



class ParticipantTest(TestSetUp):

	def test_creator_adds_user(self):
		url = reverse('app_chat:participant-list')
		self.client.login(username="admin", password="1234y")
		response = self.client.post(url, {"user": self.testuser1.id, "room": self.testroom1.id})
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertIn(self.testuser1.username, self.testroom1.participant.values_list("user__username", flat=True))

	def test_noncreator_adds_user(self):
		url = reverse('app_chat:participant-list')
		self.client.login(username="testuser1", password="1234y")
		response = self.client.post(url, {"user": self.testuser2.id, "room": self.testroom1.id})
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
		self.assertNotIn(self.testuser2.username, self.testroom1.participant.values_list("user__username", flat=True))

	def test_creator_delete_user(self):
		url = reverse('app_chat:participant-detail', kwargs={"pk": self.participant1.id})
		self.client.login(username="testuser1", password="1234y")
		response = self.client.delete(url)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertNotIn(self.admin_user.username, self.testroom2.participant.values_list("user__username", flat=True))

	def test_noncreator_delete_user(self):
		url = reverse('app_chat:participant-detail', kwargs={"pk": self.participant1.id})
		self.client.login(username="testuser2", password="1234y")
		response = self.client.delete(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
		self.assertIn(self.admin_user.username, self.testroom2.participant.values_list("user__username", flat=True))

	def test_get_only_room_pariticipants(self):
		url = reverse('app_chat:participant-list')
		url_with_query = f"{url}?room_id={self.testroom2.id}"
		self.client.login(username="admin", password="1234y")
		response = self.client.get(url_with_query)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), len(self.testroom2.participant.values_list()))

	def test_cant_add_same_user_more_than_once(self):
		url = reverse('app_chat:participant-list')
		self.client.login(username="testuser1", password="1234y")
		response = self.client.post(url, {"user": self.admin_user.id, "room": self.testroom2.id})
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		






