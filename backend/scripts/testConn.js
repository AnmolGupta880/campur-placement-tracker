import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Using MONGO_URI (hidden):', !!uri);

async function run(){
  try{
    const conn = await mongoose.connect(uri, { dbName: 'campus_placement_tracker' });
    console.log('Connected to MongoDB');
    await mongoose.disconnect();
  }catch(err){
    console.error('Connection error:');
    console.error(err);
    process.exitCode = 1;
  }
}

run();
