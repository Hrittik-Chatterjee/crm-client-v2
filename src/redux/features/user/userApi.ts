import { baseApi } from "../../baseApi";

export interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["USERS"],
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
