import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import Staff from "../../models/staff";
import { authenticateAdmin } from "../../../middleware/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Extract `id` from route parameters
    const { id } = params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: "Invalid staff ID format" }, { status: 400 });
    }

    // Authenticate admin user
    const isAuthenticated = await authenticateAdmin(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch staff and exclude password
    const staff = await Staff.findById(id).select("-password");
    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    console.error("Fetch staff error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
