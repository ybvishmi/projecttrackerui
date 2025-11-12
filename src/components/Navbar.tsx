import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <NavLink className="navbar-brand fw-bold" to="/">
                    Research Tracker
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {user && (
                            <>
                                <li className="nav-item mx-2">
                                    <NavLink className="nav-link" to="/projects">
                                        Projects
                                    </NavLink>
                                </li>
                                <li className="nav-item mx-2">
                                    <NavLink className="nav-link" to="/milestones">
                                        Milestones
                                    </NavLink>
                                </li>
                                <li className="nav-item mx-2">
                                    <NavLink className="nav-link" to="/documents">
                                        Documents
                                    </NavLink>
                                </li>
                                {user.role === "ADMIN" && (
                                    <li className="nav-item mx-2">
                                        <NavLink className="nav-link" to="/admin">
                                            Admin
                                        </NavLink>
                                    </li>
                                )}
                                <li className="nav-item mx-2">
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}

                        {!user && (
                            <>
                                <li className="nav-item mx-2">
                                    <NavLink className="nav-link" to="/login">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item mx-2">
                                    <NavLink className="nav-link" to="/register">
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
