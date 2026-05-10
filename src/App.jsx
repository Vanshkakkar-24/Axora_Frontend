import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import ProjectDetails from "./pages/ProjectDetails";
// import NotFound from "./pages/NotFound";

// import Navbar from "./components/Navbar";

import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}

      <ToastContainer />

      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              {/* <Dashboard /> */}
            </PrivateRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              {/* <ProjectDetails /> */}
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          // element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;