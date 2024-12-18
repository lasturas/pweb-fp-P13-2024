import mongoose, { Document, Schema } from "mongoose";

// Tipe data untuk Item
export interface Items extends Document {
  name: string;
  amount: string; // Jika amount ingin tetap berupa string
  condition: string;
  created_at: Date;
}

// Skema Item
const itemSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  condition: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Model Item
const Item = mongoose.model<Items>("Item", itemSchema);

export default Item;
