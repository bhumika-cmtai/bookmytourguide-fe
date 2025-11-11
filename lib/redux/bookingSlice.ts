import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '@/lib/data';
import { createBooking,verifyPaymentAndCreateBooking, fetchBookingById } from '@/lib/redux/thunks/booking/bookingThunks';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload; // Set the newly created booking as current
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPaymentAndCreateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentAndCreateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(verifyPaymentAndCreateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentBooking = null; // Clear previous booking while fetching
      })
      .addCase(fetchBookingById.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.currentBooking = action.payload; // Set the fetched booking as the current one
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;