import express from "express";
import weatherRouter from "./routes/weather.route";
import { rateLimitMiddleware } from "../utils/middleware/rateLimit.middleware";
import { errorHandler } from "../utils/middleware/errorHandler.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(rateLimitMiddleware);

// Route-specific middleware
app.use("/weather", weatherRouter);

// Error handler middleware (must be last)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Weather service is running");
});

app.listen(PORT, () => {
  console.log(`Weather service running on port ${PORT}`);
});

export default app;
