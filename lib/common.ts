import { checkAuth } from "@/lib/middleware";
import { connectToDatabase } from "@/lib/mongodb";
import ItemModel, { IItem } from "@/models/ItemModel";
import { NextRequest, NextResponse } from "next/server";

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

export async function getAllItemsByYear(request: NextRequest, type: string) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

    const items = await ItemModel
        .find({
            user: userId,
            type,
            createdAt: { $gte: startDate, $lt: endDate }
        })
        .populate({ path: 'category', select: "title description" })
        .sort({ createdAt: 1 }) as IItem[];

    return NextResponse.json(items, { status: 200 });
}

export async function createItem(request: NextRequest, type: string) {
    const authCheck = await checkAuth(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }
    const userId = authCheck.id;

    await connectToDatabase();
    const { category, title, amount, remark, createdAt, updatedAt, t1, t2, t3 } = await request.json() as Partial<IItem>;
    if (!title || !category || !amount) {
        return NextResponse.json({ message: 'Please enter title, category and amount!' }, { status: 400 });
    }
    const item = await ItemModel.create(
        { user: userId, type, category, title, amount, remark, createdAt, updatedAt, t1, t2, t3 }
    )

    return NextResponse.json(
        { 
            message: `Created ${type === "001" ? 'income' : 'outcome'} successfully!`, 
            [`${type === "001" ? 'income' : 'outcome'}`]: item 
        }, 
        { status: 201 }
    );
}