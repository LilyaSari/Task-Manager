# Task Manager

Ce projet est composé de deux parties distinctes : le backend et le frontend. Suivez les instructions ci-dessous pour configurer et exécuter chaque partie du projet.

De plus, une API REST est intégrée, accompagnée de sa documentation dans un fichier [DOC-API.md](https://github.com/LilyaSari/Task-Manager/blob/main/DOC-API.md).

## 1. Développement (Locale)

### 1.1 Backend
<hr>

#### 1.1.1 Prérequis
<hr>

Assurez-vous d'avoir les éléments suivants installés sur votre machine locale :

[Python (3.x)](https://www.python.org/downloads/)

#### 1.1.2 Installation
<hr>

1- Créez un environnement virtuel en utilisant la commande suivante :

```bash
python -m venv venv
```

2- Activez l'environnement virtuel. Sur Windows, utilisez :

```bash
venv\Scripts\activate.bat
```

Sur Linux/macOS, utilisez :

```bash
python -m venv venv
```

3- Mettez à jour pip à la dernière version

```bash
python -m pip install --upgrade pip
```

4- Naviguez vers le répertoire du backend :

```bash
cd backend
```

5- Installez les dépendances du projet :

```bash
pip install -r requirements.txt
```

6- Appliquez les migrations de la base de données :

```bash
python manage.py makemigrations base
python manage.py migrate
```

7- Créez un superutilisateur pour accéder à l'interface d'administration Django :

```bash
python manage.py createsuperuser
```
Notez que lors de la création d'un superutilisateur à l'aide de cette commande, deux rôles distincts, `admin` et `user` , seront automatiquement assignés à l'utilisateur. Les paramètres requis, tels que le mot de passe, le nom d'utilisateur et l'adresse e-mail, seront également configurés pendant le processus de création du superutilisateur.


#### 1.1.3 Exécution
<hr>

1- Lancez le serveur de développement :

```bash
python manage.py runserver
```

### 1.2 Frontend
<hr>

#### 1.2.1 Prérequis
<hr>

Assurez-vous d'avoir les éléments suivants installés sur votre machine locale :

[Node.js](https://nodejs.org/en/download)

#### 1.2.2 Installation
<hr>

1- Sur un autre terminal, naviguez vers le répertoire du frontend :

```bash
cd frontend
```

2- Installez les dépendances du projet à l'aide de npm :

```cmd
npm install
```

#### 1.2.3 Exécution
<hr>

1- Lancez l'application frontend en mode développement :

```bash
npm start
```

Après avoir suivi ces étapes, vous devriez avoir le backend et le frontend du projet en cours d'exécution localement.

## 2. Avec Docker

***NOTE** : Ce projet utilise Docker pour faciliter le développement et le déploiement. Les configurations Docker sont fortement inspirées par le projet [docker-django-react-postgres-nginx](https://github.com/kamil-kolodziej/docker-django-react-postgres-nginx/tree/main) de Kamil Kołodziej.*

### 2.1 Prérequis
<hr>

Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine. Si ce n'est pas le cas, suivez les instructions d'installation sur le [site officiel de Docker](https://docs.docker.com/engine/install/).


### 2.2 Développement
<hr>

1- Construisez les conteneurs Docker pour le développement  :

```bash
docker-compose -f .\docker-compose.dev.yml build
```

2- Lancez les conteneurs Docker pour le développement  :

```bash
docker-compose -f .\docker-compose.dev.yml up
```

3- Pour arreter les conteneurs Docker `Ctrl + c` ou :

```bash
docker-compose -f .\docker-compose.dev.yml down
```

### 2.3 Production
<hr>

1- Construisez les conteneurs Docker pour la production  :

```bash
docker-compose build
```

2- Lancez les conteneurs Docker pour la production  :

```bash
docker-compose up
```

3- Pour arreter les conteneurs Docker `Ctrl + c` ou :

```bash
docker-compose down
```
<hr>

***NOTE IMPORTANTE :***

Si vous rencontrez l'erreur "exec /usr/src/app/entrypoint.sh: no such file or directory", même si le fichier existe, cela pourrait être dû à un changement involontaire du format de fin de ligne (EOL) vers CRLF plutôt que LF. Pour corriger cette erreur, assurez-vous que le format de fin de ligne dans votre projet est configuré correctement.

 Vous pouvez le vérifier dans Visual Studio Code (VSC) en suivant ces étapes :
 
1- Ouvrez les fichiers `entrypoint.sh` et `entrypoint.prod.sh` dans Visual Studio Code.

2- Dans le coin inférieur droit de la fenêtre, recherchez un indicateur indiquant le format de fin de ligne actuel `(CRLF ou LF)`.

3- Cliquez sur cet indicateur pour ouvrir une liste déroulante.

4- Sélectionnez l'option "LF" pour définir le format de fin de ligne sur `LF`.

En garantissant que les fichier entrypoint.sh et entrypoint.prod.sh utilisent le format de fin de ligne LF, vous devriez résoudre cette erreur spécifique lors du déploiement des conteneurs.
<hr>
