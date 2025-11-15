import { baseApi } from "../../baseApi";
type TGeoJson = {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
};

type TRequestRideBody = {
      pickupLocation: TGeoJson;
      destinationLocation: TGeoJson;
};
export const rideApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            requestRide: builder.mutation<any, TRequestRideBody>({
                  query: (ridedata) => ({
                        url: '/rides/request',
                        method: "POST",
                        data: ridedata,
                  }),
                  invalidatesTags: ["PendingRides"],
            }),

            getRideHistory: builder.query({
                  query: () => ({
                        url: '/rides/history',
                        method: "GET",
                  }),
                  providesTags: ["RideHistory"],
            }),
            getPendingRides: builder.query({
                  query: () => ({
                        url: '/rides/pending',
                        method: "GET",
                  }),
                  providesTags: ["PendingRides"],
            }),
            acceptRide: builder.mutation({
                  query: (rideid: string) => ({
                        url: `/rides/${rideid}/accept`,
                        method: "PATCH",
                  }),
                  invalidatesTags: ["PendingRides"],
            }),
            updateRideStatus: builder.mutation({
                  query: ({ rideId, status }: { rideId: string; status: string }) => ({
                        url: `/rides/${rideId}/status`,
                        method: "PATCH",
                        data: { status },
                  }),
                  invalidatesTags: ["RideHistory"],
            }),

      })
})
export const { useRequestRideMutation, useGetRideHistoryQuery, useGetPendingRidesQuery, useAcceptRideMutation, useUpdateRideStatusMutation } = rideApi;