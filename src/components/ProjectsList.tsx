import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../db/queries/getAllProjects';// Import the function
import type { Project } from '../db/models/Project'; // Import the Project interface
import { Link } from "react-router";
const ProjectsList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                setProjects(data);
            } catch (err) {
                setError('Error fetching projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="p-4">Loading projects...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4 w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4">All Projects</h2>
            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <ul className="space-y-2">
                    {projects.map((project) => (
                        <li key={project.id} className="p-2 border rounded">
                            <Link to={`/project/${project.id}`}>

                                <strong>{project.name}</strong> (ID: {project.id})
                                <br />
                                Orientation: {project.orientation}
                                <br />
                                Created: {project.createdAt.toLocaleString()}
                                <br />
                                Updated: {project.updatedAt.toLocaleString()}

                            </Link>
                        </li>

                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectsList;