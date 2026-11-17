import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, min: 0 },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    weightOptions: { type: [String], default: [] },
  },
  { timestamps: true },
);
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
