import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authEnum } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem(authEnum.AUTH_LOCAL_STORAGE_KEY);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    return result;
  },
  tagTypes: [],
   // @ts-ignore
  endpoints: (builder) => ({}),
});
