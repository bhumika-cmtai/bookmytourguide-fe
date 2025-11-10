import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the type for the data you send to the API
interface LeadData {
  name: string;
  email: string;
  phone: string;
  category: string;
  subject: string;
  message: string;
}

// Define the shape of this slice's state
interface LeadsState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Set the initial state
const initialState: LeadsState = {
  loading: false,
  error: null,
  success: false,
};

// --- MODIFIED SECTION ---
// Get the base URL from the environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an async thunk for the API call
export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData: LeadData, { rejectWithValue }) => {
    try {
      // Construct the full API endpoint URL
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Return the error message from the backend
        return rejectWithValue(data.message || 'Failed to create lead');
      }

      return data;
    } catch (error: any) {
      // Handle network errors or other exceptions
      return rejectWithValue(error.message || 'Try again!');
    }
  }
);
// --- END OF MODIFIED SECTION ---

// Create the slice
const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    // Synchronous action to reset the state
    resetLeadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  // Handle the different states of the async thunk
  extraReducers: (builder) => {
    builder
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createLead.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createLead.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetLeadState } = leadsSlice.actions;

export default leadsSlice.reducer;