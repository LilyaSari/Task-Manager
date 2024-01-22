from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from base.forms import CustomUserCreationForm
from .serializers import TaskSerializer, APIUserSerializer, TasksSerializer
from base.models import Task, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny

# Serializer pour obtenir le token d'un utilisateur avec plus d'informations
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['phone'] = user.phone
        token['address'] = user.address

        return token

# View pour obtenir le token d'un utilisateur avec plus d'informations
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

#### UTILISATEURS ####

# View pour connecter un utilisateur
@api_view(['POST'])
# Tout le monde peut se connecter
@permission_classes([AllowAny])
def user_login(request):
    if request.method == 'POST':
        
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # Récupération des informations de l'utilisateur
            response_data = {
                'access': str(access_token),
                'refresh': str(refresh),
                'username': user.username,
                'email': user.email,
                'phone': user.phone,
                'address': user.address,
                'role': user.role,
                'id': user.id,
            }

            return Response(response_data, status=200)
        else:
            return Response({'error': 'Identifiants de connexion invalides'}, status=401)

# View pour rafraîchir le token d'un utilisateur
@api_view(['POST'])
# Tout le monde peut rafraîchir son token
@permission_classes([AllowAny])
def user_refresh(request):
    
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response({'error': 'Le token de rafraîchissement est requis'}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        user = User.objects.get(id=refresh.payload['user_id'])
        new_refresh_token = str(RefreshToken().access_token)
        response_data = {
            'access': access_token,
            'refresh': new_refresh_token,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'address': user.address,
            'role': user.role,
            'id': user.id,
            
        }
        return Response(response_data, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# View pour créer un utilisateur
@api_view(['POST'])
# Tout le monde peut créer un utilisateur
@permission_classes([AllowAny])
def user_signup(request):
    if request.method == 'POST': 
        user_data = request.data
        user_data['password1'] = request.data.get('password')
        user_data['password2'] = request.data.get('password')
        user_data['role'] = 'simple-user'
        user_data['is_active'] = True
        form = CustomUserCreationForm(user_data)

        if form.is_valid():
            user = form.save()
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
            }, status=201)
        else:
            return Response({'error': form.errors}, status=400)

# View pour récupérer tous les utilisateurs 
@api_view(['GET'])
# Seuls les admins peuvent récupérer tous les utilisateurs
@permission_classes([IsAuthenticated, IsAdminUser])
def get_users(request):
    users = User.objects.all()
    serializer = APIUserSerializer(users, many=True)
    return Response(serializer.data)
    
    
#### TÂCHES ####
# View pour récupérer toutes les tâches ou créer une tâche
@api_view(['GET','POST'])
# Seuls les utilisateurs connectés peuvent récupérer toutes les tâches (uniquement les admins) ou créer une tâche
@permission_classes([IsAuthenticated])
def tasksView(request):
    user = request.user
    data = request.data
    if request.method == 'GET':
        # Si l'utilisateur est un admin, il peut récupérer toutes les tâches
        if user.role == 'admin':
            # Récupération des filtres
            filters = {}
            for field in Task._meta.fields:
                field_name = field.name
                value = request.query_params.get(field_name)
                if value is not None:
                    filters[f"{field_name}__icontains"] = value

            tasks = Task.objects.filter(**filters).order_by('-created_date')
            
            for task in data:
                task['user'] = User.objects.get(id=task['user']).username
                task['last_updated_by'] = User.objects.get(id=task['last_updated_by']).username
            serializer = TasksSerializer(tasks, many=True)
            return Response(serializer.data)
        
        # Si l'utilisateur est un simple-utilisateur, il peut récupérer uniquement ses tâches
        else:
            # Récupération des filtres
            filters = {}
            for field in Task._meta.fields:
                field_name = field.name
                value = request.query_params.get(field_name)
                if value is not None:
                    filters[f"{field_name}__icontains"] = value

            tasks = Task.objects.filter(user=user, **filters).order_by('-created_date')
            for task in data:
                task['user'] = User.objects.get(id=task['user']).username
                task['last_updated_by'] = User.objects.get(id=task['last_updated_by']).username
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        
    elif request.method == 'POST':
        try:
            # Si l'utilisateur est un admin, il peut créer une tâche pour n'importe quel utilisateur
            if user.role == 'admin':
                task_user_id = data.get('user')
                task_user = User.objects.get(id=task_user_id)
            # Si l'utilisateur est un simple-utilisateur, il peut créer une tâche uniquement pour lui-même
            elif user.role == 'simple-user':
                task_user = user
            else:
                raise PermissionError("Rôle utilisateur invalide")

            task = Task.objects.create(
                title=data['title'],
                description=data['description'],
                priority=data['priority'],
                status=data['status'],
                user=task_user,
                last_updated_by=user,
            )
            serializer = TaskSerializer(task, many=False)
            return Response(serializer.data, status=201)

        except KeyError:
            return Response({'error': 'Données invalides'}, status=400)

        except User.DoesNotExist:
            return Response({'error': "L'utilisateur spécifié n'existe pas"}, status=400)

        except PermissionError as e:
            return Response({'error': str(e)}, status=403)

        except Exception as e:
            return Response({'error': str(e)}, status=400)

    
