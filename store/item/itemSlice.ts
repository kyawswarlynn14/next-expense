import { TItem } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
	incomes: TItem[] | [];
	outcomes: TItem[] | [];
	year: number;
}

const initialState: ItemState = {
	incomes: [],
	outcomes: [],
	year: new Date().getFullYear(),
};

const itemSlice = createSlice({
	name: "item",
	initialState,
	reducers: {
		setItems: (
			state,
			action: PayloadAction<{ type: string, items: TItem[] }>
		) => {
            const {type, items} = action.payload;
			if(type === "001") {
				state.incomes = items;
			} else {
				state.outcomes = items;
			}
		},

		setYear: (state, action: PayloadAction<number>) => {
			state.year = action.payload;
		}
	},
});

export const { setItems, setYear } = itemSlice.actions;
export default itemSlice.reducer;