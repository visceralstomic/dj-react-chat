from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator


User = get_user_model()


class RegisterSerial(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = User
		fields = ['id', 'username', 'password', 'password2', 'photo']
		write_only = ['password']

	def validate(self, attrs):
		if attrs['password'] != attrs['password2']:
			raise serializers.ValidationError({
				'error': "Password fields didn't match"
			})

		return attrs
	
	def create(self, validated_data):
		del validated_data['password2']
		user = User.objects.create_user(**validated_data)
		user.save()
		return user
	



class UserSerial(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'photo']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=128)
    password = serializers.CharField(max_length=128)


class QuerySerial(serializers.Serializer):
	part_room = serializers.IntegerField(required=False)

