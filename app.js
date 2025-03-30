/* eslint-disable no-undef */
import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import subscriptionRouter from "./routes/subscriptionRouter.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjetMiddleware.js";
import workflowRouter from "./models/workflowRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/workflow", workflowRouter);
app.use(errorMiddleware);

app.listen(PORT || 3000, () => {
  console.log(`Server running on port ${PORT || 3000}`);
  console.log(`URL: http://localhost:${PORT || 3000}`);
  console.log(`Press Ctrl+C to stop the server`);

  connectDB();
});

export default app;
