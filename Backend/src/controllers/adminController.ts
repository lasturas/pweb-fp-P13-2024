import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel";
import Item from "../models/itemModel";
import PDFDocument from "pdfkit";

// Register Admin
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    // Cek apakah username sudah ada
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan admin baru
    const newAdmin = new Admin({ username, password: hashedPassword });
    const savedAdmin = await newAdmin.save();

    // Buat JWT token
    const token = jwt.sign(
      { id: savedAdmin._id, username: savedAdmin.username },
      process.env.JWT_SECRET!
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: { id: savedAdmin._id, username: savedAdmin.username },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register admin",
      error: (error as Error).message,
    });
  }
};

// Login Admin
export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

// CRUD Data Barang
// Fungsi Create Item
export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, amount, condition } = req.body;

  // Validasi input
  if (!name || !amount || !condition) {
    res
      .status(400)
      .json({ message: "Name, amount, and condition are required" });
    return;
  }

  try {
    const newItem = new Item({
      name,
      amount,
      condition,
      created_at: new Date(), // Tambahkan created_at dengan nilai default
    });

    const savedItem = await newItem.save();
    res
      .status(201)
      .json({ message: "Item created successfully", data: savedItem });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create item",
      error: (error as Error).message,
    });
  }
};

// Get Item by ID
export const getItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Item retrieved successfully", data: item });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve item",
      error: (error as Error).message,
    });
  }
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find();
    res
      .status(200)
      .json({ message: "Items retrieved successfully", data: items });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve items",
      error: (error as Error).message,
    });
  }
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update item",
      error: (error as Error).message,
    });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete item",
      error: (error as Error).message,
    });
  }
};

// Data Operator
export const getOperators = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const operators = await Admin.find({}, "username");
    res
      .status(200)
      .json({ message: "Operators retrieved successfully", data: operators });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve operators",
      error: (error as Error).message,
    });
  }
};

// Fungsi Generate PDF
export const generateSummaryPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Ambil query params dari request
    const { startDate, endDate, name } = req.query;

    // Filter query untuk MongoDB
    const filter: any = {};
    if (startDate && endDate) {
      filter.created_at = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }
    if (name) {
      const decodedName = decodeURIComponent(name as string);
      filter.name = { $regex: decodedName, $options: "i" }; // Case insensitive
    }

    // Ambil data barang berdasarkan filter
    const items = await Item.find(filter);

    if (items.length === 0) {
      res.status(404).json({ message: "No items found matching the criteria" });
      return;
    }

    // Inisialisasi PDF Document
    const doc = new PDFDocument({ margin: 50, size: "A4" }); // Tambahkan margin
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=filtered_summary.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Judul Laporan
    doc.fontSize(18).text("Laporan Peminjaman", { align: "center" });
    doc.moveDown();

    // Header Tabel
    const tableTop = doc.y + 10;
    const columnWidth = 100; // Lebar kolom
    const tableMargin = 50;

    doc.fontSize(12);
    doc.text("No", tableMargin, tableTop, { width: 30, align: "left" });
    doc.text("Nama Barang", tableMargin + 40, tableTop, {
      width: columnWidth,
      align: "left",
    });
    doc.text("Jumlah", tableMargin + 160, tableTop, {
      width: columnWidth,
      align: "left",
    });
    doc.text("Kondisi", tableMargin + 280, tableTop, {
      width: columnWidth,
      align: "left",
    });
    doc.text("Tanggal Registrasi", tableMargin + 400, tableTop, {
      width: columnWidth,
      align: "left",
    });
    doc.moveDown();

    // Isi Tabel
    let counter = 1;
    let rowY = tableTop + 20;

    items.forEach((item) => {
      doc.text(counter.toString(), tableMargin, rowY, {
        width: 30,
        align: "left",
      });
      doc.text(item.name, tableMargin + 40, rowY, {
        width: columnWidth,
        align: "left",
      });
      doc.text(item.amount.toString(), tableMargin + 160, rowY, {
        width: columnWidth,
        align: "left",
      });
      doc.text(item.condition, tableMargin + 280, rowY, {
        width: columnWidth,
        align: "left",
      });
      doc.text(
        new Date(item.created_at).toLocaleDateString(),
        tableMargin + 400,
        rowY,
        { width: columnWidth, align: "left" }
      );

      rowY += 20; // Tambahkan jarak antar baris
      counter++;
    });

    // Akhiri PDF
    doc.end();
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    res.status(500).json({
      message: "Failed to generate PDF",
      error: (error as Error).message,
    });
  }
};

// Fungsi Hapus Admin/Petugas
export const deleteOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Cek apakah admin dengan ID tersebut ada
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      res.status(404).json({ message: "Operator not found" });
      return;
    }

    res.status(200).json({ message: "Operator deleted successfully" });
  } catch (error) {
    console.error("Failed to delete operator:", error);
    res.status(500).json({
      message: "Failed to delete operator",
      error: (error as Error).message,
    });
  }
};

// Fungsi Update Admin/Petugas
export const updateOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // Validasi input
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    // Update data admin berdasarkan ID
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { username },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      res.status(404).json({ message: "Operator not found" });
      return;
    }

    res.status(200).json({
      message: "Operator updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Failed to update operator:", error);
    res.status(500).json({
      message: "Failed to update operator",
      error: (error as Error).message,
    });
  }
};
