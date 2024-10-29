// src/App.js
import React from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetailWithTodos from './components/ProjectDetailWithTodod';
import Login from "./components/credentials/Login";
import Register from "./components/credentials/Register";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="register/" element={<Register />} />
          <Route path="dash/" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetailWithTodos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
