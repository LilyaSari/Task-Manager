import React, { useContext } from "react";
import "./SignInPage.css";
import AuthContext from "../context/AuthContext";

// Page de connexion
const SignInPage = () => {
    // Utilisation du contexte d'authentification
    const { loginUser } = useContext(AuthContext);

    // Gestion de la soumission du formulaire de connexion
    const handleLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        loginUser(username, password);
    };

    return (
        <form onSubmit={handleLogin} className="signin-form">
            <h3>Connexion</h3>

            <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez le nom d'utilisateur"
                    name="username"
                    required
                />
            </div>
            <div className="form-group">
                <label>Mot de passe</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Entrez le mot de passe"
                    name="password"
                    required
                />
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                    Soumettre
                </button>
            </div>
        </form>
    );
};

export default SignInPage;
