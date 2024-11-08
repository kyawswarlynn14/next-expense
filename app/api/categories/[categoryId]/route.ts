import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAuth } from '@/lib/middleware';
import CategoryModel, { ICategory } from '@/models/CategoryModel';

type TParams = {
    params: { categoryId: string }
}

export async function PATCH(request: NextRequest, { params }: TParams) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    const { categoryId } = await params;
    
    await connectToDatabase();
    const { title, description, type, t1, t2, t3  } = await request.json() as Partial<ICategory>;

    const category = await CategoryModel.findOne({
        _id: categoryId,
        user: userId,
    }) as ICategory | null;
    if (!category) {
        return NextResponse.json({ message: 'Category not found!' }, { status: 404 });
    }

    if(title) category.title = title;
    if(description) category.description = description;
    if(type) category.type = type;
    if(t1) category.t1 = t1;
    if(t2) category.t2 = t2;
    if(t3) category.t3 = t3;

    const updatedCategory = await category.save()
  
    return NextResponse.json(updatedCategory, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: TParams) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    const { categoryId } = await params;
    
    await connectToDatabase();
    const category = await CategoryModel.findOne({
        _id: categoryId,
        user: userId,
    }) as ICategory | null;
    if(!category) {
        return NextResponse.json({ message: "Category not found!"}, { status: 404 });
    }

    await category.deleteOne();
    return NextResponse.json({ message: "Category deleted successfully!"}, { status: 200 });
}
