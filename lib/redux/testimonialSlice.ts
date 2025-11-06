// store/slices/testimonialsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "../service/api";

interface Testimonial {
  _id: string;
  name: string;
  message: string;
  rating?: number;
  image?: string;
  position?: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: Testimonial[];
}

interface TestimonialRequest {
  name: string;
  message: string;
  rating?: number;
  image?: string;
  position?: string;
  isVisible?: boolean;
}

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  visible?: boolean;
}

interface TestimonialsState {
  testimonials: Testimonial[];
  currentTestimonial: Testimonial | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  // Action-specific loading states
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  toggling: boolean;
}

const initialState: TestimonialsState = {
  testimonials: [],
  currentTestimonial: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
  creating: false,
  updating: false,
  deleting: false,
  toggling: false,
};

// Async Thunks
export const fetchTestimonials = createAsyncThunk<
  TestimonialResponse,
  QueryParams | undefined,
  { rejectValue: string }
>(
  "testimonials/fetchTestimonials",
  async (params: QueryParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", visible } = params;

      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
      });

      if (visible !== undefined) queryParams.append("visible", String(visible));

      const response = await apiService.get<TestimonialResponse>(
        `/api/testimonials?${queryParams.toString()}`
      );

      const safeResponse: TestimonialResponse = {
        success: response.success ?? true,
        total: Number(response.total ?? 0),
        page: Number(response.page ?? 1),
        totalPages: Number(response.totalPages ?? 1),
        data: Array.isArray(response.data) ? response.data : [],
      };

      return safeResponse;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch testimonials"
      );
    }
  }
);

export const fetchTestimonialById = createAsyncThunk(
  "testimonials/fetchTestimonialById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/api/testimonials/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTestimonial = createAsyncThunk(
  "testimonials/createTestimonial",
  async (testimonialData: TestimonialRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        "/api/testimonials",
        testimonialData
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  "testimonials/updateTestimonial",
  async (
    {
      id,
      testimonial,
    }: { id: string; testimonial: Partial<TestimonialRequest> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.put(
        `/api/testimonials/${id}`,
        testimonial
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  "testimonials/deleteTestimonial",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`/api/testimonials/${id}`);
      return { ...response, id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleTestimonialVisibility = createAsyncThunk(
  "testimonials/toggleTestimonialVisibility",
  async (
    { id, isVisible }: { id: string; isVisible: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.put(`/api/testimonials/${id}`, {
        isVisible,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTestimonial: (state) => {
      state.currentTestimonial = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch testimonial by ID
      .addCase(fetchTestimonialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonialById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestimonial = action.payload.data;
      })
      .addCase(fetchTestimonialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create testimonial
      .addCase(createTestimonial.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.creating = false;
        state.testimonials.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })

      // Update testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.testimonials.findIndex(
          (t) => t._id === action.payload.data._id
        );
        if (index !== -1) {
          state.testimonials[index] = action.payload.data;
        }
        if (state.currentTestimonial?._id === action.payload.data._id) {
          state.currentTestimonial = action.payload.data;
        }
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })

      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.deleting = false;
        state.testimonials = state.testimonials.filter(
          (t) => t._id !== action.payload.id
        );
        state.total = Math.max(0, state.total - 1);
        if (state.currentTestimonial?._id === action.payload.id) {
          state.currentTestimonial = null;
        }
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })

      // Toggle visibility
      .addCase(toggleTestimonialVisibility.pending, (state) => {
        state.toggling = true;
        state.error = null;
      })
      .addCase(toggleTestimonialVisibility.fulfilled, (state, action) => {
        state.toggling = false;
        const index = state.testimonials.findIndex(
          (t) => t._id === action.payload.data._id
        );
        if (index !== -1) {
          state.testimonials[index] = action.payload.data;
        }
        if (state.currentTestimonial?._id === action.payload.data._id) {
          state.currentTestimonial = action.payload.data;
        }
      })
      .addCase(toggleTestimonialVisibility.rejected, (state, action) => {
        state.toggling = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentTestimonial, setCurrentPage } =
  testimonialsSlice.actions;
export default testimonialsSlice.reducer;

// Selectors
export const selectTestimonials = (state: {
  testimonials: TestimonialsState;
}) => state.testimonials.testimonials;
export const selectCurrentTestimonial = (state: {
  testimonials: TestimonialsState;
}) => state.testimonials.currentTestimonial;
export const selectTestimonialsLoading = (state: {
  testimonials: TestimonialsState;
}) => state.testimonials.loading;
export const selectTestimonialsError = (state: {
  testimonials: TestimonialsState;
}) => state.testimonials.error;
export const selectTestimonialsPagination = (state: {
  testimonials: TestimonialsState;
}) => ({
  total: state.testimonials.total,
  page: state.testimonials.page,
  totalPages: state.testimonials.totalPages,
});
export const selectTestimonialsActionStates = (state: {
  testimonials: TestimonialsState;
}) => ({
  creating: state.testimonials.creating,
  updating: state.testimonials.updating,
  deleting: state.testimonials.deleting,
  toggling: state.testimonials.toggling,
});
