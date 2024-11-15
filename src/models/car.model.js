import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: { type: String, required: true }, // Company name (e.g., "Mahindra")
    carName: { type: String, required: true }, // Car model name (e.g., "Mahindra KUV100 NXT")
    description: { type: String }, // Description of the car
    price: { type: Number, required: true }, // Price of the car
    fuelType: { type: String, enum: ["Petrol", "Diesel"], required: true }, // Fuel type (e.g., Petrol, Diesel)
    mileage: { type: String }, // Mileage range (e.g., "18.15 - 25.32 km/l")
    warranty: { type: String }, // Warranty details (e.g., "2 Years (Unlimited KMs)")
    seater: { type: Number, required: true, min: 2 }, // Number of seats (e.g., 5-6)
    fuelTank: { type: Number }, // Fuel tank capacity (e.g., 35 liters)
    images: [
      {
        type: String,
      },
    ], // Array of image URLs
    tags: [
      {
        type: String,
      },
    ], // Tags related to the car
  },
  { timestamps: true }
);

export const Car = mongoose.model("Car", CarSchema);
