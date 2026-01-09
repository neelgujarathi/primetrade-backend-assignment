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
    origin: "https://primetrade-backend-assignment-sjou.onrender.com/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  if (process.env.NODE_ENV !== "production") {
  setupSwagger(app);
}


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

module.exports = app;
