from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse 
from app_chat.models import Room, Participant

from rest_framework.test import APITestCase
from rest_framework import status

from PIL import Image
import io 


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

		self.testroom1 = Room.objects.create(
			creator=self.admin_user,
			name="Room 101"
		)

		self.testroom2 = Room.objects.create(
			creator=self.testuser1,
			name="Room 102"
		)

		self.testroom3 = Room.objects.create(
			creator=self.admin_user,
			name="Room 103"
		)  

		self.participant1 = Participant.objects.create(
			user=self.testuser1,
			room=self.testroom1
		) 



class UserTest(TestSetUp):

	def create_photo(self, size):
		image_file = io.BytesIO()
		image = Image.new('RGBA', size=size, color=(100, 0, 10))
		image.save(image_file, 'png')
		image_file.name = 'test.png'
		image_file.seek(0)
		return image_file

	def test_user_success_register(self):
		url = reverse("app_users:users-list")
		data = {
			"username": "testname",
			"password": "1234y",
			"password2": "1234y"
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED )
		self.assertEqual(response.data['username'], data['username'])

	def test_register_success_photo(self):
		url = reverse("app_users:users-list")
		data = {
			"username": "testname",
			"password": "1234y",
			"password2": "1234y",
			"photo": self.create_photo((250, 250))
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED )
		self.assertEqual(response.data['username'], data['username'])

	def test_register_fail_photo(self):
		url = reverse("app_users:users-list")
		data = {
			"username": "testname",
			"password": "1234y",
			"password2": "1234y",
			"photo": self.create_photo((300, 250))
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST )

	def test_users_who_not_pariticipants(self):
		url = reverse("app_users:users-list")
		url_with_qry = f"{url}?part_room={self.testroom3.id}"

		response = self.client.get(url_with_qry)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), User.objects.exclude(participant__room__id=self.testroom3.id).count()) 

	def test_auth_user_success_register(self):
		url = reverse("app_users:get-user")
		self.client.login(username=self.testuser1.username, password="1234y")
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_20O_OK)
		self.assertEqual(response.data['username'], self.testuser1.username)

	def test_auth_user_success_register(self):
		url = reverse("app_users:get-user")
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)











