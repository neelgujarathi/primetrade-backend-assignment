const User = require("../models/User");
const Task = require("../models/Task");
const redisClient = require("../config/redis");

exports.getAllUsers = async (req, res) => {
  try {
    let users = null;

    // Only use Redis if client exists
    if (redisClient) {
      const cachedUsers = await redisClient.get("all_users");
      if (cachedUsers) {
        console.log("Returning users from Redis cache");
        return res.status(200).json(JSON.parse(cachedUsers));
      }
    }

    // Fetch from database
    users = await User.find().select("-password");

    // Cache in Redis if client exists
    if (redisClient) {
      await redisClient.setEx("all_users", 60, JSON.stringify(users));
      console.log("Users cached in Redis for 60 seconds");
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Task.deleteMany({ createdBy: user._id }); 
    await user.deleteOne();

    // Optional: clear cached users if Redis exists
    if (redisClient) {
      await redisClient.del("all_users");
      console.log("Redis cache cleared for all_users");
    }

    res.status(200).json({ message: "User and related tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// View all tasks (from all users)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "name email role");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Update any user’s task
exports.updateAnyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete any user’s task
exports.deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
