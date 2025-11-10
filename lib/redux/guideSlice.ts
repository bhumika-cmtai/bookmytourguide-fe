// lib/redux/guides/guide.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { GuideState } from "@/lib/data";
import {
  getMyGuideProfile,
  updateMyGuideProfile,
  getAllGuides,
  getGuideById,
  toggleGuideApproval,
  deleteGuide,
  updateMyAvailability
} from "@/lib/redux/thunks/guide/guideThunk";
import { verifyPayment } from "@/lib/redux/thunks/admin/subscriptionThunks";

const initialState: GuideState = {
  guides: [],
  currentGuide: null,
  myProfile: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, totalPages: 0 },
};

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

    // Handle Get My Profile
    builder
      .addCase(getMyGuideProfile.pending, setPending)
      .addCase(getMyGuideProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(getMyGuideProfile.rejected, setRejected);

    // Handle Update My Profile
    builder
      .addCase(updateMyGuideProfile.pending, setPending)
      .addCase(updateMyGuideProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(updateMyGuideProfile.rejected, setRejected);
      

    // Handle Get All Guides
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

    // Handle Get Guide By ID
    builder
      .addCase(getGuideById.pending, setPending)
      .addCase(getGuideById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGuide = action.payload;
      })
      .addCase(getGuideById.rejected, setRejected);

    // Handle Toggle Approval
    builder
      .addCase(toggleGuideApproval.pending, setPending)
      .addCase(toggleGuideApproval.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.guides.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) state.guides[index] = action.payload;
        if (state.currentGuide?._id === action.payload._id) {
          state.currentGuide = action.payload;
        }
      })
      .addCase(toggleGuideApproval.rejected, setRejected);

    // Handle Delete Guide
    builder
      .addCase(deleteGuide.pending, setPending)
      .addCase(deleteGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.guides = state.guides.filter((g) => g._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteGuide.rejected, setRejected);

      builder
      .addCase(updateMyAvailability.pending, setPending)
      .addCase(updateMyAvailability.fulfilled, (state, action) => {
        state.loading = false;
        // Update the profile with the data returned from the API
        if (state.myProfile) {
          state.myProfile = action.payload;
        }
      })
      .addCase(updateMyAvailability.rejected, setRejected);
  },
});

export const { clearGuideError, clearGuides } = guideSlice.actions;
export default guideSlice.reducer;