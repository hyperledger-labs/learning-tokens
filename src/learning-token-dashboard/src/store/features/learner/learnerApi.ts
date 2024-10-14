import { apiSlice } from "../api/apiSlice";

export const learnerApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["learnerAuth"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      loginLearner: builder.mutation<any, any>({
        query: (body) => ({
          url: "/auth/learner-login",
          method: "POST",
          body,
        }),
        invalidatesTags: ["learnerAuth"],
      }),
      registerLearner: builder.mutation<any, any>({
        query: (body) => ({
          url: "/auth/learner-register",
          method: "POST",
          body,
        }),
        invalidatesTags: ["learnerAuth"],
      }),
    }),
  });

export const { useLoginLearnerMutation, useRegisterLearnerMutation } =
  learnerApi;
