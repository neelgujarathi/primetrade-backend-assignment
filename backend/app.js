const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { setupSwagger } = require("./swagger");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./utils/errorHandler');
const adminRoutes = require('./routes/adminRoutes');

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // React dev URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies/auth headers
  })
);

// ✅ Parse incoming JSON
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  setupSwagger(app);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);
// Error handler
app.use(errorHandler);

module.exports = app;
