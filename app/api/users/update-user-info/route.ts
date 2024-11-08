import { checkAuth } from "@/lib/middleware";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    
    await connectToDatabase();
    const { name, email } = await request.json() as Partial<IUser>;

    const user = await UserModel.findById(userId) as IUser | null;
    if (!user) {
        return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }

    if(name) user.name = name;

    if(email && email !== user.email) {
        const isUserExist = await UserModel.findOne({ email }) as IUser | unknown;
        if (isUserExist) {
            return NextResponse.json({ message: 'Email already in user' }, { status: 400 });
        } else {
            user.email = email;
        }
    }
    const updatedUser = await user.save()
  
    return NextResponse.json(updatedUser, { status: 200 });
}