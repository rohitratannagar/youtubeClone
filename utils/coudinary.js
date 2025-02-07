import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file_path) => {
    try {
        if(!file_path){
            
            return null;
        }
        const response = await cloudinary.uploader.upload(file_path,{
            resource_type: "auto"
        })
        // console.log("file has been uploaded on cloudinary", response.url)
        //if file has been uploaded successfully
        fs.unlinkSync(file_path)
        return response;
    } catch (error) {
        fs.unlinkSync(file_path)
        return null;
    }
}

export {uploadOnCloudinary};