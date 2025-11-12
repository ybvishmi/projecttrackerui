import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

interface Project {
    id: string;
    title: string | null;
    summary: string | null;
    startDate: string | null;
    endDate: string | null;
}

const ProjectsPage = () => {
    const { token } = useContext(AuthContext);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState({
        title: "",
        summary: "",
        startDate: "",
        endDate: "",
    });

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load projects");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post("/projects", newProject, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewProject({ title: "", summary: "", startDate: "", endDate: "" });
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert("Project creation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await API.delete(`/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert("Failed to delete project");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Projects</h2>

            {/* Add Project Form */}
            <form
                onSubmit={handleCreate}
                className="mb-5 p-4 border rounded shadow-sm bg-light"
            >
                <div className="row g-3 align-items-end">

                    {/* Title */}
                    <div className="col-md-3">
                        <label htmlFor="projectTitle" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            id="projectTitle"
                            className="form-control"
                            placeholder="Project title"
                            value={newProject.title}
                            onChange={(e) =>
                                setNewProject({ ...newProject, title: e.target.value })
                            }
                            required
                        />
                    </div>

                    {/* Summary */}
                    <div className="col-md-3">
                        <label htmlFor="projectSummary" className="form-label">
                            Summary
                        </label>
                        <input
                            type="text"
                            id="projectSummary"
                            className="form-control"
                            placeholder="Summary"
                            value={newProject.summary}
                            onChange={(e) =>
                                setNewProject({ ...newProject, summary: e.target.value })
                            }
                        />
                    </div>

                    {/* Start Date */}
                    <div className="col-md-2">
                        <label htmlFor="projectStartDate" className="form-label">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="projectStartDate"
                            className="form-control"
                            value={newProject.startDate}
                            onChange={(e) =>
                                setNewProject({ ...newProject, startDate: e.target.value })
                            }
                        />
                    </div>

                    {/* End Date */}
                    <div className="col-md-2">
                        <label htmlFor="projectEndDate" className="form-label">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="projectEndDate"
                            className="form-control"
                            value={newProject.endDate}
                            onChange={(e) =>
                                setNewProject({ ...newProject, endDate: e.target.value })
                            }
                        />
                    </div>

                    {/* Add Button */}
                    <div className="col-md-2 d-grid">
                        <button type="submit" className="btn btn-primary">
                            Add Project
                        </button>
                    </div>
                </div>
            </form>

            {/* Project List */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">
                                No projects available.
                            </td>
                        </tr>
                    ) : (
                        projects.map((p) => (
                            <tr key={p.id}>
                                <td>{p.title || "Untitled Project"}</td>
                                <td>{p.summary || "—"}</td>
                                <td>{p.startDate || "—"}</td>
                                <td>{p.endDate || "—"}</td>
                                <td>
                                    <Link
                                        to={`/projects/${p.id}`}
                                        className="btn btn-sm btn-info me-2"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsPage;
