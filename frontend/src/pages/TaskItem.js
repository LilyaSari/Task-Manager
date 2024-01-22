import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { showErrorAlert, showSuccessAlert } from "../utils/ToastifyAlert";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Composant pour afficher et mettre à jour les détails d'une tâche
const TaskItem = () => {
    // Utilisation du contexte d'authentification
    const { user } = useContext(AuthContext);

    // Récupération de l'ID de la tâche depuis les paramètres d'URL
    const { taskId } = useParams();

    // Initialisation des instances nécessaires
    const navigate = useNavigate();
    const api = useAxios();

    // State pour stocker les détails de la tâche
    const [task, setTask] = useState(null);

    // State pour stocker la liste des utilisateurs (uniquement pour les administrateurs)
    const [listUsers, setListUsers] = useState([]);

    // State pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "",
        status: "",
        user: null,
    });

    // Effet secondaire pour récupérer les détails de la tâche et la liste des utilisateurs
    useEffect(() => {
        getTask();
        if (user.role === "admin") getUsers();
    }, []);

    // Fonction pour récupérer les détails de la tâche depuis l'API
    const getTask = async () => {
        try {
            const response = await api.get(`/tasks/${taskId}`);
            setFormData({
                title: response.data.title,
                description: response.data.description,
                priority: response.data.priority,
                status: response.data.status,
                user: response.data.user,
            });
            setTask(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fonction pour récupérer la liste des utilisateurs depuis l'API
    const getUsers = async () => {
        try {
            const response = await api.get("/users");
            if (response.status === 200) setListUsers(response.data);
        } catch (error) {
            showErrorAlert("Erreur lors de la récupération des utilisateurs");
        }
    };

    // Fonction pour mettre à jour le state lorsqu'un champ du formulaire change
    const handleChange = (e) => {
        const { name, value } = e.target;
        const processedValue = name === "user" ? parseInt(value, 10) : value;
        setFormData((prevData) => ({ ...prevData, [name]: processedValue }));
    };

    // Fonction pour gérer la soumission du formulaire de mise à jour de la tâche
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Appel à l'API pour mettre à jour les détails de la tâche
        const patchTask = await api.patch(`/tasks/${taskId}`, formData);

        // Vérification de la réponse de l'API
        if (patchTask.status === 200) {
            showSuccessAlert("Tache mise à jour avec succès");
            navigate("/");
        } else {
            showErrorAlert("Erreur lors de la mise à jour de la tâche");
        }
    };

    // Affichage d'un message de chargement si les détails de la tâche ne sont pas encore chargés
    if (!task) {
        return <p>Chargement...</p>;
    }

    // Rendu du composant
    return (
        <div
            className="container mt-4 p-4 rounded border"
            style={{ backgroundColor: "#f8f9fa" }}
        >
            <h2>Mettre a jour la tache :</h2>
            <hr />
            <form onSubmit={handleUpdate}>
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
                            Déscription
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
                            Priorité
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
                {/* Champ de statut */}
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                        <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                            Status
                        </span>
                    </label>
                    <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="TODO">À FAIRE</option>
                        <option value="IN_PROGRESS">EN COURS</option>
                        <option value="DONE">TERMINÉES</option>
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

export default TaskItem;
