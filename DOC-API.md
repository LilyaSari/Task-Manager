
# Documentation API 
## Utilisateurs
### 1. Connexion Utilisateur

**URL:** `/api/signin`

**Méthode HTTP:** `POST`

**Permissions:** Tout le monde

**Description:** Connecte un utilisateur et renvoie un jeton d'accès ainsi que des informations sur l'utilisateur connecté.

**Body de la requête:**

| Key | Value Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Requis**. Nom d'utilisateur de l'utilisateur. |
| `password` | `string` | **Requis**. Mot de passe de l'utilisateur. |

**Réponse:**

`STATUS_CODE_200` : Message de succès si la connection est réussie.

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `access` | `string` | Jeton d'accès pour les requêtes futures. |
| `refresh` | `string` | Jeton de rafraîchissement pour obtenir un nouveau jeton d'accès. |
| `username` | `string` | Nom d'utilisateur de l'utilisateur. |
| `email` | `string` | Adresse e-mail de l'utilisateur. |
| `phone` | `string` | Numéro de téléphone de l'utilisateur. |
| `address` | `string` | Adresse de l'utilisateur. |
| `role` | `string` | Rôle de l'utilisateur. |
| `id` | `Integer` | Identifiant de l'utilisateur. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `401` | `Unauthorized` | Identifiants de connexion invalides. |


### 2. Rafraîchissement du Token

**URL:** `/api/refresh`

**Méthode HTTP:** `POST`

**Permissions:** Tout le monde

**Description:** Rafraîchit le jeton d'accès en utilisant le jeton de rafraîchissement.

**Body de la requête:**

| Key | Value Type     | Description                |
| :-------- | :------- | :------------------------- |
| `refresh` | `string` | **Requis**. Jeton de rafraîchissement. |

**Réponse:**

`STATUS_CODE_200` : Message de succès si le rafraîchissement est réussie.

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `access` | `string` | Nouveau jeton d'accès. |
| `refresh` | `string` | Nouveau jeton de rafraîchissement.|
| `username` | `string` | Nom d'utilisateur de l'utilisateur. |
| `email` | `string` | Adresse e-mail de l'utilisateur. |
| `phone` | `string` | Numéro de téléphone de l'utilisateur. |
| `address` | `string` | Adresse de l'utilisateur. |
| `role` | `string` | Rôle de l'utilisateur. |
| `id` | `Integer` | Identifiant de l'utilisateur. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `400` | `Bad Request` | Le jeton de rafraîchissement est requis. |
| `400` | `Bad Request` | Erreur lors du rafraîchissement du jeton. |

### 3. Inscription Utilisateur

**URL:** `/api/signup`

**Méthode HTTP:** `POST`

**Permissions:** Tout le monde

**Description:** Crée un nouvel utilisateur (**simple-user** par defaut) et renvoie un jeton d'accès.

**Body de la requête:**

| Key | Value Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Requis**. Nom d'utilisateur de l'utilisateur. |
| `password` | `string` | **Requis**. Mot de passe de l'utilisateur. |
| `email` | `string` | Adresse e-mail de l'utilisateur. |
| `phone` | `string` | Numéro de téléphone de l'utilisateur. |
| `address` | `string` | Adresse de l'utilisateur. |

**Réponse:**

`STATUS_CODE_201` : Message de succès si l'enregistrement est réussie.

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `access` | `string` | Jeton d'accès pour les requêtes futures. |
| `refresh` | `string` | Jeton de rafraîchissement pour obtenir un nouveau jeton d'accès. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `400` | `Bad Request` | Données invalides. (Liste d'erreurs générée par l'exception Django Form.) |

### 4. Liste des Utilisateurs

**URL:** `/api/users`

**Méthode HTTP:** `GET`

**Permissions:** Administrateurs uniquement

**Description:** Récupère la liste de tous les utilisateurs.

**Réponse:**

`STATUS_CODE_200` : Message de succès si la récuperation est réussie.

Liste d'objets utilisateur, chaque objet contenant:

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | Nom d'utilisateur de l'utilisateur. |
| `email` | `string` | Adresse e-mail de l'utilisateur. |
| `phone` | `string` | Numéro de téléphone de l'utilisateur. |
| `address` | `string` | Adresse de l'utilisateur. |
| `role` | `string` | Rôle de l'utilisateur. |
| `id` | `Integer` | Identifiant de l'utilisateur. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `403` | `Forbidden` | Accès refusé si l'utilisateur n'est pas administrateur. |

## Tâches
### 1. Liste des Tâches

**URL:** `/api/tasks`

**Méthode HTTP:** `GET`

**Permissions:** Utilisateurs connectés (admins pour toutes les tâches, simples utilisateurs pour leurs tâches)

**Description:** Connecte un utilisateur et renvoie un jeton d'accès ainsi que des informations sur l'utilisateur connecté.

**Paramètres de la requête:** Filtres optionnels pour la recherche de la forme : 

`/api/tasks?key1=value1&key2=value2...etc`

Example : 

`/api/tasks?priority=LOW&status=TODO`


**Réponse:**

`STATUS_CODE_200` : Message de succès si la récuperation est réussie.

Liste d'objets taches, chaque objet contenant:

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `Integer` | Identifiant de la tâche. |
| `title` | `string` | Titre de la tâche. |
| `description` | `string` | Description de la tâche. |
| `priority` | `string` | Priorité de la tâche. |
| `status` | `string` | Statut de la tâche. |
| `user` | `string` |  Nom d'utilisateur de l'utilisateur assigné |
| `last_updated_by` | `string` | Nom d'utilisateur de l'utilisateur qui a modifié la tâche. |
| `created_date` | `date` | Date de création de la tâche. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `403` | `Forbidden` |  Accès refusé si l'utilisateur n'est pas connecté. |

