import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAuth } from '@/lib/middleware';
import ItemModel, { IItem } from '@/models/ItemModel';

const TYPE = "001";

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

// get all incomes
export async function GET(request: NextRequest) {
    return await getAllItemsByYear(request, TYPE);
}

// create category
export async function POST(request: NextRequest) {
    return await createItem(request, TYPE);
}
