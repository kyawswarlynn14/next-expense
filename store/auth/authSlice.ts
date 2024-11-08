import { TUser } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
	token?: string;
	user: TUser | null;
}

const initialState: AuthState = {
	token: "",
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		userLoggedIn: (
			state,
			action: PayloadAction<{ accessToken?: string; user: TUser }>
		) => {
			const { accessToken, user } = action.payload;
			if (accessToken) {
				Cookies.set("token", accessToken);
			}
			state.token = accessToken || "";
			state.user = user;
		},
		userLoggedOut: (state) => {
			Cookies.remove("token");
			state.token = "";
			state.user = null;
		},
	},
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;