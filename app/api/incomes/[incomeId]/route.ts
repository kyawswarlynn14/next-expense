import { deleteItem, updateItem } from '@/lib/common';
import { NextRequest } from 'next/server';

type TParams = {
    params: Promise<{ incomeId: string }>
}

const TYPE = "001";

export async function PATCH(request: NextRequest, { params }: TParams) {
    const { incomeId } = await params;
    return await updateItem(request, TYPE, incomeId);
}

export async function DELETE(request: NextRequest, { params }: TParams) {
    const { incomeId } = await params;
    return await deleteItem(request, TYPE, incomeId);
}
