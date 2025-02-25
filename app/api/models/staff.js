import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "receptionist", "housekeeping"], required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
