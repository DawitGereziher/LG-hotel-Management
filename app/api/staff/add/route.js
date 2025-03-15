import connectDB from "../../../utils/db";
import Staff from "../../models/staff";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB(); // Ensure database connection

  try {
    const body = await req.json(); // Correctly extract JSON from request
    const { name, email, role, phone, status } = body;

    // Validate required fields
    if (!name || !email || !role || !phone || !status) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create new staff
    const newStaff = await Staff.create({
      name,
      email,
      role,
      phone,
      status
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Error adding staff:", error.message); // Log error before response
    return NextResponse.json({ error: "Failed to add staff", details: error.message }, { status: 500 });
  }
}
