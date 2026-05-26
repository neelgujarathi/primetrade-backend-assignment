const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});