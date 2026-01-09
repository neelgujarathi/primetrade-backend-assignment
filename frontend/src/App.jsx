import { Routes, Route, useNavigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminUserTasks from "./components/AdminUserTasks";
import { useAuth } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ user, logout }) {
  const navigate = useNavigate();

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 10,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        className="fw-bold fs-5 text-primary"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        TaskManager
      </div>

      <div className="d-flex gap-2">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-outline-primary btn-sm fw-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn btn-primary btn-sm fw-semibold text-white"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-outline-secondary btn-sm fw-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="btn btn-danger btn-sm fw-semibold"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-vh-100 w-100"
      style={{
        backgroundColor: "#f8f9fa",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
      }}
    >
      <Navbar user={user} logout={logout} />
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          overflowY: "auto",
          paddingTop: "70px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Routes>
         
          {!user && <Route path="/login" element={<Login />} />}
          {!user && <Route path="/register" element={<Register />} />}

          {user && <Route path="/dashboard" element={<Dashboard />} />}
          {user && user.role === "admin" && (
            <Route path="/admin/user/:id" element={<AdminUserTasks />} />
          )}

          <Route path="*" element={user ? <Dashboard /> : <Login />} />
        </Routes>
      </div>
    </div>
  );
}
