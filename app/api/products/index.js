export async function GET() {
  return Response.json({ message: "GET request received!" });
}

export async function POST(req) {
  const data = await req.json();
  return Response.json({ message: "POST request received!", data });
}
