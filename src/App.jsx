import { Loader2 } from 'lucide-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Projects from './pages/Projects.jsx';
import Signup from './pages/Signup.jsx';

const ProtectedRoute = ({ children }) => {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return (
      <div className="screen-loader">
        <Loader2 className="spin" size={26} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const FallbackRoute = () => {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return (
      <div className="screen-loader">
        <Loader2 className="spin" size={26} />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/projects' : '/'} replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <Login />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup />
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Projects />} />
        <Route path=":projectId" element={<ProjectDetail />} />
      </Route>
      <Route path="/app" element={<Navigate to="/projects" replace />} />
      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
}
