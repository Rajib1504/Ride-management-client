import { baseApi } from "../../baseApi";

type TUser = {
      _id: string;
      name: string;
      email: string;
      role: "Admin" | "Driver" | "Rider";
      status: "ACTIVE" | "BLOCK" | "INACTIVE";
};

type TUpdateStatusBody = {
      status: "ACTIVE" | "BLOCK" | "INACTIVE";
};

type TDriverApplication = {
      _id: string;
      user: Pick<TUser, "name" | "email">;
      licenseNumber: string;
      licenseImage: string;
      vehicleDetails: {
            type: string;
            model: string;
            plateNumber: string;
      };
      approvalStatus: string;
};

export const adminApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
            getAllUsers: builder.query<TUser[], void>({
                  query: () => ({
                        url: "/user/all-users",
                        method: "GET",
                  }),
                  providesTags: ["AllUsers"],
            }),

            updateUserStatus: builder.mutation<TUser, { id: string; body: TUpdateStatusBody }>({
                  query: ({ id, body }) => ({
                        url: `/admin/users/${id}/status`,
                        method: "PATCH",
                        data: body,
                  }),

                  invalidatesTags: ["AllUsers"],
            }),

            getDriverApplications: builder.query<{ data: TDriverApplication[] }, void>({
                  query: () => ({
                        url: "/admin/driver-applications",
                        method: "GET",
                  }),
                  providesTags: ["DriverApplications"],
            }),

            approveDriverApplication: builder.mutation({
                  query: (id) => ({
                        url: `/admin/driver-applications/${id}/approve`,
                        method: "PATCH",
                  }),
                  invalidatesTags: ["DriverApplications", "AllUsers"],
            }),

            rejectDriverApplication: builder.mutation({
                  query: (id) => ({
                        url: `/admin/driver-applications/${id}/reject`,
                        method: "PATCH",
                  }),
                  invalidatesTags: ["DriverApplications"],
            }),

      }),
});

export const { useGetAllUsersQuery, useUpdateUserStatusMutation,useGetDriverApplicationsQuery,
  useApproveDriverApplicationMutation,
  useRejectDriverApplicationMutation, } = adminApi;