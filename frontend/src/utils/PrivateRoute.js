import { Navigate } from "react-router-dom";
import { showErrorAlert } from "./ToastifyAlert";
import React, { useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

// Composant pour la gestion des routes privées
const PrivateRoute = ({ children }) => {
    // Récupération de l'utilisateur depuis le contexte d'authentification
    let { user } = useContext(AuthContext);

    // Effet secondaire pour vérifier si l'utilisateur est connecté
    useEffect(() => {
        // Si l'utilisateur n'est pas connecté, afficher une alerte d'erreur
        if (!user) {
            showErrorAlert(
                "Vous devez être connecté pour accéder à cette page"
            );
        }
    }, [user]);

    // Si l'utilisateur est connecté, afficher le contenu de la route privée, sinon rediriger vers la page de connexion
    return user ? <>{children}</> : <Navigate to="/signin" />;
};

// Exportation du composant PrivateRoute
export default PrivateRoute;
