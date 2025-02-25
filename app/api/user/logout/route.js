import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the token from cookies (if stored in cookies)
    const response = NextResponse.json({ message: "User logged out successfully" }, { status: 200 });

    // Remove the JWT token (assuming it's stored in a cookie)
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
