import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // ✅ added

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ added

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      toast.success("Login successful!", { position: "top-right" });
      setTimeout(() => {
        navigate("/dashboard"); // ✅ updated
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "380px", borderRadius: "12px", marginTop: "-160px" }}
      >
        <div className="card-body">
          <h3 className="text-center mb-4 fw-bold text-dark">Welcome Back</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold">
              Log In
            </button>
            <p className="text-center mt-3">
              Don't have a account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
              >
                <a href="/register" style={{ textDecoration: "none" }}>
                  Create a Account
                </a>
              </span>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
