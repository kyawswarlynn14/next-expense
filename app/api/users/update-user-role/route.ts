import { checkUserRole } from "@/lib/middleware";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

type TUpdateUserRoleRequest = {
    userId: string,
    role: number,
}

export async function PATCH(request: NextRequest) {
    const roleCheckResponse = await checkUserRole(request, [1, 2]);
    if (roleCheckResponse) {
        return roleCheckResponse;
    }
    
    await connectToDatabase();
    const { userId, role } = await request.json() as TUpdateUserRoleRequest;
    if (!userId || !role) {
        return NextResponse.json({ message: 'Please enter userId and role!' }, { status: 404 });
    }

    const user = await UserModel.findById(userId).select('+password') as IUser | null;
    if (!user) {
        return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }

    user.role = role;
    const updatedUser = await user.save();
  
    return NextResponse.json(updatedUser, { status: 200 });
}