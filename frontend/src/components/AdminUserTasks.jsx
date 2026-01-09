import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminUserTasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user tasks & details
  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const res = await API.get("/admin/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((t) => t.createdBy?._id === id);
        setTasks(filtered);

        const usersRes = await API.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundUser = usersRes.data.find((u) => u._id === id);
        setUserDetails(foundUser || null);
      } catch (err) {
        console.error("Error loading user tasks:", err.message);
      }
    };

    fetchUserTasks();
  }, [id, token]);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (taskId) => {
    try {
      const res = await API.put(`/admin/tasks/${taskId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...res.data } : t))
      );
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  return (
    <div
      className="min-vh-100 py-5 d-flex flex-column align-items-center"
      style={{ fontFamily: "Poppins, sans-serif", background: "#f0f2f5" }}
    >
      <div className="card shadow-sm w-100" style={{ maxWidth: "800px", borderRadius: "12px" }}>
        <div className="card-header d-flex justify-content-between align-items-center bg-white">
          <h4 className="mb-0">{userDetails ? `${userDetails.name}'s Tasks` : "User Tasks"}</h4>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="card-body">
          {tasks.length === 0 ? (
            <p className="text-center text-muted">No tasks found for this user.</p>
          ) : (
            <div className="row g-3">
              {tasks.map((task) => (
                <div key={task._id} className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      {editingTaskId === task._id ? (
                        <>
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleChange}
                            className="form-control mb-2"
                            placeholder="Task Title"
                          />
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleChange}
                            className="form-control mb-2"
                            placeholder="Task Description"
                          />
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm flex-fill"
                              onClick={() => handleUpdate(task._id)}
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
                          <h5 className="card-title">{task.title}</h5>
                          <p className="card-text text-muted">{task.description}</p>
                          <small className="text-muted">
                            Created at: {new Date(task.createdAt).toLocaleString()}
                          </small>
                          <div className="d-flex gap-2 mt-3">
                            <button
                              className="btn btn-outline-primary btn-sm flex-fill"
                              onClick={() => handleEditClick(task)}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm flex-fill"
                              onClick={() => handleDelete(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
