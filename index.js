import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.routes.js";
import carRouter from "./src/routes/car.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

dotenv.config();
const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB Connection failed!!!", err);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cars", carRouter);

app.use(errorHandler);
