import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOncloudinary} from '../utils/coudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
//get user details from backend
// validation- not empty
//check if user alredy exists- email, username
//check for images check for avatar 



const registerUser = asyncHandler( async (req, res) => {
    const {userName, fullName, email, password} = req.body
    console.log(email);


    // if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    // }
    
    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is field is required")
    }
   const avatar =  await uploadOncloudinary(avatarLocalPath);
   const coverImage = await uploadOncloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Avatar is field is required")
   }
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: userName.toLowerCase()
   })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully!")
    )
})

export {registerUser}
