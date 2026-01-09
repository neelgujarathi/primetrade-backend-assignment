const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { setupSwagger } = require("./swagger");
const cors = require('cors');
const path = require('path'); // <-- add this
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./utils/errorHandler');
const adminRoutes = require('./routes/adminRoutes');

// Enable CORS
app.use(
  cors({
    origin: "*", // can allow all for testing, or set your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Swagger (dev only)
if (process.env.NODE_ENV !== "production") {
  setupSwagger(app);
}

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Point to your React build folder
  app.use(express.static(path.join(__dirname, "client/build")));

  // Catch-all route to serve index.html for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Error handler
app.use(errorHandler);

module.exports = app;
