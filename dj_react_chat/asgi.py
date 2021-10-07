

import os
import django 
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dj_react_chat.settings')
django.setup()


django_app = get_asgi_application()
import app_chat.routing
application = ProtocolTypeRouter({
  "http": django_app,
  "websocket": AuthMiddlewareStack(
        URLRouter(
            app_chat.routing.websocket_urlpatterns
        )
    ),
})
