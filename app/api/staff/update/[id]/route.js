import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Staff from "../../models/staff";
import { authenticate } from "../../../middleware/auth";

export async function PUT(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // ✅ Get ID from request URL

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    const updates = await req.json(); // ✅ Parse request body

    if (updates.password) {
      return NextResponse.json({ error: "Password updates are not allowed here" }, { status: 400 });
    }

    // Authenticate admin before proceeding
    const isAdmin = await authenticate(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: access denied" }, { status: 403 });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, updates, { new: true }).select("-password");

    if (!updatedStaff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Staff updated successfully", staff: updatedStaff }, { status: 200 });
  } catch (error) {
    console.error("Update staff error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
