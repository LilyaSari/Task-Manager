import React, { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faPlus,
    faPen,
    faTrashCan,
    faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccessAlert } from "../utils/ToastifyAlert";

// Page d'accueil de l'application
const HomePage = () => {
    // États pour stocker la liste des tâches, le navigateur et l'instance Axios
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const api = useAxios();

    // Effet pour charger les tâches initiales
    useEffect(() => {
        getTasks();
        return () => {
            setTasks([]);
        };
    }, []);

    // Fonction pour récupérer les tâches depuis l'API
    const getTasks = async () => {
        try {
            const response = await api.get("/tasks");
            if (response.status === 200) setTasks(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des tâches :", error);
        }
    };

    // Fonction pour supprimer une tâche
    const deleteTask = (id) => async () => {
        try {
            const response = await api.delete(`/tasks/${id}`);
            if (response.status === 200) {
                showSuccessAlert("Tâche supprimée avec succès");
                getTasks();
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche :", error);
        }
    };

    // Fonction pour obtenir la couleur de priorité en fonction du niveau de priorité
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case "urgent":
                return "danger";
            case "high":
                return "warning";
            case "medium":
                return "info";
            case "low":
                return "success";
            default:
                return "dark";
        }
    };

    // Fonction pour naviguer vers le formulaire d'ajout de tâche
    const navigateToTaskForm = () => {
        navigate("/add-task");
    };

    // Fonction pour naviguer vers la page de détails de la tâche
    const navigateToTaskItem = (id) => () => {
        navigate(`/tasks/${id}`);
    };

    // Fonction pour formater une date en utilisant les options spécifiées
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        return new Date(dateString).toLocaleDateString("fr-FR", options);
    };

    // Fonction pour filtrer les tâches en fonction de leur statut
    const filterTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    return (
        <Container fluid style={{ width: "70%" }}>
            <Row className="mt-4">
                <div>
                    <div className="d-flex justify-content-between">
                        <h1 className="text-center">Gestionnaire de tâches</h1>

                        <Button variant="primary" onClick={navigateToTaskForm}>
                            <FontAwesomeIcon icon={faPlus} /> Ajouter une tâche
                        </Button>
                    </div>
                </div>
            </Row>
            <hr />
            <Row xs={1} sm={2} md={3} lg={3} xl={3} className="g-4">
                <Col>
                    <h3 className="text-center">À FAIRE</h3>
                    {filterTasksByStatus("TODO").length > 0 ? (
                        filterTasksByStatus("TODO").map((task) => (
                            <Card
                                className={`m-2 border-${getPriorityColor(
                                    task.priority
                                )} border-3`}
                                key={task.id}
                            >
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>{task.title}</Card.Title>

                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                className="me-2"
                                                onClick={navigateToTaskItem(
                                                    task.id
                                                )}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                onClick={deleteTask(task.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="me-2"
                                        />
                                        {task.user}
                                    </div>

                                    <Card.Text className="mt-2 p-2 border">
                                        {task.description}
                                    </Card.Text>

                                    <Card.Text>
                                        <small>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faCalendarPlus}
                                                        className="me-2 ms-3 text-muted"
                                                    />
                                                    {formatDate(
                                                        task.created_date
                                                    )}
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                        className="me-2 ms-3 text-muted"
                                                    />
                                                    {formatDate(
                                                        task.updated_date
                                                    )}{" "}
                                                    Par{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                        }}
                                                    >
                                                        {task.last_updated_by}
                                                    </span>
                                                </div>
                                            </div>
                                        </small>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center">
                            Aucune tâche à afficher dans cette catégorie
                        </div>
                    )}
                </Col>
                <Col>
                    <h3 className="text-center">EN COURS</h3>
                    {filterTasksByStatus("IN_PROGRESS").length > 0 ? (
                        filterTasksByStatus("IN_PROGRESS").map((task) => (
                            <Card
                                className={`m-2 border-${getPriorityColor(
                                    task.priority
                                )} border-3`}
                                key={task.id}
                            >
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>{task.title}</Card.Title>

                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                className="me-2"
                                                onClick={navigateToTaskItem(
                                                    task.id
                                                )}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                onClick={deleteTask(task.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="me-2"
                                        />
                                        {task.user}
                                    </div>

                                    <Card.Text className="mt-2 p-2 border">
                                        {task.description}
                                    </Card.Text>

                                    <Card.Text>
                                        <small>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faCalendarPlus}
                                                        className="me-2 ms-3 text-muted"
                                                    />
                                                    {formatDate(
                                                        task.created_date
                                                    )}
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                        className="me-2 ms-3 text-muted"
                                                    />
                                                    {formatDate(
                                                        task.updated_date
                                                    )}{" "}
                                                    Par{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                        }}
                                                    >
                                                        {task.last_updated_by}
                                                    </span>
                                                </div>
                                            </div>
                                        </small>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center">
                            Aucune tâche à afficher dans cette catégorie
                        </div>
                    )}
                </Col>
                <Col>
                    <h3 className="text-center">TERMINÉES</h3>
                    {filterTasksByStatus("DONE").length > 0 ? (
                        filterTasksByStatus("DONE").map((task) => (
                            <Card
                                className={`m-2 border-${getPriorityColor(
                                    task.priority
                                )} border-3`}
                                key={task.id}
                            >
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>{task.title}</Card.Title>

                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                className="me-2"
                                                onClick={navigateToTaskItem(
                                                    task.id
                                                )}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                onClick={deleteTask(task.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="me-2"
                                        />
                                        {task.user}
                                    </div>

                                    <Card.Text className="mt-2 p-2 border">
                                        {task.description}
                                    </Card.Text>

                                    <Card.Text>
                                        <small>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faCalendarPlus}
                                                        className="me-2 ms-3 text-muted"
                                                    />
                                                    {formatDate(
                                                        task.created_date
                                                    )}
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                        className="me-2 ms-3 text-muted"
                                                    />
                                                    {formatDate(
                                                        task.updated_date
                                                    )}{" "}
                                                    Par{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                        }}
                                                    >
                                                        {task.last_updated_by}
                                                    </span>
                                                </div>
                                            </div>
                                        </small>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center">
                            Aucune tâche à afficher dans cette catégorie
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
