import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAuth } from '@/lib/middleware';
import CategoryModel, { ICategory } from '@/models/CategoryModel';

// get all categories
export async function GET(request: NextRequest) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;

    const { searchParams } = new URL(request.url);
    const type: string = searchParams.get('type') || "";

    await connectToDatabase();
    let filterBy: { user: string, type?: string } = { user: userId };
    if(type !== "") {
      filterBy = {
        ...filterBy,
        type,
      }
    }
    const categories = await CategoryModel.find(filterBy).sort({ createdAt: 1 }) as ICategory[] | [];
    return NextResponse.json(categories, { status: 200 });
}

// create category
export async function POST(request: NextRequest) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;

    await connectToDatabase();
    const { title, description, type, t1, t2, t3  } = await request.json() as Partial<ICategory>;
    if (!title || !type) {
      return NextResponse.json({ message: 'Please enter title and type!' }, { status: 400 });
    }
    
    const newCategory = new CategoryModel({ user: userId, title, description, type, t1, t2, t3  });
    await newCategory.save();
    
    return NextResponse.json(
        { message: 'Created category successfully!', category: newCategory }, 
        { status: 201 }
    );
}
