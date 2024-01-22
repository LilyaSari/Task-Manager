import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

// URL de base de l'API
const baseURL = `${process.env.REACT_APP_API_URL}`;

// Récupération des jetons d'authentification depuis le stockage local
let authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

// Création d'une instance d'Axios avec des configurations de base
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        // Ajout du jeton d'accès à l'en-tête d'autorisation s'il existe
        Authorization: authTokens ? `Bearer ${authTokens?.access}` : null,
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

// Intercepteur de requête pour gérer les jetons d'authentification
axiosInstance.interceptors.request.use(async (req) => {
    // Vérification de l'existence des jetons
    if (!authTokens) {
        // Récupération des jetons depuis le stockage local
        authTokens = localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null;

        // Ajout du jeton d'accès à l'en-tête d'autorisation
        req.headers.Authorization = `Bearer ${authTokens?.access}`;
    }

    // Décodage du jeton d'accès pour obtenir les informations de l'utilisateur
    const user = jwtDecode(authTokens.access);

    // Vérification de l'expiration du jeton d'accès
    const isExpired = dayjs.unix(user.exp).isBefore(dayjs());

    // Si le jeton n'est pas expiré, la requête est renvoyée telle quelle
    if (!isExpired) return req;

    // Si le jeton est expiré, une requête de rafraîchissement est effectuée
    const response = await axios.post(`${baseURL}/refresh`, {
        refresh: authTokens.refresh,
    });

    // Mise à jour des jetons dans le stockage local
    localStorage.setItem("authTokens", JSON.stringify(response.data));

    // Mise à jour du jeton d'accès dans l'en-tête d'autorisation
    req.headers.Authorization = `Bearer ${response.data.access}`;

    // Renvoi de la requête mise à jour
    return req;
});

// Exportation de l'instance d'Axios configurée
export default axiosInstance;
