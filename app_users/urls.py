from django.urls import path
from .views import login_view, logout_view, get_user, UserListView

app_name = 'app_users'

urlpatterns = [
    path('login/', login_view, name="login"),
    path('logout/', logout_view, name="logout"),
    path('get_user/', get_user, name="get-user"),
    path('', UserListView.as_view(), name='users-list')
]