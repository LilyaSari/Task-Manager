import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// URL de base de l'API
const baseURL = `${process.env.REACT_APP_API_URL}`;

// Hook personnalisé pour gérer les requêtes Axios avec les jetons d'authentification
const useAxios = () => {
    // Récupération des informations d'authentification depuis le contexte
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    // Création d'une instance Axios avec la configuration de base
    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        headers: {
            Authorization: authTokens ? `Bearer ${authTokens?.access}` : null,
            "Content-Type": "application/json",
            accept: "application/json",
        },
    });

    // Interception des requêtes pour gérer le rafraîchissement du jeton d'authentification
    axiosInstance.interceptors.request.use(async (req) => {
        // Décodage du jeton d'accès pour obtenir les informations de l'utilisateur
        const user = jwtDecode(authTokens.access);
        // Vérification de l'expiration du jeton d'accès
        const isExpired = dayjs.unix(user.exp).isBefore(dayjs());
        if (!isExpired) return req;

        // Rafraîchissement du jeton d'accès
        const response = await axios.post(`${baseURL}/token/refresh`, {
            refresh: authTokens.refresh,
        });

        // Mise à jour des jetons d'authentification dans le contexte
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        let payload = {
            username: response.data.user.username,
            email: response.data.user.email,
            role: response.data.user.role,
            phone: response.data.user.phone,
            address: response.data.user.address,
            id: response.data.user.id,
        };
        let tokens = {
            access: response.data.access,
            refresh: response.data.refresh,
        };
        setAuthTokens(tokens);
        setUser(payload);

        // Mise à jour du jeton d'authentification dans l'en-tête de la requête
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    });

    // Retour de l'instance Axios configurée
    return axiosInstance;
};

// Exportation du hook useAxios
export default useAxios;
