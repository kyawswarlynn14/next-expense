import { connectToDatabase } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

// login
export async function POST(request: NextRequest) {
    await connectToDatabase();
    const { email, password } = await request.json() as Partial<IUser>;
  
    if (!email || !password) {
      return NextResponse.json({ message: 'Please enter both email and password' }, { status: 400 });
    }
  
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid email!' }, { status: 401 });
    }
  
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid password!' }, { status: 401 });
    }
  
    const accessToken = user.signAccessToken();
  
    return NextResponse.json(
        { message: 'Login successful', accessToken, user }, 
        { status: 200 }
    );
}