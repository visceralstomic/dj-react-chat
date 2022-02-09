from django.db import models
from django.contrib.auth.models import  AbstractUser
from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions


def validate_photo(photo):
    width, height = get_image_dimensions(photo)
    #print(width, height)
    if width > 290 or height > 290:
        raise ValidationError("Image size limitation is 290 x 290 ")


class CustomUser(AbstractUser):
    photo = models.ImageField(blank=True, null=True, upload_to='user_photo', validators=[validate_photo])


