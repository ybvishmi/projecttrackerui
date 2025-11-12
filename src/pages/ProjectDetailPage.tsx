import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

interface Milestone {
    id: number;
    title: string;
    dueDate: string;
    completed: boolean;
}

interface Document {
    id: number;
    fileName: string;
    uploadDate: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

const ProjectDetailPage = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: "" });

    useEffect(() => {
        fetchProject();
        fetchMilestones();
        fetchDocuments();
    }, []);

    const fetchProject = async () => {
        try {
            const res = await API.get(`/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProject(res.data);
        } catch {
            alert("Failed to load project");
        }
    };

    const fetchMilestones = async () => {
        try {
            const res = await API.get(`/milestones/project/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMilestones(res.data);
        } catch {
            console.error("Failed to fetch milestones");
        }
    };

    const fetchDocuments = async () => {
        try {
            const res = await API.get(`/documents/project/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDocuments(res.data);
        } catch {
            console.error("Failed to fetch documents");
        }
    };

    const handleAddMilestone = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post(
                "/milestones",
                { ...newMilestone, projectId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMilestone({ title: "", dueDate: "" });
            fetchMilestones();
        } catch {
            alert("Failed to add milestone");
        }
    };

    if (!project) return <div className="container mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p>
                <strong>Start:</strong> {project.startDate} | <strong>End:</strong>{" "}
                {project.endDate}
            </p>

            <hr />

            <h4>Milestones</h4>
            <form onSubmit={handleAddMilestone} className="mb-3">
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Milestone title"
                            value={newMilestone.title}
                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            value={newMilestone.dueDate}
                            onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">
                            Add
                        </button>
                    </div>
                </div>
            </form>

            <ul className="list-group mb-4">
                {milestones.map((m) => (
                    <li
                        key={m.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        {m.title} — <small>{m.dueDate}</small>
                    </li>
                ))}
            </ul>

            <h4>Documents</h4>
            <ul className="list-group">
                {documents.map((d) => (
                    <li key={d.id} className="list-group-item">
                        📄 {d.fileName} <small>({d.uploadDate})</small>
                    </li>
                ))}
            </ul>

            <Link to="/projects" className="btn btn-secondary mt-4">
                ← Back to Projects
            </Link>
        </div>
    );
};

export default ProjectDetailPage;
