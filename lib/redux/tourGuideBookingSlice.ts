// lib/redux/bookingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tourGuideBooking as Booking } from '@/lib/data';
import { createAndVerifyBooking } from '@/lib/redux/thunks/tourGuideBooking/tourGuideBookingThunk';

interface BookingState {
  loading: boolean;
  error: string | null;
  latestBooking: Booking | null; // To store the successfully created booking
}

const initialState: BookingState = {
  loading: false,
  error: null,
  latestBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingState: (state) => {
      state.loading = false;
      state.error = null;
      state.latestBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAndVerifyBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.latestBooking = null;
      })
      .addCase(createAndVerifyBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.latestBooking = action.payload;
      })
      .addCase(createAndVerifyBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;