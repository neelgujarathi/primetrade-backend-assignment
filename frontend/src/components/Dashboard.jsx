import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [usersData, setUsersData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });

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
        API.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),

        API.get("/admin/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const taskCountMap = tasksRes.data.reduce((acc, t) => {
        const id = t.createdBy?._id;

        if (id) acc[id] = (acc[id] || 0) + 1;

        return acc;
      }, {});

      const formattedUsers = usersRes.data
        .filter((u) => u._id !== user._id)
        .map((u) => ({
          ...u,
          taskCount: taskCountMap[u._id] || 0,
        }));

      setUsersData(formattedUsers);
    } catch (err) {
      console.error("Admin data fetch error:", err.message);
    }
  };

  // Fetch tasks
  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Edit form change
  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // New task form change
  const handleNewChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  // Edit click
  const handleEditClick = (task) => {
    setEditingTaskId(task._id);

    setEditForm({
      title: task.title,
      description: task.description,
    });
  };

  // Update task
  const handleUpdate = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.put(`/tasks/${taskId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );

      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?"))
      return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  // Create task
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => [res.data, ...prev]);

      setNewTask({
        title: "",
        description: "",
        status: "pending",
      });
    } catch (err) {
      console.error("Error creating task:", err.message);
    }
  };

  // Change status
  const handleStatusChange = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.put(
        `/tasks/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchAdminData();
    else fetchUserTasks();
  }, [user]);

  // Filter + Search Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "pending"
        ? task.status !== "completed"
        : task.status === "completed";

    return matchesSearch && matchesFilter;
  });

  // Separate tasks
  const pendingTasks = filteredTasks.filter(
    (t) => t.status !== "completed"
  );

  const completedTasks = filteredTasks.filter(
    (t) => t.status === "completed"
  );

  if (!user) return null;

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start min-vh-100 py-5"
      style={{
        background: "#f0f2f5",
        fontFamily: "Poppins, sans-serif",
        color: "#333",
      }}
    >
      <div
        className="card shadow-sm border-0 p-4 w-100"
        style={{
          maxWidth: "1100px",
          borderRadius: "12px",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">
            {user?.role === "admin"
              ? "Admin Dashboard"
              : "User Dashboard"}
          </h2>

          {/* <button
            className="btn btn-danger btn-sm"
            onClick={logout}
          >
            Logout
          </button> */}
        </div>

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
                          onClick={() =>
                            navigate(`/admin/user/${u._id}`)
                          }
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
            {/* Add Task */}
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

                <button
                  className="btn btn-primary flex-shrink-0"
                  onClick={handleCreate}
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="card shadow-sm border-0 p-3 mb-4">
              <div className="row g-3">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search tasks by title or description..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value)
                    }
                  >
                    <option value="all">All Tasks</option>
                    <option value="pending">
                      Pending Tasks
                    </option>
                    <option value="completed">
                      Completed Tasks
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="mb-4">
              <h4 className="mb-3 text-warning fw-bold">
                Pending Tasks ({pendingTasks.length})
              </h4>

              <div className="row">
                {pendingTasks.length === 0 && (
                  <p className="text-center">
                    No pending tasks found.
                  </p>
                )}

                {pendingTasks.map((t) => (
                  <div className="col-md-6 mb-3" key={t._id}>
                    <div className="card shadow-sm border-0 p-3 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      </div>

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
                              onClick={() =>
                                handleUpdate(t._id)
                              }
                            >
                              Save
                            </button>

                            <button
                              className="btn btn-secondary btn-sm flex-fill"
                              onClick={() =>
                                setEditingTaskId(null)
                              }
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
                            Created at:{" "}
                            {new Date(
                              t.createdAt
                            ).toLocaleString()}
                          </small>

                          <div className="mt-3 d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-warning btn-sm flex-fill"
                              onClick={() =>
                                handleEditClick(t)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm flex-fill"
                              onClick={() =>
                                handleDelete(t._id)
                              }
                            >
                              Delete
                            </button>

                            <button
                              className="btn btn-success btn-sm flex-fill"
                              onClick={() =>
                                handleStatusChange(
                                  t._id,
                                  "completed"
                                )
                              }
                            >
                              Mark Complete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Tasks */}
            <div>
              <h4 className="mb-3 text-success fw-bold">
                Completed Tasks ({completedTasks.length})
              </h4>

              <div className="row">
                {completedTasks.length === 0 && (
                  <p className="text-center">
                    No completed tasks found.
                  </p>
                )}

                {completedTasks.map((t) => (
                  <div className="col-md-6 mb-3" key={t._id}>
                    <div className="card shadow-sm border-0 p-3 bg-light h-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-success">
                          Completed
                        </span>
                      </div>

                      <h5 className="text-decoration-line-through">
                        {t.title}
                      </h5>

                      <p className="text-muted text-decoration-line-through">
                        {t.description}
                      </p>

                      <small className="text-muted">
                        Created at:{" "}
                        {new Date(
                          t.createdAt
                        ).toLocaleString()}
                      </small>

                      <div className="mt-3 d-flex gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm flex-fill"
                          onClick={() =>
                            handleStatusChange(
                              t._id,
                              "pending"
                            )
                          }
                        >
                          Mark Pending
                        </button>

                        <button
                          className="btn btn-danger btn-sm flex-fill"
                          onClick={() =>
                            handleDelete(t._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}