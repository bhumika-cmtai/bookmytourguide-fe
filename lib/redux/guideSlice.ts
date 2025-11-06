// lib/redux/guideSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../service/api";
import Image from "next/image";

interface GuideProfile {
  _id: string;
  user: string;
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  state?: string;
  country?: string;
  age?: number;
  languages?: string[];
  experience?: string;
  specializations?: string[];
  availability?: string[];
  hourlyRate?: number;
  description?: string;
  license?: string;
  photo?: string;
  isApproved: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GuideState {
  guides: GuideProfile[];
  currentGuide: GuideProfile | null;
  myProfile: GuideProfile | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

const initialState: GuideState = {
  guides: [],
  currentGuide: null,
  myProfile: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, totalPages: 0 },
};

const handleError = (err: any) =>
  err.response?.data?.message || err.message || "An error occurred";

// --- Thunks ---

// Get own guide profile
export const getMyGuideProfile = createAsyncThunk<GuideProfile, void>(
  "guide/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.get("/api/users/me");
      if (!result.success) return rejectWithValue(result.message);

      const userData = result.data;
      if (userData.role === "guide" && userData.guideProfile) {
        return {
          ...userData.guideProfile,
          user: userData._id,
          email: userData.email,
        };
      }
      return userData;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Update own guide profile
export const updateMyGuideProfile = createAsyncThunk<GuideProfile, FormData>(
  "guide/updateMyProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await apiService.put("/api/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!result.success) {
        return rejectWithValue(result.message || "Failed to update profile");
      }

      return result.data.guideProfile;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Get all guides (Admin only)
export const getAllGuides = createAsyncThunk<
  { data: GuideProfile[]; total: number; page: number; totalPages: number },
  | { page?: number; limit?: number; search?: string; approved?: boolean }
  | undefined
>("guide/getAllGuides", async (params = {}, { rejectWithValue }) => {
  try {
    const result = await apiService.get("/api/users/guides/all", { params });
    if (!result.success) return rejectWithValue(result.message);
    return {
      data: result.data || [],
      total: result.count || 0,
      page: 1,
      totalPages: 1,
    };
  } catch (err: any) {
    return rejectWithValue(handleError(err));
  }
});

// Get guide by ID (Admin only)
export const getGuideById = createAsyncThunk<GuideProfile, string>(
  "guide/getGuideById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await apiService.get(`/api/guides/${id}`);
      if (!result.success) return rejectWithValue(result.message);
      return result.data;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Toggle guide approval (Admin only)
export const toggleGuideApproval = createAsyncThunk<
  GuideProfile,
  { id: string; isApproved: boolean }
>("guide/toggleApproval", async ({ id, isApproved }, { rejectWithValue }) => {
  try {
    const result = await apiService.patch(`/api/users/guides/${id}/approve`, {
      isApproved,
    });
    if (!result.success) return rejectWithValue(result.message);

    return result.data;
  } catch (err: any) {
    return rejectWithValue(handleError(err));
  }
});

// Delete guide (Admin only)
export const deleteGuide = createAsyncThunk<string, string>(
  "guide/deleteGuide",
  async (id, { rejectWithValue }) => {
    try {
      const result = await apiService.delete(`/api/guides/${id}`);
      if (!result.success) return rejectWithValue(result.message);
      return id;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// --- Slice ---
const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    clearGuideError: (state) => {
      state.error = null;
    },
    clearGuides: (state) => {
      state.guides = [];
      state.pagination = { total: 0, page: 1, totalPages: 0 };
    },
  },
  extraReducers: (builder) => {
    const setPending = (state: GuideState) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state: GuideState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    // Get My Profile
    builder
      .addCase(getMyGuideProfile.pending, setPending)
      .addCase(getMyGuideProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(getMyGuideProfile.rejected, setRejected);

    // Update My Profile
    builder
      .addCase(updateMyGuideProfile.pending, setPending)
      .addCase(updateMyGuideProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(updateMyGuideProfile.rejected, setRejected);

    // Get All Guides
    builder
      .addCase(getAllGuides.pending, setPending)
      .addCase(getAllGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.guides = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(getAllGuides.rejected, setRejected);

    // Get Guide By ID
    builder
      .addCase(getGuideById.pending, setPending)
      .addCase(getGuideById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGuide = action.payload;
      })
      .addCase(getGuideById.rejected, setRejected);

    // Toggle Approval
    builder
      .addCase(toggleGuideApproval.pending, setPending)
      .addCase(toggleGuideApproval.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.guides.findIndex(
          (g) => g._id === action.payload._id
        );
        if (index !== -1) state.guides[index] = action.payload;
        if (state.currentGuide?._id === action.payload._id) {
          state.currentGuide = action.payload;
        }
      })
      .addCase(toggleGuideApproval.rejected, setRejected);

    // Delete Guide
    builder
      .addCase(deleteGuide.pending, setPending)
      .addCase(deleteGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.guides = state.guides.filter((g) => g._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteGuide.rejected, setRejected);
  },
});

export const { clearGuideError, clearGuides } = guideSlice.actions;
export default guideSlice.reducer;
