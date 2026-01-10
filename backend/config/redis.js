let client = null;

if (process.env.NODE_ENV !== "production") {
  const redis = require("redis");
  client = redis.createClient({
    url: "redis://localhost:6379",
  });

  client.on("error", (err) => console.error("Redis Client Error", err));
  client.connect();
} else {
  console.log("Redis is disabled in production.");
}

module.exports = client;
