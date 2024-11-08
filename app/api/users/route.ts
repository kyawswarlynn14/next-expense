import { NextRequest, NextResponse } from 'next/server';
import UserModel, { IUser } from '@/models/UserModel';
import { connectToDatabase } from '@/lib/mongodb';
import { checkUserRole } from '@/lib/middleware';

// get all users
export async function GET(request: NextRequest) {
    const roleCheckResponse = await checkUserRole(request, [1, 2]);
    if (roleCheckResponse) {
        return roleCheckResponse;
    }

    await connectToDatabase();
    const users = await UserModel.find({}).sort({ createdAt: -1 }) as IUser[];
    return NextResponse.json(users, { status: 200 });
}
