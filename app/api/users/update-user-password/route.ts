import { checkAuth } from "@/lib/middleware";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

type TUpdatePasswordRequest = {
    oldPassword: string,
    newPassword: string,
}

export async function PATCH(request: NextRequest) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    
    await connectToDatabase();
    const { oldPassword, newPassword } = await request.json() as TUpdatePasswordRequest;
    if (!oldPassword || !newPassword) {
        return NextResponse.json({ message: 'Please enter old and new password!' }, { status: 404 });
    }

    const user = await UserModel.findById(userId).select('+password') as IUser | null;
    if (!user) {
        return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid password!' }, { status: 401 });
    }
    user.password = newPassword;
    const updatedUser = await user.save();
  
    return NextResponse.json(updatedUser, { status: 200 });
}