# View pour récupérer une tâche, modifier une tâche ou supprimer une tâche
@api_view(['GET','PATCH','DELETE'])
# Seuls les utilisateurs connectés peuvent récupérer une tâche ou modifier une tâche ou supprimer une tâche
@permission_classes([IsAuthenticated])
def taskView(request, pk):
    user = request.user
    data = request.data
    if request.method == 'GET':
        try:
            task = Task.objects.get(id=pk)
            # Si l'utilisateur est un admin, il peut récupérer n'importe quelle tâche
            # Si l'utilisateur est un simple-utilisateur, il peut récupérer uniquement ses tâches
            if user.role != 'admin' and task.user != user:
                raise PermissionError("Vous n'avez pas la permission d'accéder à cette tâche.")
            serializer = TaskSerializer(task, many=False)
            return Response(serializer.data)

        except Task.DoesNotExist:
            return Response({'error': 'Tâche non trouvée'}, status=404)

        except PermissionError as e:
            return Response({'error': str(e)}, status=403)
    elif request.method == 'PATCH':
        try:
            task = Task.objects.get(id=pk)
            # Si l'utilisateur est un admin, il peut modifier n'importe quelle tâche
            # Si l'utilisateur est un simple-utilisateur, il peut modifier uniquement ses tâches
            if user.role != 'admin' and task.user != user:
                raise PermissionError("Vous n'avez pas la permission de modifier cette tâche.")
            for field in ['title', 'description', 'priority', 'status']:
                if field in data:
                    setattr(task, field, data[field])
            # Modification de l'utilisateur qui a modifié la tâche
            task.last_updated_by = user
            task.user = User.objects.get(id=data['user'])
            task.save()

            serializer = TaskSerializer(task, many=False)
            return Response(serializer.data)

        except Task.DoesNotExist:
            return Response({'error': 'Tâche non trouvée'}, status=404)

        except PermissionError as e:
            return Response({'error': str(e)}, status=403)
    elif request.method == 'DELETE':
        try:
            task = Task.objects.get(id=pk)
            # Si l'utilisateur est un admin, il peut supprimer n'importe quelle tâche
            # Si l'utilisateur est un simple-utilisateur, il peut supprimer uniquement ses tâches
            if user.role != 'admin' and task.user != user:
                raise PermissionError("Vous n'avez pas la permission de supprimer cette tâche.")

            task.delete()
            return Response({'success': 'Tâche supprimée avec succès'}, status=200)

        except Task.DoesNotExist:
            return Response({'error': 'Tâche non trouvée'}, status=404)

        except PermissionError as e:
            return Response({'error': str(e)}, status=403)
