import mongoose from "mongoose";

const borrowItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  amount: { type: Number, required: true },
  borrow_date: { type: Date, default: Date.now },
  return_date: { type: Date, required: true },
  borrower_name: { type: String, required: true },
  officer_name: { type: String, required: true },
});

const BorrowItem = mongoose.model("BorrowItem", borrowItemSchema);

export default BorrowItem;
