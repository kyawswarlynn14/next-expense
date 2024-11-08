import { TCreateItemRes, TItem, TItemReq } from "@/lib/types";
import { apiSlice } from "../apiSlice";
import { setItems } from "./itemSlice";

export const itemApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createItem: builder.mutation<TCreateItemRes, TItemReq>({
			query: ({ type, item }) => ({
				url: type === "001" ? "/incomes" : "/outcomes",
				method: "POST",
				body: item,
			}),
		}),

        updateItem: builder.mutation<TItem, TItemReq>({
			query: ({ type, id, item }) => ({
				url: `/${type === "001" ? 'incomes' : 'outcomes'}/${id}`,
				method: "PATCH",
				body: item,
			}),
		}),

        deleteItem: builder.mutation<{ message: string }, {type: string, id: string}>({
			query: ({ type, id }) => ({
				url: `/${type === "001" ? 'incomes' : 'outcomes'}/${id}`,
				method: "DELETE",
			}),
		}),

        getItems: builder.query<TItem[], { type: string, year: number }>({
			query: ({ type, year }) => ({
				url: `/${type === "001" ? "incomes" : "outcomes"}?year=${year}`,
				method: "GET",
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						setItems({
                            type: arg.type,
							items: result.data,
						})
					);
				} catch (error) {
					console.log("get income categoreis error >>", error);
				}
			},
		}),
	}),
});

export const { useCreateItemMutation, useUpdateItemMutation, useDeleteItemMutation, useGetItemsQuery } = itemApi;