import { apiSlice } from "../api/apiSlice";

export const institutionApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["InstitutionAuth", "InstitutionKey"] })
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
      generateSdkKeyInstitution: builder.query<any, any>({
        query: (id) => `sdk-keys/gen/${id}`,
        providesTags: ["InstitutionKey"],
      }),
      getSdkKeyInstitution: builder.query<any, any>({
        query: (id) => `sdk-keys/get/${id}`,
        providesTags: ["InstitutionKey"],
      }),
    }),
  });

export const {
  useGetSdkKeyInstitutionQuery,
  useLazyGetSdkKeyInstitutionQuery,
  useGenerateSdkKeyInstitutionQuery,
  useLazyGenerateSdkKeyInstitutionQuery,
  useLoginInstitutionMutation,
  useRegisterInstitutionMutation,
} = institutionApi;
