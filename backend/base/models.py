from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# CustomUserManager permet surcharger les méthodes de création d'un utilisateur du model User de DRF
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, phone, address, role, password, **extra_fields):
        if not username:
            raise ValueError('Le champ Nom d\'utilisateur doit être renseigné')
        if not password:
            raise ValueError('Le champ Mot de passe doit être renseigné')
        if not email:
            raise ValueError('Le champ Adresse e-mail doit être renseigné')
     
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, phone=phone, address=address, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, phone, address, role, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, phone, address, role, password, **extra_fields)

# User permet de customiser le model User de base de DRF
class User(AbstractBaseUser, PermissionsMixin):
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('simple-user', 'Simple User'),
    ]

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='simple-user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','phone', 'address', 'role']

    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        return self.is_staff

# Task permet de définir le model Task
class Task(models.Model):
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
    ]
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks_created')
    last_updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks_updated')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
