import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/service/api";
import { GuideProfile } from "@/lib/data";

// This helper function remains the same.
const handleError = (err: any) =>
  err.response?.data?.message || err.message || "An error occurred";

// --- Thunks (Refactored to match locationThunk style) ---

// Get own guide profile
export const getMyGuideProfile = createAsyncThunk<GuideProfile, void>(
  "guide/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Style matched: Explicitly type the expected response data
      const response = await apiService.get<GuideProfile>("/api/guides/profile");
      // Style matched: Return the 'data' property directly
      return response.data!; // Using '!' to assert data is not null, as in locationThunk
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
      // Style matched: Explicitly type the expected response data
      const response = await apiService.put<GuideProfile>(
        "/api/guides/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Style matched: Return the 'data' property directly
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Get all guides (Admin only)
// This thunk returns a more complex object for pagination
export const getAllGuides = createAsyncThunk<
  { data: GuideProfile[]; total: number; page: number; totalPages: number },
  { zzpage?: number; limit?: number; search?: string; approved?: boolean } | undefined
>("guide/getAllGuides", async (params = {}, { rejectWithValue }) => {
  try {
    // Style matched: The response itself contains the pagination data alongside the data array
    const response = await apiService.get<{
      data: GuideProfile[];
      total: number;
      page: number;
      totalPages: number;
    }>("/api/users/guides/all", { params });

    // The entire response object matches the expected return type
    return response;
  } catch (err: any) {
    return rejectWithValue(handleError(err));
  }
});

// Get guide by ID (Admin only)
export const getGuideById = createAsyncThunk<GuideProfile, string>(
  "guide/getGuideById",
  async (id, { rejectWithValue }) => {
    try {
      // Style matched
      const response = await apiService.get<GuideProfile>(`/api/guides/${id}`);
      return response.data!;
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
    // Note: Corrected path to match other guide routes for consistency
    const response = await apiService.patch<GuideProfile>(
      `/api/guides/${id}/approve`, // Assuming this route exists under /api/guides
      { isApproved }
    );
    return response.data!;
  } catch (err: any) {
    return rejectWithValue(handleError(err));
  }
});

// Delete guide (Admin only)
export const deleteGuide = createAsyncThunk<string, string>(
  "guide/deleteGuide",
  async (id, { rejectWithValue }) => {
    try {
      // Style matched: The API call itself is the action
      await apiService.delete(`/api/guides/${id}`);
      // On successful deletion, return the ID to the reducer
      return id;
    } catch (err: any)      {
      return rejectWithValue(handleError(err));
    }
  }
);

export const updateMyAvailability = createAsyncThunk<
  GuideProfile, // Returns the updated guide profile
  { unavailableDates: string[] } // Accepts an object with the unavailable dates
>("guide/updateMyAvailability", async ({ unavailableDates }, { rejectWithValue }) => {
  try {
    const response = await apiService.put<GuideProfile>(
      "/api/guides/availability",
      { unavailableDates }
    );
    return response.data!;
  } catch (err: any) {
    return rejectWithValue(handleError(err));
  }
});
