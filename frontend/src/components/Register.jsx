import { useState } from "react";
import API from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  // ✅ added

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ added

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required!", { position: "top-right" });
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Invalid email format!", { position: "top-right" });
      return;
    }
    if (!isValidPassword(form.password)) {
      toast.error("Password must be at least 6 characters!", {
        position: "top-right",
      });
      return;
    }

    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Registered successfully!", { position: "top-right" });
      setMessage("Registered successfully!");
      setTimeout(() => {
        navigate("/login"); // ✅ updated
      }, 1200);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed!";
      toast.error(errMsg, { position: "top-right" });
      setMessage(errMsg);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "420px", borderRadius: "12px", marginTop: "-70px" }}
      >
        <div className="card-body">
          <h3 className="text-center mb-4 fw-bold text-dark">Create Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                placeholder="Name"
                name="name"
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                placeholder="Email"
                name="email"
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Role</label>
              <select name="role" onChange={handleChange} className="form-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success w-100 fw-semibold">
              Register
            </button>
          </form>
          <p
            className={`text-center mt-3 fw-semibold ${
              message.includes("success") ? "text-success" : "text-danger"
            }`}
          >
            {message}
          </p>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <span className="text-primary fw-semibold" style={{ cursor: "pointer" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>Log In</Link>
            </span>
          </p>
          <p className="text-center text-muted mt-2" id="regClock"></p>
        </div>
      </div>
      <ToastContainer />
      <script>
        {`
          setInterval(() => {
            const el = document.getElementById('regClock');
            if (el) el.textContent = new Date().toLocaleTimeString();
          }, 1000);
        `}
      </script>
    </div>
  );
}
