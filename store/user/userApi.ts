import { TUpdatePasswordReq, TUpdateRoleReq, TUser } from "@/lib/types";
import { apiSlice } from "../apiSlice";
import { userLoggedIn } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		updateUserInfo: builder.mutation<TUser, Partial<TUser>>({
			query: ({ name, email }) => ({
				url: "/users/update-user-info",
				method: "PATCH",
				body: { name, email },
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
					console.log("update user info error >>", error);
				}
			},
		}),

		updateUserPassword: builder.mutation<TUser, TUpdatePasswordReq>(
			{
				query: ({ oldPassword, newPassword }) => ({
					url: "/users/update-user-password",
					method: "PATCH",
					body: { oldPassword, newPassword },
				}),
			}
		),

		getAllUsers: builder.query<TUser[] | [], void>({
			query: () => ({
				url: `/users`,
				method: "GET",
			}),
		}),

		updateUserRole: builder.mutation<TUser, TUpdateRoleReq>({
			query: ({ userId, role }) => ({
				url: "/users/update-user-role",
				method: "PATCH",
				body: { userId, role },
			}),
		}),

		deleteUser: builder.mutation<{ message: string }, string>({
			query: (userId) => ({
				url: `/users/${userId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useUpdateUserInfoMutation,
	useUpdateUserPasswordMutation,
	useUpdateUserRoleMutation,
	useGetAllUsersQuery,
	useDeleteUserMutation,
} = userApi;