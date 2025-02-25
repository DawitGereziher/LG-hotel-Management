import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true }, // Unique room number
    type: { type: String, enum: ["single", "double", "suite"], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available" },
    features: [{ type: String }], // E.g., ["WiFi", "TV", "Minibar"]
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
