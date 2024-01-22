import { createContext, useEffect, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../utils/ToastifyAlert";
import { useNavigate } from "react-router-dom";

// Création d'un contexte pour gérer l'authentification
const AuthContext = createContext();
const baseUrl = `${process.env.REACT_APP_API_URL}`;

export default AuthContext;

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
    // localStorage pour stocker les informations de l'utilisateur et les jetons d'authentification
    let [user, setUser] = useState(() =>
        localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))
            : null
    );
    let [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    // localStorage pour gérer le chargement initial
    let [loading, setLoading] = useState(true);

    // Hook de navigation pour rediriger l'utilisateur après certaines actions
    let navigate = useNavigate();

    // Fonction pour connecter l'utilisateur
    let loginUser = async (username, password) => {
        let response = await fetch(baseUrl + "/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        let data = await response.json();
        if (response.status === 200) {
            let tokens = {
                access: data.access,
                refresh: data.refresh,
            };
            showSuccessAlert("Connexion réussie");
            setAuthTokens(tokens);
            let payload = {
                username: data.username,
                email: data.email,
                role: data.role,
                phone: data.phone,
                address: data.address,
                id: data.id,
            };
            setUser(payload);
            localStorage.setItem("user", JSON.stringify(payload));
            localStorage.setItem("authTokens", JSON.stringify(tokens));
            navigate("/");
        } else if (response.status === 400) {
            showErrorAlert("Nom d'utilisateur ou mot de passe incorrect");
        } else {
            showErrorAlert("Échec de la connexion");
        }
    };

    // Fonction pour enregistrer un nouvel utilisateur
    let registerUser = async (username, email, password, phone, address) => {
        let response = await fetch(baseUrl + "/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                phone: phone,
                address: address,
            }),
        });
        let body = await response.json();
        if (response.status === 201) {
            showSuccessAlert("Inscription réussie");
            navigate("/signin");
        } else if (response.status === 400) {
            if (body.error && body.error.username) {
                showErrorAlert("Ce nom d'utilisateur existe déjà.");
            } else if (body.error && body.error.email) {
                showErrorAlert("Cette adresse e-mail existe déjà.");
            } else if (body.error && body.error.password2) {
                showErrorAlert("Ce mot de passe est trop courant.");
            } else {
                showErrorAlert("Échec de l'inscription");
            }
        } else {
            showErrorAlert("Échec de l'inscription");
        }
    };

    // Fonction pour déconnecter l'utilisateur
    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("user");
        showSuccessAlert("Déconnexion réussie");
        navigate("/signin");
    };

    // Données du contexte d'authentification
    let contextData = {
        authTokens: authTokens,
        setAuthTokens: setAuthTokens,
        setUser: setUser,
        user: user,
        loginUser: loginUser,
        registerUser: registerUser,
        logoutUser: logoutUser,
    };

    // Effet pour mettre à jour l'état local lorsqu'il y a des changements dans les jetons d'authentification
    useEffect(() => {
        if (authTokens) {
            setUser(JSON.parse(localStorage.getItem("user")));
        }
        setLoading(false);
    }, [authTokens, loading]);

    // Fournit le contexte aux composants enfants
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
