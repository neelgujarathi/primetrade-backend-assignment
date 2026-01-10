const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { setupSwagger } = require("./swagger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { errorHandler } = require("./utils/errorHandler");
const path = require("path"); // ✅ Only one place in entire backend

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);



app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV !== "production") {
  setupSwagger(app);
}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use(errorHandler);

// // Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
//   app.get(/^\/(?!api).*/, (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
//   });
// }

// In production, backend only handles API requests
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

module.exports = app;
