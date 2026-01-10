const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllTasks,
  updateAnyTask,
  deleteAnyTask,
} = require("../controllers/adminController");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Admin can view all users
router.get("/users", verifyToken, isAdmin, getAllUsers);

// Admin can delete any user
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// Admin can view all tasks
router.get("/tasks", verifyToken, isAdmin, getAllTasks);

// Admin can update any user's task
router.put("/tasks/:id", verifyToken, isAdmin, updateAnyTask);

// Admin can delete any user's task
router.delete("/tasks/:id", verifyToken, isAdmin, deleteAnyTask);

module.exports = router;
