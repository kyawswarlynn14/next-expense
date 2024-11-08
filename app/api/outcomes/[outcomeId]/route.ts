import { deleteItem, updateItem } from '@/lib/common';
import { NextRequest } from 'next/server';

type TParams = {
    params: Promise<{ outcomeId: string }>
}

const TYPE = "002";

export async function PATCH(request: NextRequest, { params }: TParams) {
    const { outcomeId } = await params;
    return await updateItem(request, TYPE, outcomeId);
}

export async function DELETE(request: NextRequest, { params }: TParams) {
    const { outcomeId } = await params;
    return await deleteItem(request, TYPE, outcomeId);
}
