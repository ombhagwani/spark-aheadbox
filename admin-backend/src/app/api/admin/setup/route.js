    import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    
    const existingAdmin = await Admin.findOne({ username: "om" });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin account already exists!" });
    }

    const hashedPassword = await bcrypt.hash("sparkadmin2026", 10);
    
    await Admin.create({ 
      username: "om", 
      password: hashedPassword 
    });

    return NextResponse.json({ message: "Secure admin created successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}