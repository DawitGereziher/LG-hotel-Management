import jwt from "jsonwebtoken";

export async function authenticate(req) {
  const token = req.headers.get("authorization")?.split(" ")[1]; 

  if (!token) {
    return { success: false, error: "Unauthorized: No token provided" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, error: "Unauthorized: Invalid token" };
  }
}
