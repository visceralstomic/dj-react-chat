from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets+ (
        (None, {'fields': ('photo', )}),
    )

admin.site.register(CustomUser, CustomAdmin)
