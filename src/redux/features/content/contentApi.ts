import { baseApi } from "../../baseApi";

export enum ContentType {
  VIDEO = "video",
  POSTER = "poster",
  BOTH = "both",
}

export interface RegularContent {
  _id: string;
  business: string | { _id: string; businessName: string };
  date: string;
  contentType: ContentType;
  postMaterial?: string;
  tags?: string;
  videoMaterial?: string;
  vision?: string;
  posterMaterial?: string;
  comments?: string;
  addedBy: string;
  assignedCD: string;
  assignedCW: string;
  assignedVE?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRegularContentPayload {
  business: string;
  date: string;
  contentType: ContentType;
  postMaterial?: string;
  tags?: string;
  videoMaterial?: string;
  vision?: string;
  posterMaterial?: string;
  comments?: string;
}

export interface UpdateRegularContentPayload {
  business?: string;
  date?: string;
  contentType?: ContentType;
  postMaterial?: string;
  tags?: string;
  videoMaterial?: string;
  vision?: string;
  posterMaterial?: string;
  comments?: string;
  status?: boolean;
}

export interface RegularContentResponse {
  success: boolean;
  message: string;
  data: RegularContent;
}

export interface RegularContentsResponse {
  success: boolean;
  message: string;
  data: RegularContent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RegularContentQueryParams {
  date?: string;
  todayOnly?: string;
  business?: string;
  assignedCD?: string;
  assignedCW?: string;
  assignedVE?: string;
  addedBy?: string;
  status?: string;
  contentType?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRegularContents: builder.query<
      RegularContentsResponse,
      RegularContentQueryParams | void
    >({
      query: (params) => ({
        url: "/regularcontents",
        method: "GET",
        params,
      }),
      providesTags: ["CONTENT"],
    }),
    getRegularContentById: builder.query<RegularContentResponse, string>({
      query: (id) => ({
        url: `/regularcontents/${id}`,
        method: "GET",
      }),
      providesTags: ["CONTENT"],
    }),
    createRegularContent: builder.mutation<
      RegularContentResponse,
      CreateRegularContentPayload
    >({
      query: (data) => ({
        url: "/regularcontents",
        method: "POST",
        data,
      }),
      invalidatesTags: ["CONTENT"],
    }),
    updateRegularContent: builder.mutation<
      RegularContentResponse,
      { id: string; data: UpdateRegularContentPayload }
    >({
      query: ({ id, data }) => ({
        url: `/regularcontents/${id}`,
        method: "PATCH",
        data,
      }),
      onQueryStarted: async ({ id, data }, { dispatch, queryFulfilled }) => {
        // Optimistic update
        const patchResult = dispatch(
          contentApi.util.updateQueryData(
            "getAllRegularContents",
            undefined, // Query arguments
            (draft) => {
              const content = draft.data.find((c) => c._id === id);
              if (content) {
                Object.assign(content, data);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["CONTENT"],
    }),
    deleteRegularContent: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/regularcontents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CONTENT"],
    }),
  }),
});

export const {
  useGetAllRegularContentsQuery,
  useGetRegularContentByIdQuery,
  useCreateRegularContentMutation,
  useUpdateRegularContentMutation,
  useDeleteRegularContentMutation,
} = contentApi;
