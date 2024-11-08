import { createItem, getAllItemsByYear } from "@/lib/common";
import { NextRequest } from "next/server";

const TYPE = "002";

// get all incomes
export async function GET(request: NextRequest) {
    return await getAllItemsByYear(request, TYPE);
}

// create category
export async function POST(request: NextRequest) {
    return await createItem(request, TYPE);
}