import { NextRequest, NextResponse } from 'next/server';
import UserModel, { IUser } from '@/models/UserModel';
import { connectToDatabase } from '@/lib/mongodb';
import { checkUserRole } from '@/lib/middleware';

// get one user
type TParams = {
    params: Promise<{ userId: string }>
}

export async function GET(request: NextRequest, { params }: TParams) {
    const { userId } = await params;

    const roleCheckResponse = await checkUserRole(request, [1, 2]);
    if (roleCheckResponse) {
        return roleCheckResponse;
    }
    
    await connectToDatabase();
    const user = await UserModel.findById(userId) as IUser;
    return NextResponse.json(user, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: TParams) {
    const { userId } = await params;

    const roleCheckResponse = await checkUserRole(request, [1, 2]);
    if (roleCheckResponse) {
        return roleCheckResponse;
    }
    
    await connectToDatabase();
    const user = await UserModel.findById(userId) as IUser | null;
    if(!user) {
        return NextResponse.json({ message: "User not found!"}, { status: 404 });
    }

    await user.deleteOne();
    return NextResponse.json({ message: "User deleted successfully!"}, { status: 200 });
}
