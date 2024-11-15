import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

/**
 * Upload a file to Cloudinary and delete the local file afterward.
 * @param {string} localFilePath - The local path of the file to upload.
 * @returns {Object|null} - Returns Cloudinary response or null if an error occurs.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new Error("File path is required");

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File successfully uploaded to Cloudinary:", response.url);

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);

    // Ensure the local file is deleted in case of an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
