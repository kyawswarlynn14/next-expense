import { TCategory, TCreateCategoryRes } from "@/lib/types";
import { apiSlice } from "../apiSlice";
import { setCategories } from "./categorySlice";

export const categoryApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createCategory: builder.mutation<TCreateCategoryRes, Partial<TCategory>>({
			query: ({ title, description, type }) => ({
				url: "/categories",
				method: "POST",
				body: { title, description, type },
			}),
		}),

        updateCategory: builder.mutation<TCategory, Partial<TCategory>>({
			query: ({ _id, title, description, type }) => ({
				url: `/categories/${_id}`,
				method: "PATCH",
				body: { title, description, type },
			}),
		}),

        deleteCategory: builder.mutation<{ message: string }, string>({
			query: (categoryId) => ({
				url: `/categories/${categoryId}`,
				method: "DELETE",
			}),
		}),

        getCategoreis: builder.query<TCategory[], string>({
			query: (type) => ({
				url: `/categories?type=${type}`,
				method: "GET",
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						setCategories({
                            type: arg,
							categories: result.data,
						})
					);
				} catch (error) {
					console.log("get categoreis error >>", error);
				}
			},
		}),
	}),
});

export const { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetCategoreisQuery } = categoryApi;