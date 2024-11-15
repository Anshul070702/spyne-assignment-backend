import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Car } from "../models/car.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const createCar = asyncHandler(async (req, res) => {
  const {
    company,
    carName,
    description,
    price,
    fuelType,
    mileage,
    warranty,
    seater,
    tags,
  } = req.body;

  if (!company || !carName || !description || !price || !fuelType) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // console.log(req.body);
  // console.log("Files => ", req.files);

  const uploadedLinks = await Promise.all(
    req.files.images.map(async (image) => {
      const result = await uploadOnCloudinary(image.path);
      return result.secure_url; // Only keep the URL as a string
    })
  );

  // Create a new car entry in the database
  const car = await Car.create({
    company,
    carName,
    description,
    price,
    fuelType,
    mileage,
    warranty,
    seater,
    tags,
    images: uploadedLinks,
    user: req.user.id, // Assuming `req.user` contains the authenticated user’s ID
    // user: req., // Assuming `req.user` contains the authenticated user’s ID
  });

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(500, "Failed to find user");
  }
  user.cars.push(car._id);
  await user.save();

  res.status(201).json(new ApiResponse(201, car, "Car created successfully"));
});

const getAllCars = asyncHandler(async (req, res) => {
  const cars = await User.findById(req.user.id).populate("cars");

  res
    .status(200)
    .json(new ApiResponse(200, cars, "Cars retrieved successfully"));
});

const getCarById = asyncHandler(async (req, res) => {
  const carId = req?.params?.carId;
  const car = await Car.findById(carId);

  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, car, "Car details retrieved successfully"));
});

const updateCar = asyncHandler(async (req, res) => {
  const {
    company,
    carName,
    description,
    price,
    fuelType,
    mileage,
    warranty,
    seater,
    tags,
  } = req.body;

  const carId = req.params.carId;

  // Update car properties
  const car = await Car.findByIdAndUpdate(
    carId,
    {
      company,
      carName,
      description,
      price,
      fuelType,
      mileage,
      warranty,
      seater,
      tags,
    },
    { new: true }
  );

  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  res.status(200).json(new ApiResponse(200, car, "Car updated successfully"));
});

const deleteCar = asyncHandler(async (req, res) => {
  const carId = req?.params?.carId;
  const car = await Car.findByIdAndDelete(carId);

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(500, "Failed to find user");
  }
  user.cars.pull(carId);
  await user.save();

  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Car deleted successfully"));
});

const searchCars = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  // Search for cars that match the query in title, description, or tags
  const cars = await Car.find({
    user: req.user.id, // Only search user's own cars
    $or: [
      { carName: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  });

  res
    .status(200)
    .json(new ApiResponse(200, cars, "Search results retrieved successfully"));
});

export { createCar, getAllCars, updateCar, deleteCar, getCarById };
