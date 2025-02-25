import connectDB from "../../../utils/db";
import Staff from "../../models/Staff";
import { authenticate } from "../../../middleware/auth";
import { NextResponse } from "next/server";



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Staff from "@/models/Staff"; // Adjust path based on your project structure
import dbConnect from "@/utils/dbConnect"; // Ensure you have a database connection utility

export async function POST(req) {
  await dbConnect(); // Ensure database connection

  try {
    const { name, email, password, role, phone } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
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
      password, // Consider hashing passwords for security
      role,
      phone,
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add staff", details: error.message }, { status: 500 });
  }
}
