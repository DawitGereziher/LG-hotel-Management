import { authenticate } from "../../../middleware/auth";
import connectDB from "../../../utils/db";
import User from "../../models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Authenticate user
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch user data (excluding password)
    const userData = await User.findById(user.userId).select("-passwordHash");
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

