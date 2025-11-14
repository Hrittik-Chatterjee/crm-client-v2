import { baseApi } from "../../baseApi";

export interface DashboardStats {
  overview: {
    totalBusinesses: number;
    totalUsers: number;
    recentBusinesses: number;
  };
  businessesByCountry: Array<{ country: string; count: number }>;
  businessesByPackage: Array<{ package: string; count: number }>;
  businessesByType: Array<{ type: string; count: number }>;
  usersByRole: Array<{ role: string; count: number }>;
  businessGrowth: Array<{ year: number; month: number; count: number }>;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

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
