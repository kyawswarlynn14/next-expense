import { NextRequest, NextResponse } from 'next/server';
import UserModel, { IUser } from '@/models/UserModel';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAuth } from '@/lib/middleware';

// get current user
export async function GET(request: NextRequest) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    
    await connectToDatabase();
    const user = await UserModel.findById(userId) as IUser | null;
    if (!user) {
        return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
}