import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';


const ProjectDetailWithTodos = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    fetchProject();
    fetchTodos();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}/`);
      setProject(response.data);
      setProjectTitle(response.data.title);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await api.get(`/projects/${id}/todos/`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    const data = {
      description: description,
      status: "pending",
      project: id,
    };

    try {
      const response = await api.post(`/projects/${id}/todos/`, data);
      setTodos([...todos, response.data]);
      setDescription('');
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const updateProjectTitle = async () => {
    try {
      await api.patch(`/projects/${id}/`, { title: projectTitle });
      setIsEditing(false);
      fetchProject();
    } catch (error) {
      console.error("Error updating project title:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await api.delete(`/todos/${todoId}/delete/`);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodoCompletion = async (todo) => {
    const updatedStatus = todo.status === "pending" ? "complete" : "pending";

    try {
      await api.patch(`/todos/${todo.id}/update/`, { status: updatedStatus });
      setTodos(todos.map(t => (t.id === todo.id ? { ...t, status: updatedStatus } : t)));
    } catch (error) {
      console.error("Error toggling todo status:", error);
    }
  };

  const updateTodoDescription = async (todoId) => {
    const updatedData = {
      description: newTodoDescription,
    };

    try {
      await api.patch(`/todos/${todoId}/update/`, updatedData);
      setTodos(todos.map(todo => (todo.id === todoId ? { ...todo, description: newTodoDescription } : todo)));
      setEditingTodoId(null);
      setNewTodoDescription('');
    } catch (error) {
      console.error("Error updating todo description:", error);
    }
  };

  const exportGist = async () => {
    try {
      const response = await api.get(`/projects/${id}/export-gist/`);
      setConfirmationMessage(`Gist created! View it here: ${response.data.gist_url}`);
    } catch (error) {
      console.error("Error exporting gist:", error);
      setConfirmationMessage('Failed to create Gist. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="mb-4">
        {isEditing ? (
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
            <button className="btn btn-success" onClick={updateProjectTitle}>Save</button> &nbsp;
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <h2 onClick={() => setIsEditing(true)} className="text-primary" style={{ cursor: 'pointer' }}>{projectTitle}</h2>
        )}
      </div>
      <button className="btn btn-info mb-4" onClick={exportGist}>Export as Gist</button>
      {confirmationMessage && <div className="alert alert-info">{confirmationMessage}</div>}
      <h3>Todos</h3>
      <form onSubmit={addTodo} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="New todo description"
            required
          />
          <button type="submit" className="btn btn-primary">Add Todo</button>
        </div>
      </form>
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editingTodoId === todo.id ? (
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  placeholder="Update todo description"
                />
                <button className="btn btn-success" onClick={() => updateTodoDescription(todo.id)}>Update</button> &nbsp;
                <button className="btn btn-secondary" onClick={() => {
                  setEditingTodoId(null);
                  setNewTodoDescription('');
                }}>Cancel</button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center w-100">
                <span>
                  {todo.description} - <small>{new Date(todo.created_date).toLocaleDateString()}</small> - {todo.status}
                </span>
                <div>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => toggleTodoCompletion(todo)}>
                    Mark as {todo.status === "pending" ? "Complete" : "Pending"}
                  </button> &nbsp;
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteTodo(todo.id)}>Delete</button> &nbsp;
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => {
                    setEditingTodoId(todo.id);
                    setNewTodoDescription(todo.description);
                  }}>Edit</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetailWithTodos;
