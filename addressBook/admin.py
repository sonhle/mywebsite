from django.contrib import admin

# Register your models here.
from .models import Contact

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'address')

admin.site.register(Contact, ContactAdmin)