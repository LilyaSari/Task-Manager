import React, { useContext, useState } from "react";
import "./SignUpPage.css";
import AuthContext from "../context/AuthContext";
import { showErrorAlert } from "../utils/ToastifyAlert";

// Page d'inscription
const SignUpPage = () => {
    // État local pour le numéro de téléphone
    const [phone, setPhone] = useState("");
    const [isValidPhone, setIsValidPhone] = useState(true);

    // Utilisation du contexte d'authentification
    const { registerUser } = useContext(AuthContext);

    // État local pour la confirmation du mot de passe
    const [confirmPassword, setConfirmPassword] = useState("");

    // Gestion de la soumission du formulaire d'inscription
    const handleRegister = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Ajout du champ de confirmation du mot de passe
        const confirmPasswordValue = e.target.confirmPassword.value;

        // Vérification que le mot de passe et sa confirmation sont identiques
        if (password !== confirmPasswordValue) {
            // Affichage d'un message d'erreur si les mots de passe ne correspondent pas
            showErrorAlert("Les mots de passe ne correspondent pas");
            return;
        }

        const phone = e.target.phone.value;
        const address = e.target.address.value;
        registerUser(username, email, password, phone, address);
    };
    const handlePhoneChange = (event) => {
        const value = event.target.value;
        setPhone(value);

        // Expression régulière pour valider un numéro de téléphone ou vide (champ facultatif)
        const phoneRegex = /^$|^\+?[0-9]{10,14}$/;

        // Vérifier si le numéro de téléphone correspond à la regex
        setIsValidPhone(phoneRegex.test(value));
    };
    return (
        <form className="signup-form" onSubmit={handleRegister}>
            <h3>Inscription</h3>
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
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Entrez l'email"
                    name="email"
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
            {/* Champ pour confirmer le mot de passe */}
            <div className="form-group">
                <label>Confirmez le mot de passe</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmez le mot de passe"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Téléphone</label>
                <input
                    type="tel"
                    className={`form-control ${
                        isValidPhone ? "" : "is-invalid"
                    }`}
                    placeholder="Entrez le numéro de téléphone"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                />
                {!isValidPhone && (
                    <div className="invalid-feedback">
                        Veuillez entrer un numéro de téléphone valide.
                    </div>
                )}
            </div>
            <div className="form-group">
                <label>Adresse</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez l'adresse"
                    name="address"
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

export default SignUpPage;
