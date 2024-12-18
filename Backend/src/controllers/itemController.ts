// src/controllers/itemController.ts
import { Request, Response } from "express";
import Item from "../models/itemModel";

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getItemByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.params;
  try {
    const item = await Item.findOne({ name });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
