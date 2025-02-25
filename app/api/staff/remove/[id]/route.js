import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Staff from "../../models/staff";
import { authenticate } from "../../../middleware/auth";

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // ✅ Get staff ID from request URL

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    // Authenticate admin before proceeding
    const isAdmin = await authenticate(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: access denied" }, { status: 403 });
    }

    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Staff removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Remove staff error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
