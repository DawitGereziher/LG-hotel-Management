import mongoose from "mongoose";

const uri = "mongodb+srv://dawitgereziher5:0945517553@students.nthfm.mongodb.net/LGHotelManagement?retryWrites=true&w=majority&appName=Students";

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Successfully connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
