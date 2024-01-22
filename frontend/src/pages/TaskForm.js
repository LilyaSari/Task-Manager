import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { showSuccessAlert } from "../utils/ToastifyAlert";

// Composant de formulaire pour la création de tâches
const TaskForm = () => {
    // Utilisation du contexte d'authentification
    const { user } = useContext(AuthContext);

    // Initialisation des instances nécessaires
    const api = useAxios();
    const navigate = useNavigate();

    // State pour stocker la liste des utilisateurs (uniquement pour les administrateurs)
    const [listUsers, setListUsers] = useState([]);

    // Fonction pour récupérer la liste des utilisateurs depuis l'API
    const getUsers = async () => {
        try {
            const response = await api.get("/users");
            if (response.status === 200) setListUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Effet secondaire pour récupérer la liste des utilisateurs (uniquement pour les administrateurs)
    useEffect(() => {
        if (user.role === "admin") getUsers();
    }, []);

    // State pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "LOW",
        status: "TODO",
        user: user.id,
    });

    // Fonction pour mettre à jour le state lorsque les champs du formulaire changent
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Appel à l'API pour créer une nouvelle tâche
        const postTask = await api.post("/tasks", formData);

        // Vérification de la réponse de l'API
        if (postTask.status === 201) {
            showSuccessAlert("Tache créée avec succès");
            navigate("/");
        } else {
            showSuccessAlert("Erreur lors de la création de la tâche");
        }
    };

    // Rendu du composant
    return (
        <div
            className="container mt-4 p-4 rounded border"
            style={{ backgroundColor: "#f8f9fa" }}
        >
            <h2>Create a New Task</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                {/* Champ de titre */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                            Titre
                        </span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Champ de description */}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                            Description
                        </span>
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                {/* Champ de priorité */}
                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">
                        <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                            Priority
                        </span>
                    </label>
                    <select
                        className="form-select"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="LOW">FAIBLE</option>
                        <option value="MEDIUM">MOYEN</option>
                        <option value="HIGH">ÉLEVÉ</option>
                        <option value="URGENT">URGENT</option>
                    </select>
                </div>
                {/* Champ d'utilisateur (uniquement pour les administrateurs) */}
                {user.role === "admin" && (
                    <div className="mb-3">
                        <label htmlFor="user" className="form-label">
                            <span
                                style={{ fontWeight: "bold", fontSize: "17px" }}
                            >
                                Utilisateur
                            </span>
                        </label>
                        <select
                            className="form-select"
                            id="user"
                            name="user"
                            value={formData.user}
                            onChange={handleChange}
                            required
                        >
                            <option value={null} disabled>
                                Selectionnez un utilisateur
                            </option>
                            {/* Mapping des utilisateurs pour les options du sélecteur */}
                            {listUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Bouton de soumission du formulaire */}
                <button type="submit" className="btn btn-primary">
                    Soumettre
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
