import { useEffect, useState, useContext, ChangeEvent } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

interface MilestoneDTO {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    isCompleted: boolean;
    projectId: string;
    projectTitle: string;
    createdByName: string | null;
}

const MilestonesPage = () => {
    const { token, user } = useContext(AuthContext);
    const [milestones, setMilestones] = useState<MilestoneDTO[]>([]);
    const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: "" });

    // Fetch projects for dropdown
    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data);
            if (res.data.length) setSelectedProject(res.data[0].id);
        } catch (err) {
            console.error(err);
            alert("Failed to load projects");
        }
    };

    // Fetch milestones for selected project
    const fetchMilestones = async (projectId: string) => {
        if (!projectId) return;
        try {
            const res = await API.get(`/projects/${projectId}/milestones`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMilestones(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load milestones");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) fetchMilestones(selectedProject);
    }, [selectedProject]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return alert("Select a project");

        try {
            await API.post(
                `/projects/${selectedProject}/milestones`,
                newMilestone,
                {
                     headers: { Authorization: `Bearer ${token}` },
                     params: { username: user.sub },
                }
            );
            setNewMilestone({ title: "", dueDate: "" });
            fetchMilestones(selectedProject);
        } catch (err) {
            console.error(err);
            alert("Failed to add milestone");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this milestone?")) return;
        try {
            await API.delete(`/milestones/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMilestones(selectedProject);
        } catch (err) {
            console.error(err);
            alert("Failed to delete milestone");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Milestones</h2>

            {/* Project Selection */}
            <div className="mb-4 d-flex align-items-center gap-3">
                <label htmlFor="projectSelect" className="fw-semibold mb-0">Project:</label>
                <select
                    id="projectSelect"
                    className="form-select w-auto"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                >
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.title || "Untitled Project"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Add Milestone Form */}
            <form onSubmit={handleAdd} className="mb-4 p-3 border rounded shadow-sm bg-light">
                <div className="row g-3 align-items-center">

                    {/* Milestone Title */}
                    <div className="col-md-6 d-flex align-items-center">
                        <label htmlFor="milestoneTitle" className="form-label me-2 mb-0" style={{ minWidth: "80px" }}>
                            Title:
                        </label>
                        <input
                            type="text"
                            id="milestoneTitle"
                            className="form-control"
                            placeholder="Milestone title"
                            value={newMilestone.title}
                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Milestone Due Date */}
                    <div className="col-md-4 d-flex align-items-center">
                        <label htmlFor="milestoneDueDate" className="form-label me-2 mb-0" style={{ minWidth: "80px" }}>
                            Due Date:
                        </label>
                        <input
                            type="date"
                            id="milestoneDueDate"
                            className="form-control"
                            value={newMilestone.dueDate}
                            onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                            required
                        />
                    </div>

                    {/* Add Button */}
                    <div className="col-md-2 d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary w-100">
                            Add
                        </button>
                    </div>

                </div>
            </form>

            {/* Milestones Table */}
            <table className="table table-bordered table-hover">
                <thead className="table-light">
                <tr>
                    <th>Project</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Completed</th>
                    <th>Created By</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {milestones.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center text-muted">
                            No milestones found for this project.
                        </td>
                    </tr>
                ) : (
                    milestones.map((m) => (
                        <tr key={m.id}>
                            <td>{m.projectTitle || "—"}</td>
                            <td>{m.title}</td>
                            <td>{m.dueDate}</td>
                            <td>{m.isCompleted ? "✅" : "❌"}</td>
                            <td>{m.createdByName || "-"}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(m.id)}
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
    );
};

export default MilestonesPage;
