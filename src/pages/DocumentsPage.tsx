import { useEffect, useState, useContext, ChangeEvent } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

interface DocumentDTO {
    id: string;
    title: string;
    urlOrPath: string;
    projectId: string;
    projectTitle: string;
    uploadedByName: string | null;
    uploadedAt: string;
}

interface Project {
    id: string;
    title: string;
}

const DocumentsPage = () => {
    const { token, user } = useContext(AuthContext);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [documents, setDocuments] = useState<DocumentDTO[]>([]);
    const [newDoc, setNewDoc] = useState({ title: "", file: null as File | null });

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

    // Fetch documents for selected project
    const fetchDocuments = async (projectId: string) => {
        if (!projectId) return;
        try {
            const res = await API.get(`/projects/${projectId}/documents`, {
                 headers: { Authorization: `Bearer ${token}` },
            });
            setDocuments(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load documents");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchDocuments(selectedProject);
        }
    }, [selectedProject]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewDoc({ ...newDoc, file: e.target.files[0] });
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDoc.file || !selectedProject) {
            alert("Select a file and project");
            return;
        }

        const formData = new FormData();
        formData.append("title", newDoc.title);
        formData.append("file", newDoc.file);

        try {
            await API.post(`/projects/${selectedProject}/documents`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                params: { userId: user.sub },
            });
            setNewDoc({ title: "", file: null });
            fetchDocuments(selectedProject);
        } catch (err) {
            console.error(err);
            alert("File upload failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this document?")) return;
        try {
            await API.delete(`/documents/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchDocuments(selectedProject);
        } catch (err) {
            console.error(err);
            alert("Failed to delete document");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Documents</h2>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="mb-4 p-3 border rounded shadow-sm bg-light">
                <div className="row g-3 align-items-center">

                    {/* Project Dropdown */}
                    <div className="col-md-4 d-flex align-items-center">
                        <label htmlFor="projectSelect" className="form-label me-2 mb-0" style={{ minWidth: "80px" }}>
                            Project:
                        </label>
                        <select
                            id="projectSelect"
                            className="form-select"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            required
                        >
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title || "Untitled Project"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Document Title */}
                    <div className="col-md-4 d-flex align-items-center">
                        <label htmlFor="docTitle" className="form-label me-2 mb-0" style={{ minWidth: "80px" }}>
                            Title:
                        </label>
                        <input
                            type="text"
                            id="docTitle"
                            className="form-control"
                            placeholder="Document title"
                            value={newDoc.title}
                            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* File Input */}
                    <div className="col-md-4 d-flex align-items-center">
                        <label htmlFor="docFile" className="form-label me-2 mb-0" style={{ minWidth: "80px" }}>
                            File:
                        </label>
                        <input
                            type="file"
                            id="docFile"
                            className="form-control"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Upload Button */}
                    <div className="col-md-12 d-flex justify-content-end mt-3">
                        <button type="submit" className="btn btn-primary">
                            Upload Document
                        </button>
                    </div>

                </div>
            </form>

            {/* Documents Table */}
            <table className="table table-bordered table-hover">
                <thead className="table-light">
                <tr>
                    <th>Project</th>
                    <th>Title</th>
                    <th>Uploaded By</th>
                    <th>Uploaded At</th>
                    <th>File</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {documents.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center text-muted">
                            No documents found for this project.
                        </td>
                    </tr>
                ) : (
                    documents.map((d) => (
                        <tr key={d.id}>
                            <td>{d.projectTitle || "—"}</td>
                            <td>{d.title}</td>
                            <td>{d.uploadedByName || "—"}</td>
                            <td>{new Date(d.uploadedAt).toLocaleString()}</td>
                            <td>
                                <a
                                    href={d.urlOrPath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    View
                                </a>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(d.id)}
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

export default DocumentsPage;
