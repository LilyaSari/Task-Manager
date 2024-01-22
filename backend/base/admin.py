from django.contrib import admin
from .models import Task, User
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm, CustomUserCreationForm

# CustomUserAdmin permet de définir les champs à afficher dans le panel admin pour les utilisateurs
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = ('username', 'email', 'phone', 'address', 'role', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('phone', 'address', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'address', 'role', 'password1', 'password2'),
        }),
    )

admin.site.register(User, CustomUserAdmin)

admin.site.register(Task)
