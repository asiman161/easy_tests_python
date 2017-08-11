from django.contrib import admin

# Register your models here.
from .models import Group


@admin.register(Group)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_user', 'group_age', 'key',)

    def get_user(self, obj):
        return obj.user.first_name

    get_user.short_description = 'user first name'
