import { baseApi } from "../../baseApi";

export const driverApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateDriverLocation: builder.mutation({
                  query: (locationData) => ({
                        url: '/drivers/me/location',
                        method: "PATCH",
                        data: locationData,
                  }),
                  invalidatesTags: ["PendingRides"],
            }),

            updateDriverAvailability: builder.mutation({
                  query: (data) => ({
                        url: '/drivers/me/availability',
                        method: "POST",
                        data: data,
                  }),
                  invalidatesTags: ["PendingRides"],
            }),
            applyToBeDriver: builder.mutation({
                  query: (applicationData) => ({
                        url: "/drivers/apply",
                        method: "POST",
                        data: applicationData,
                  }),
                  // Application korar por user info refetch kora dorkar hote pare
                  invalidatesTags: ["USER"],
            }),

            getDriverEarnings: builder.query<{
                  rides: unknown[]; // Ekhon 'unknown' rakha holo, pore specific type dewa jabe
                  totalEarnings: number;
            }, void>({
                  query: () => ({
                        url: "/drivers/me/earnings",
                        method: "GET",
                  }),
                  providesTags: ["RideHistory"], // Earning changes when history changes
            }),

      })
})
export const { useUpdateDriverAvailabilityMutation, useUpdateDriverLocationMutation, useGetDriverEarningsQuery, useApplyToBeDriverMutation } = driverApi; 