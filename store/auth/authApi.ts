import { TLoginRes, TRegisterRes, TUser } from "@/lib/types";
import { apiSlice } from "../apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation<TRegisterRes, Partial<TUser>>({
			query: ({ name, email, password }) => ({
				url: "/users/register",
				method: "POST",
				body: { name, email, password },
			}),
		}),

		login: builder.mutation<TLoginRes, Partial<TUser>>({
			query: ({ email, password }) => ({
				url: "/users/login",
				method: "POST",
				body: { email, password },
			}),
			async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						userLoggedIn({
							accessToken: result.data.accessToken,
							user: result.data.user,
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
	}),
});

export const { useRegisterMutation, useLoginMutation } = authApi;