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


      })
})
export const { useUpdateDriverAvailabilityMutation, useUpdateDriverLocationMutation } = driverApi; 