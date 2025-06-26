import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { envconfig } from "../config/config";

cloudinary.config({
  cloud_name: envconfig.cloud_name,
  api_key: envconfig.cloud_api_key,
  api_secret: envconfig.cloud_api_secret,
});

const uploadOnCloudnary = async (
  localFilePath: string
): Promise<{ secure_url: string; public_id: string } | null> => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File path is invalid or file does not exist.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "File successfully uploaded to Cloudinary:",
      response.secure_url
    );

    // delete the local file after upload
    fs.unlink(localFilePath, (error) => {
      if (error) {
        console.error("Error deleting local file", error);
      }
    });

    return {
      secure_url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    console.log("Failed to upload to Cloudinary");

    // try to delete the file even if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (deleteError) {
      console.error("Failed to delete after failed upload", deleteError);
    }

    return null;
  }
};

export default uploadOnCloudnary;
