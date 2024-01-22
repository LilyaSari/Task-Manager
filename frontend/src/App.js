import "./App.css";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import TaskForm from "./pages/TaskForm";
import TaskItem from "./pages/TaskItem";
function App() {
    return (
        <>
            <Router>
                <AuthProvider>
                    <Header />
                    <div className="App">
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <HomePage />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/signin" element={<SignInPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/add-task" element={<TaskForm />} />
                            <Route
                                path="/tasks/:taskId"
                                element={<TaskItem />}
                            />
                        </Routes>
                    </div>
                </AuthProvider>
            </Router>
        </>
    );
}

export default App;
