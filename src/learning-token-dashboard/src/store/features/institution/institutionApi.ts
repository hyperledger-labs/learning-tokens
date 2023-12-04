import { apiSlice } from "../api/apiSlice";

export const institutionApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["InstitutionAuth"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      loginInstitution: builder.mutation<any, any>({
        query: (body) => ({
          url: "/auth/institution-login",
          method: "POST",
          body,
        }),
        invalidatesTags: ["InstitutionAuth"],
      }),
      registerInstitution: builder.mutation<any, any>({
        query: (body) => ({
          url: "/auth/institution-register",
          method: "POST",
          body,
        }),
        invalidatesTags: ["InstitutionAuth"],
      }),
    }),
  });

export const { useLoginInstitutionMutation, useRegisterInstitutionMutation } =
  institutionApi;
