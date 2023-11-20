import { createSlice } from "@reduxjs/toolkit";
export enum authEnum {
  AUTH_LOCAL_STORAGE_KEY = "auth-key",
  AUTH_USER_KEY = "auth-user",
}
export interface AuthState {
  user: {
    id: number | null;
    name: string | null;
    email: string | null;
    type: string | null;
    publicAddress: string | null;
  };
  accessToken: string | null; // jwt token
}

const user = JSON.parse(
  localStorage.getItem(authEnum.AUTH_USER_KEY) as string
) || {
  id: null,
  name: null,
  email: null,
  type: null,
  publicAddress: null,
};
const accessToken =
  (localStorage.getItem(authEnum.AUTH_LOCAL_STORAGE_KEY) as string) || null;

const initialState: AuthState = {
  user,
  accessToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.token;
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      state.user.type = action.payload.type;
      state.user.publicAddress = action.payload.publicAddress;
      localStorage.setItem(
        authEnum.AUTH_LOCAL_STORAGE_KEY,
        action.payload.token
      );
      localStorage.setItem(authEnum.AUTH_USER_KEY, JSON.stringify(state.user));
    },

    userLoggedOut: () => {
      localStorage.removeItem(authEnum.AUTH_LOCAL_STORAGE_KEY);
      localStorage.removeItem(authEnum.AUTH_USER_KEY);
      return {
        user: {
          id: null,
          name: null,
          email: null,
          type: null,
          publicAddress: null,
        },
        accessToken: null,
      };
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
