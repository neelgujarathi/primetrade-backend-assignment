import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [usersData, setUsersData] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [editingTaskId, setEditingTaskId] = useState(null); 
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [usersRes, tasksRes] = await Promise.all([
        API.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/admin/tasks", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const taskCountMap = tasksRes.data.reduce((acc, t) => {
        const id = t.createdBy?._id;
        if (id) acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const formattedUsers = usersRes.data
        .filter((u) => u._id !== user._id)
        .map((u) => ({ ...u, taskCount: taskCountMap[u._id] || 0 }));

      setUsersData(formattedUsers);
    } catch (err) {
      console.error("Admin data fetch error:", err.message);
    }
  };

  // Fetch tasks for normal users
  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // CRUD handlers
  const handleChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleNewChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  const handleUpdate = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(`/tasks/${taskId}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/tasks", newTask, { headers: { Authorization: `Bearer ${token}` } });
      setTasks((prev) => [res.data, ...prev]);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating task:", err.message);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchAdminData();
    else fetchUserTasks();
  }, [user]);

  if (!user) return null;

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start min-vh-100 py-5"
      style={{ background: "#f0f2f5", fontFamily: "Poppins, sans-serif", color: "#333" }}
    >
      <div className="card shadow-sm border-0 p-4 w-100" style={{ maxWidth: "1000px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 fw-bold">{user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h2>

        {user?.role === "admin" ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Total Tasks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {usersData.length === 0 ? (
                  <tr>
                    <td colSpan="5">No users found.</td>
                  </tr>
                ) : (
                  usersData.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.taskCount}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/admin/user/${u._id}`)}
                        >
                          View Tasks
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            
            <div className="card shadow-sm border-0 p-3 mb-4 w-100">
              <h5 className="mb-3">Add New Task</h5>
              <div className="d-flex flex-column flex-md-row gap-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Task Title"
                  className="form-control"
                  value={newTask.title}
                  onChange={handleNewChange}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Task Description"
                  className="form-control"
                  value={newTask.description}
                  onChange={handleNewChange}
                />
                <button className="btn btn-primary flex-shrink-0" onClick={handleCreate}>
                  Add Task
                </button>
              </div>
            </div>

            
            <div className="row">
              {tasks.length === 0 && <p className="text-center">No tasks added yet.</p>}
              {tasks.map((t) => (
                <div className="col-md-6 mb-3" key={t._id}>
                  <div className="card shadow-sm border-0 p-3">
                    {editingTaskId === t._id ? (
                      <>
                        <input
                          type="text"
                          name="title"
                          className="form-control mb-2"
                          value={editForm.title}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="description"
                          className="form-control mb-2"
                          value={editForm.description}
                          onChange={handleChange}
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm flex-fill"
                            onClick={() => handleUpdate(t._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm flex-fill"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5>{t.title}</h5>
                        <p>{t.description}</p>
                        <small className="text-muted">
                          Created at: {new Date(t.createdAt).toLocaleString()}
                        </small>
                        <div className="mt-2 d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm flex-fill"
                            onClick={() => handleEditClick(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm flex-fill"
                            onClick={() => handleDelete(t._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
