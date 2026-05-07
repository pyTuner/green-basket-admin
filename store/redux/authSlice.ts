import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/types/login";

type AuthState = {
  user: IUser | null;
  isLoading: boolean;
  refresh: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  refresh: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefresh: (state, action: PayloadAction<boolean>) => {
      state.refresh = action.payload;
    },
  },
});

export const { setUser, clearUser, setIsLoading, setRefresh } =
  authSlice.actions;
export default authSlice.reducer;

