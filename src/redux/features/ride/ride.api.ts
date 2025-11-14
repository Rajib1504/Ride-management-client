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
            requestride: builder.mutation<any, TRequestRideBody>({
                  query: (ridedata) => ({
                        url: '/rides/request',
                        method: "POST",
                        data: ridedata,
                  })
            }),
            
            getRideHistory: builder.query({
                  query: () => ({
                        url: '/rides/history',
                        method: "GET",
                  }),
                  providesTags:["RideHistory"],
            }),

      })
})
export const {useRequestrideMutation,useGetRideHistoryQuery} = rideApi;