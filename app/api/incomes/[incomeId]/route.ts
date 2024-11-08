import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAuth } from '@/lib/middleware';
import ItemModel, { IItem } from '@/models/ItemModel';

type TParams = {
    params: { incomeId: string }
}

const TYPE = "001";

export async function updateItem(request: NextRequest, type: string, itemId: string) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    
    await connectToDatabase();
    const { category, title, amount, remark, createdAt, updatedAt, t1, t2, t3 } = await request.json() as Partial<IItem>;

    const item = await ItemModel.findOne({
        _id: itemId,
        user: userId,
    }) as IItem | null;
    if (!item) {
        return NextResponse.json(
            { message: `${type === "001" ? 'income' : 'outcome'} not found!` }, 
            { status: 404 }
        );
    }

    if(category && category !== item.category) item.category = category;
    if(title) item.title = title;
    if(amount) item.amount = amount;
    if(remark) item.remark = remark;
    if(createdAt) item.createdAt = createdAt;
    if(updatedAt) item.updatedAt = updatedAt;
    if(t1) item.t1 = t1;
    if(t2) item.t2 = t2;
    if(t3) item.t3 = t3;

    const updatedItem = await item.save()
  
    return NextResponse.json(updatedItem, { status: 200 });
}

export async function deleteItem(request: NextRequest, type: string, itemId: string) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;
    
    await connectToDatabase();
    const item = await ItemModel.findOne({
        _id: itemId,
        user: userId,
    }) as IItem | null;
    if(!item) {
        return NextResponse.json(
            { message: `${type === "001" ? 'income' : 'outcome'} not found!`}, 
            { status: 404 }
        );
    }

    await item.deleteOne();
    return NextResponse.json(
        { message: `${type === "001" ? 'income' : 'outcome'} is deleted successfully!`}, 
        { status: 200 }
    );
}

export async function PATCH(request: NextRequest, { params }: TParams) {
    const { incomeId } = await params;
    return await updateItem(request, TYPE, incomeId);
}

export async function DELETE(request: NextRequest, { params }: TParams) {
    const { incomeId } = await params;
    return await deleteItem(request, TYPE, incomeId);
}
