const Task = require('../models/Task');

// Create Task
exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// Get All Tasks
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ createdBy: req.user.id });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

// Update Task
exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// Delete Task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task removed" });
    } catch (error) {
        next(error);
    }
};
