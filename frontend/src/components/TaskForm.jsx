import { useState } from "react";
import API from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TaskForm({ fetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/tasks", { title, description });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column flex-md-row gap-2 justify-content-center"
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control"
        required
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-control"
        required
      />
      <button type="submit" className="btn btn-primary px-4">
        Add Task
      </button>
    </form>
  );
}
