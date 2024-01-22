from rest_framework.serializers import ModelSerializer
from base.models import Task
from base.models import User
from rest_framework import serializers

# Les serializers permettent de définir les champs à afficher dans les réponses JSON


# Tasks Serializer permet de définir les champs à afficher dans les réponses JSON pour les tâches GET api/tasks
class TasksSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    last_updated_by = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username

    def get_last_updated_by(self, obj):
        return obj.last_updated_by.username

    class Meta:
        model = Task
        fields = '__all__'

# Task Serializer permet de définir les champs à afficher dans les réponses JSON pour une tâche GET api/tasks/<id>
class TaskSerializer(serializers.ModelSerializer):
    last_updated_by = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username

    def get_last_updated_by(self, obj):
        return obj.last_updated_by.username

    class Meta:
        model = Task
        fields = '__all__'
        

# User Serializer permet de définir les champs à afficher dans les réponses JSON pour les utilisateurs GET api/users depuis le panel admin
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# APIUser Serializer permet de définir les champs à afficher dans les réponses JSON pour les utilisateurs GET api/users depuis l'API REST
class APIUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'address', 'role', 'id']