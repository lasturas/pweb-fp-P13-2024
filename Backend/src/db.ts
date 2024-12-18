import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Memuat variabel lingkungan dari file .env

const uri = process.env.ATLAS_URI || ""; // Gunakan variabel ATLAS_URI dari .env

if (!uri) {
  console.error("MongoDB URI is not defined in .env");
  throw new Error("MongoDB URI is missing");
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri); // Hubungkan ke MongoDB
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Hentikan proses jika koneksi gagal
  }
};

export default connectDB;
