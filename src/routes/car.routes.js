import express from "express";
import {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/car.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/createCar",
  authMiddleware,
  upload.fields([
    {
      name: "images",
      minCount: 1,
    },
  ]),
  createCar
);

router.get("/getAllCar", authMiddleware, getAllCars);
router.get("/getCarById/:carId", authMiddleware, getCarById);
router.put("/updateCar/:carId", authMiddleware, updateCar);
router.delete("/deleteCar/:carId", authMiddleware, deleteCar);

export default router;
