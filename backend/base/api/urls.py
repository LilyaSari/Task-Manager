from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('users', views.get_users), # GET api/users -> Récupère tous les utilisateurs
    path('tasks', views.tasksView), # GET api/tasks -> Récupère toutes les tâches | POST api/tasks -> Crée une tâche
    path('tasks/<str:pk>', views.taskView, name='get_task'), # GET api/tasks/<id> -> Récupère une tâche | PATCH api/tasks/<id> -> Modifie une tâche | DELETE api/tasks/<id> -> Supprime une tâche
    path('signin', views.user_login), # POST api/signin -> Connecte un utilisateur 
    path('signup', views.user_signup), # POST api/signup -> Crée un utilisateur
    path('refresh', views.user_refresh), # POST api/refresh -> Rafraichit le token d'un utilisateur
    path('token', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # POST api/token -> Récupère le token d'un utilisateur
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'), # POST api/token/refresh -> Rafraichit le token d'un utilisateur
]
