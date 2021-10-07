import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message, Room
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(WebsocketConsumer):


    def fetch_messages(self, data):
        messages = Message.last_messages(self.room_id)
        content = {
            "messages": self.msgs_to_json(messages),
            "command": 'messages'
        }
        self.send_message(content)

    def new_message(self, data):
        author = data['from']
        author_user = User.objects.get(id=author['id'])
        room = Room.objects.get(id=self.room_id)

        message = Message.objects.create(
            author=author_user,
            text=data["message"],
            room=room
        )

        content = {
            'command': 'new_message',
            'message': self.msg_to_json(message)
        }

        self.send_chat_message(content)

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def msgs_to_json(self, messages):
        return [self.msg_to_json(message) for message in messages]
    
    def msg_to_json(self, message):
        
        return {
            "author": {
                'username': message.author.username,
                'id': message.author.id,
                'photo': message.author.photo.url if message.author.photo else None
                },
            "text": message.text,
            "create_date": str(message.create_date)
        }

    def connect(self):
        if self.scope['user'].is_anonymous:
            self.close()
        else:
            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_name = f'chat_{self.room_id}'

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))