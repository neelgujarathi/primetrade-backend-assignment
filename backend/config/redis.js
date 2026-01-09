let client = null;

if (process.env.NODE_ENV !== "production") {
  const redis = require("redis");
  client = redis.createClient({
    url: "redis://localhost:6379",
  });
  client.on("error", (err) => console.error("Redis Client Error", err));
  client.connect();
}

module.exports = client;
