import React, { useContext } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";

// Composant pour l'en-tête de l'application
const Header = () => {
    // On récupère les informations de l'utilisateur et la fonction de déconnexion depuis le contexte
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                {/* Marque de la barre de navigation qui renvoie à la page d'accueil */}
                <Navbar.Brand href="/">Task Manager</Navbar.Brand>

                {/* Section pour l'affichage de l'utilisateur connecté ou des liens de connexion */}
                <div className="justify-content-end">
                    {/* Si un utilisateur est connecté */}
                    {user ? (
                        <>
                            {/* Container pour les informations de l'utilisateur et le bouton de déconnexion */}
                            <Nav className="me-auto" id="logout-container">
                                {/* Affiche le nom de l'utilisateur connecté avec un lien vers son profil */}
                                <Navbar.Text style={{ marginRight: "15px" }}>
                                    Signed in as:{" "}
                                    <a href="/">{user.username}</a>
                                </Navbar.Text>

                                {/* Bouton pour déconnecter l'utilisateur */}
                                <Button variant="danger" onClick={logoutUser}>
                                    Logout
                                </Button>
                            </Nav>
                        </>
                    ) : (
                        // Si aucun utilisateur n'est connecté, affiche les liens de connexion
                        <Nav className="me-auto">
                            <Nav.Link href="signin">Sign In</Nav.Link>
                            <Nav.Link href="signup">Sign Up</Nav.Link>
                        </Nav>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;
