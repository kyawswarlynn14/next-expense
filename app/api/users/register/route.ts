import { connectToDatabase } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

// register
export async function POST(request: NextRequest) {
    await connectToDatabase();
    const { name, email, password } = await request.json() as Partial<IUser>;
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please enter all fields!' }, { status: 400 });
    }
  
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already in use!' }, { status: 409 });
    }
    
    const newUser = new UserModel({ name, email, password });
    await newUser.save();
    
    return NextResponse.json(
        { message: 'Registered successfully!', user: newUser }, 
        { status: 201 }
    );
}