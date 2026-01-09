let client = null;

if (process.env.NODE_ENV === "development") {
  const redis = require("redis");

  client = redis.createClient({
    url: "redis://localhost:6379",
  });

  client.on("error", (err) => console.error("Redis Client Error", err));

  (async () => {
    try {
      await client.connect();
      console.log("Redis connected (development)");
    } catch (err) {
      console.error("Redis failed to connect:", err);
    }
  })();
} else {
  // Production: Redis disabled
  console.log("Redis disabled in production (no connection attempt)");
}

module.exports = client;
