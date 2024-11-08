import { TCategory } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
	incomeCategories: TCategory[] | [];
	outcomeCategories: TCategory[] | [];
}

const initialState: CategoryState = {
	incomeCategories: [],
	outcomeCategories: [],
};

const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		setCategories: (
			state,
			action: PayloadAction<{ type: string, categories: TCategory[]}>
		) => {
            const { type, categories } = action.payload;
            if(type === "001") {
                state.incomeCategories = categories;
            } else if (type === "002") {
                state.outcomeCategories = categories;
            }
		},
	},
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;