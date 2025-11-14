import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: ["USER", "USERS", "BUSINESSES", "TASKS", "CONTENT", "LINKS", "ANALYTICS"],
  endpoints: () => ({}),
});
