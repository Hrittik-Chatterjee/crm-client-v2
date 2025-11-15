import { baseApi } from "../../baseApi";
import type { DashboardStats, DashboardStatsResponse } from "@/types";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/analytics/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["ANALYTICS"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = analyticsApi;
