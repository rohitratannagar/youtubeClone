import mongoose from "mongoose";
import {DB_NAME} from "../src/constants.js";


const connectDB  = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}` )
        console.log(`\n Connected to MongoDB !! DB HOST: ${connectionInstance.connection.host} \n`)
    } catch (error) {
        console.error("mongoDB connection FAILED", error);
        process.exit(1);
    } 
}

export default connectDB;