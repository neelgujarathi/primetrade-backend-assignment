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

const redisClient = require("../config/redis");

// Fetch all users with caching
router.get("/users", async (req, res) => {
  try {
    // Check cache first
    const cachedUsers = await redisClient.get("all_users");
    if (cachedUsers) {
      return res.json(JSON.parse(cachedUsers)); // Return cached response
    }

    const users = await User.find();
    await redisClient.setEx("all_users", 60, JSON.stringify(users)); // Cache for 60 sec

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Admin can view all users
router.get("/users", verifyToken, isAdmin, getAllUsers);

// ✅ Admin can delete any user
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// ✅ Admin can view all tasks
router.get("/tasks", verifyToken, isAdmin, getAllTasks);

// ✅ Admin can update any user's task
router.put("/tasks/:id", verifyToken, isAdmin, updateAnyTask);

// ✅ Admin can delete any user's task
router.delete("/tasks/:id", verifyToken, isAdmin, deleteAnyTask);

module.exports = router;
