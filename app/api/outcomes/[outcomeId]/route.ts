import { NextRequest } from 'next/server';
import { deleteItem, updateItem } from '../../incomes/[incomeId]/route';

type TParams = {
    params: { outcomeId: string }
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
