import mongoose, { connect } from "mongoose";

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log(" ----- DB CONNECT 👍 ----- ")
    }catch(error){
        console.log(error)
    }
} 


export default connectDb 