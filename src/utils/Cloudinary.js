
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return;

        const parts = imageUrl.split("/");
        const filenameWithExtension = parts[parts.length - 1];
        const publicId = filenameWithExtension.split(".")[0];

        const folderIndex = parts.indexOf("upload");
        if (folderIndex !== -1 && parts.length > folderIndex + 2) {
            const folderPath = parts
                .slice(folderIndex + 2, parts.length - 1)
                .join("/");
            const fullPublicId = `${folderPath}/${publicId}`;
            await cloudinary.uploader.destroy(fullPublicId);
            return;
        }

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };