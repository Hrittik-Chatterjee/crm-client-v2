import { baseApi } from "../../baseApi";

export interface User {
  _id: string;
  username: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  roles?: string[];
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  roles?: string[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersResponse, UserQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.sortBy) queryParams.append("sortBy", params.sortBy);
          if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
          if (params.search) queryParams.append("search", params.search);
          if (params.role) queryParams.append("role", params.role);
        }
        return {
          url: `/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["USERS"],
    }),
    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["USERS"],
    }),
    createUser: builder.mutation<UserResponse, CreateUserPayload>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        data,
      }),
      invalidatesTags: ["USERS"],
    }),
    updateUser: builder.mutation<UserResponse, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USERS"],
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string; data: null }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USERS"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
