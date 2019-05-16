from django.db import models

# Create your models here.
from django.db import models
class Contact(models.Model):
    name = models.CharField(max_length=30)
    phone = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "addressBook_contact"