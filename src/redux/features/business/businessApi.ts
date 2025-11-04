import { baseApi } from "../../baseApi";

export interface Business {
  _id: string;
  businessName: string;
  typeOfBusiness: string;
  country: string;
  package: string;
  entryDate: string;
  contactDetails?: string;
  email?: string;
  address?: string;
  socialMediaLinks?: {
    facebook?: {
      url?: string;
      username?: string;
      password?: string;
    };
    instagram?: {
      url?: string;
      username?: string;
      password?: string;
    };
    whatsApp?: {
      url?: string;
      username?: string;
      password?: string;
    };
    youtube?: {
      url?: string;
      username?: string;
      password?: string;
    };
    website?: string;
    tripAdvisor?: string;
    googleBusiness?: string;
  };
  note?: string;
  tags?: string;
  assignedCW?: string[];
  assignedCD?: string[];
  assignedVE?: string[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessesResponse {
  success: boolean;
  message: string;
  data: Business[];
}

export interface BusinessResponse {
  success: boolean;
  message: string;
  data: Business;
}

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBusinesses: builder.query<BusinessesResponse, void>({
      query: () => ({
        url: "/businesses",
        method: "GET",
      }),
      providesTags: ["BUSINESSES"],
    }),
    getBusinessById: builder.query<BusinessResponse, string>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: "GET",
      }),
      providesTags: ["BUSINESSES"],
    }),
    createBusiness: builder.mutation<BusinessResponse, Partial<Business>>({
      query: (data) => ({
        url: "/businesses",
        method: "POST",
        data,
      }),
      invalidatesTags: ["BUSINESSES"],
    }),
    updateBusiness: builder.mutation<BusinessResponse, { id: string; data: Partial<Business> }>({
      query: ({ id, data }) => ({
        url: `/businesses/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["BUSINESSES"],
    }),
    deleteBusiness: builder.mutation<{ success: boolean; message: string; data: null }, string>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BUSINESSES"],
    }),
  }),
});

export const {
  useGetAllBusinessesQuery,
  useGetBusinessByIdQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} = businessApi;
