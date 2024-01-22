from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import User
from django.contrib.auth.hashers import make_password

# CustomUserChangeForm permet de définir les champs à afficher dans le panel admin pour les utilisateurs
class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'
        widgets = {
            'password': forms.PasswordInput(render_value=True, attrs={'rows': 3}),
        }
# CustomUserCreationForm permet de définir les champs à afficher dans le panel admin pour la création d'un utilisateur
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = '__all__'
        widgets = {
            'password': forms.PasswordInput(render_value=True, attrs={'rows': 3}),
        }
        


