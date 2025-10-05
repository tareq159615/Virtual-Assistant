import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log("Uploading file to Cloudinary:", filePath);
    
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    
    console.log("Cloudinary upload successful:", uploadResult.secure_url);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      // console.log("Local file deleted:", filePath);
    }
    
    return uploadResult.secure_url;
    
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("Local file deleted after error:", filePath);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
    
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default uploadOnCloudinary;