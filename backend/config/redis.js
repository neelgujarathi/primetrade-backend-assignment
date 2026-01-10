let client = null;

// Only connect to Redis if explicitly enabled
if (process.env.USE_REDIS === "true") {
  const redis = require("redis");
  client = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  client.on("error", (err) => console.error("Redis Client Error", err));
  client.connect();
} else {
  console.log("Redis is disabled in this environment.");
}

module.exports = client;
