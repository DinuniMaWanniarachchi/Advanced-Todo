// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './index.css'; // Tailwind CSS import

const ProjectsPage = lazy(() => import('@/pages/projects-page'));
// const TodosPage = lazy(() => import('@/pages/todos-page'));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          {/* {<Route path="/project/:id/todos" element={<TodosPage />} /> } */}
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