### 2. Création d'une Tâche

**URL:** `/api/tasks`

**Méthode HTTP:** `POST`

**Permissions:** Utilisateurs connectés (admins pour toutes les tâches, simples utilisateurs pour leurs tâches)

**Description:** Crée une nouvelle tâche.

**Body de la requête:**

| Key | Value Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | Titre de la tâche. |
| `description` | `string` | Description de la tâche. |
| `priority` | `string` | Priorité de la tâche. |
| `status` | `string` | Statut de la tâche. |
| `user` | `Integer` | Identifiant de l'utilisateur assigné à la tâche. |


**Réponse:**

`STATUS_CODE_201` : Message de succès si la création est réussie.

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `Integer` | Identifiant de la tâche. |
| `title` | `string` | Titre de la tâche. |
| `description` | `string` | Description de la tâche. |
| `priority` | `string` | Priorité de la tâche. |
| `status` | `string` | Statut de la tâche. |
| `user` | `string` |  Nom d'utilisateur de l'utilisateur assigné |
| `last_updated_by` | `string` | Nom d'utilisateur de l'utilisateur qui a modifié la tâche. |
| `created_date` | `date` | Date de création de la tâche. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `400` | `Bad Request` | Données invalides. |
| `403` | `Forbidden` | Accès refusé si l'utilisateur n'est pas connecté. |

### 3. Détails d'une Tâche

**URL:** `/api/tasks/<id>`

**Méthode HTTP:** `GET`

**Permissions:** Utilisateurs connectés (admins pour toutes les tâches, simples utilisateurs pour leurs tâches)

**Description:** Récupère les détails d'une tâche spécifique.

**Paramètres de la requête:**

| Paramètre | Type |  Description                |
| :-------- | :------------------------- | :------------------------- | 
| `<id>` | `Integer` | Identifiant de la tâche |


**Réponse:**

`STATUS_CODE_200` : Message de succès si la récuperation est réussie.

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `Integer` | Identifiant de la tâche. |
| `title` | `string` | Titre de la tâche. |
| `description` | `string` | Description de la tâche. |
| `priority` | `string` | Priorité de la tâche. |
| `status` | `string` | Statut de la tâche. |
| `user` | `string` |  Nom d'utilisateur de l'utilisateur assigné |
| `last_updated_by` | `string` | Nom d'utilisateur de l'utilisateur qui a modifié la tâche. |
| `created_date` | `date` | Date de création de la tâche. |

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `404` | `Not Found` | Tâche non trouvée.|
| `403` | `Forbidden` | Accès refusé si l'utilisateur n'est pas connecté ou n'a pas les autorisations nécessaires. |

### 4. Modification d'une Tâche

**URL:** `/api/tasks/<id>`

**Méthode HTTP:** `PATCH`

**Permissions:** Utilisateurs connectés (admins pour toutes les tâches, simples utilisateurs pour leurs tâches)

**Description:** Modifie une tâche spécifique.

**Paramètres de la requête:**

| Paramètre | Type |  Description                |
| :-------- | :------------------------- | :------------------------- | 
| `<id>` | `Integer` | Identifiant de la tâche |

**Body de la requête:**

| Key | Value Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | Titre de la tâche. |
| `description` | `string` | Description de la tâche. |
| `priority` | `string` | Priorité de la tâche. |
| `status` | `string` | Statut de la tâche. |
| `user` | `Integer` | Identifiant de l'utilisateur assigné à la tâche. |

**Réponse:**

`STATUS_CODE_200` : Message de succès si la modification est réussie.

| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `Integer` | Identifiant de la tâche. |
| `title` | `string` | Titre de la tâche. |
| `description` | `string` | Description de la tâche. |
| `priority` | `string` | Priorité de la tâche. |
| `status` | `string` | Statut de la tâche. |
| `user` | `string` |  Nom d'utilisateur de l'utilisateur assigné |
| `last_updated_by` | `string` | Nom d'utilisateur de l'utilisateur qui a modifié la tâche. |
| `created_date` | `date` | Date de création de la tâche. |


**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `400` | `Bad Request` | Données invalides.|
| `404` | `Not Found` | Tâche non trouvée.|
| `403` | `Forbidden` | Accès refusé si l'utilisateur n'est pas connecté ou n'a pas les autorisations nécessaires. |

### 5. Suppression d'une Tâche

**URL:** `/api/tasks/<id>`

**Méthode HTTP:** `DELETE`

**Permissions:** Utilisateurs connectés (admins pour toutes les tâches, simples utilisateurs pour leurs tâches)

**Description:** Supprime une tâche spécifique.

**Paramètres de la requête:**

| Paramètre | Type |  Description                |
| :-------- | :------------------------- | :------------------------- | 
| `<id>` | `Integer` | Identifiant de la tâche |


**Réponse:**

`STATUS_CODE_200` : Message de succès si la suppression est réussie.

**Erreur:**

| Code | Status    | Description                |
| :-------- | :------- | :------------------------- |
| `404` | `Not Found` | Tâche non trouvée.|
| `403` | `Forbidden` | Accès refusé si l'utilisateur n'est pas connecté ou n'a pas les autorisations nécessaires. |