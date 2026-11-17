import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 254,
    },
    phone: { type: String, trim: true, maxLength: 30, default: "" },
    subject: { type: String, required: true, trim: true, maxLength: 150 },
    message: { type: String, required: true, trim: true, maxLength: 5000 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);
export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
