import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, Room
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async


User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):


    async def convert_messages(self, messages):
        converted_messages = []
        for message in messages:
            converted_message = await self.convert_message(message)
            converted_messages.append(converted_message)
        return converted_messages
    
    async def convert_message(self, message):
        return {
            "author": {
                'username': message.author.username,
                'id': message.author.id,
                'photo': message.author.photo.url if message.author.photo else None
                },
            "text": message.text,
            "create_date": str(message.create_date)
        }

    @database_sync_to_async
    def get_messages(self, room_id):
        return Message.last_messages(room_id)

    @database_sync_to_async
    def get_user(self, id):
        return User.objects.get(id=id)

    @database_sync_to_async
    def get_room(self, id):
        return Room.objects.get(id=id)

    @database_sync_to_async
    def create_room(self, author, text, room):
        return Message.objects.create(
            author=author,
            text=text,
            room=room
        )

    async def fetch_messages(self):
        messages = await self.get_messages(self.room_id)
        converted_messages = await self.convert_messages(messages)
        content =  {
            "messages": converted_messages,
            "command": 'messages'
        }
        await self.send_message(content)

    async def new_message(self, data):
        author = data['from']
        author_user = await self.get_user(author['id'])
        room = await self.get_room(self.room_id)

        message = await self.create_room(
            author=author_user,
            text=data["message"],
            room=room
        )

        return {
            'command': 'new_message',
            'message': await self.convert_message(message)
        }

    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_name = f'chat_{self.room_id}'

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        command = text_data_json['command']

        if command == "fetch_messages":
            await self.fetch_messages()
        elif command == "new_message":
            content = await self.new_message(text_data_json)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': content
                }
            )

    async def send_message(self, message):
        await self.send(text_data=json.dumps(message))

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
