import { Router } from "express";
import {
  loginAdmin,
  registerAdmin,
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getOperators,
  deleteOperator,
  updateOperator,
  generateSummaryPDF,
} from "../controllers/adminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Rute Registrasi dan Login Admin
router.post("/register", registerAdmin); // Tambah Admin Baru
router.post("/login", loginAdmin); // Admin Login

// Rute Operator (Petugas)
router.get("/all-operator", authMiddleware, getOperators); // Lihat semua operator/petugas
router.put("/operator/:id", authMiddleware, updateOperator); // Update Operator
router.delete("/operator/:id", authMiddleware, deleteOperator); // Hapus Operator

// Rute Ringkasan dan PDF (STATIC ROUTE)
router.get("/summary", authMiddleware, generateSummaryPDF); // Hasilkan laporan PDF

// Rute CRUD Data Barang
router.post("/", authMiddleware, createItem); // Tambah barang
router.get("/", authMiddleware, getItems); // Lihat semua barang
router.get("/:id", authMiddleware, getItemById); // Ambil item berdasarkan ID
router.put("/:id", authMiddleware, updateItem); // Update barang
router.delete("/:id", authMiddleware, deleteItem); // Hapus barang

export default router;
