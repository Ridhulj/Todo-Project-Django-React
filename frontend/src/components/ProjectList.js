// src/components/ProjectList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';


const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await api.get('/projects/');
    setProjects(response.data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await api.post('/projects/', { title });
    setTitle('');
    fetchProjects();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todos Management</h1>
      <h3 className="mb-3">Projects</h3>
      <form onSubmit={createProject} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New project title"
            required
          />
          <button type="submit" className="btn btn-primary">Create Project</button>
        </div>
      </form>
      <ul className="list-group">
        {projects.map((project) => (
          <li key={project.id} className="list-group-item">
            <Link to={`/projects/${project.id}`} className="text-decoration-none">
              {project.title} - <small>Created on: {new Date(project.created_date).toLocaleDateString()}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
