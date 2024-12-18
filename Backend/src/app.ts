import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // Import CORS
import adminRoutes from "./routes/adminRoutes"; // Rute Admin
import dotenv from "dotenv"; // Import dotenv untuk menggunakan environment variables

dotenv.config(); // Load environment variables dari file .env

const app = express();

// Middleware JSON Parsing
app.use(express.json());

// Konfigurasi CORS yang lebih fleksibel
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Metode HTTP yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
  credentials: true, // Jika frontend perlu mengirim cookies atau authorization headers
};

// Middleware CORS
app.use(cors(corsOptions));

// Default Route Handling for Root "/"
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to the API. Use /admin for routes." });
});

// Routes
app.use("/admin", adminRoutes); // Prefix /admin untuk semua rute admin

// 404 - Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Resource not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

export default app;
