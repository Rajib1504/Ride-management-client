import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { axiosInstance } from '@/lib/axios';
export const baseApi = createApi({
      reducerPath: "baseApi",
      // baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1" }),
      baseQuery: axiosBaseQuery(),
      tagTypes: ["USER"],
      endpoints: () => ({})
})

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
      // Do something before request is sent
      return config;
}, function (error) {
      // Do something with request error
      return Promise.reject(error);
},
);

// Add a response interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
}, function onRejected(error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
});
