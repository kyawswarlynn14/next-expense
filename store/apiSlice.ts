import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { userLoggedIn } from "./auth/authSlice";
import { TUser } from "@/lib/types";

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: '/api',
		prepareHeaders: (headers) => {
			const token = Cookies.get("token");
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		loadUser: builder.query<TUser, void>({
			query: () => ({
				url: `/users/me`,
				method: "GET",
			}),
			async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						userLoggedIn({
							user: result.data,
						})
					);
				} catch (error) {
					console.log("load user error >>", error);
				}
			},
		}),
	}),
});

export const { useLoadUserQuery } = apiSlice;