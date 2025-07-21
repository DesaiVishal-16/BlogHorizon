import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URL:string | undefined = process.env.DB_URL; 

if(!DB_URL){
    console.error('error: DB_URL is not defined in environment variables.');
    process.exit(1);
}
mongoose.set('strictQuery',false)

const connectDB = async():Promise<void>=>{
 try{
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB successfully!');
 }catch(err){
    console.error('Error connecting to MongoDB:',err);
    process.exit(1);
 }
};

export default connectDB;