import app from "./app";
import connectDB from "./db"; // Import koneksi MongoDB
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5050;

// Hubungkan ke MongoDB sebelum memulai server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start server due to MongoDB connection error:",
      err.message
    );
  });
