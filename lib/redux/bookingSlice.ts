// lib/redux/bookingSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Booking } from "@/lib/data";
import {
  createRazorpayOrder,
  verifyPaymentAndCreateBooking,
  createBooking,
  fetchAllBookings,
  fetchMyBookings,
  fetchGuideBookings,
  fetchBookingById,
  updateBookingStatus,
  cancelAndRefundBooking,
  assignSubstituteGuide,
  deleteBooking,
} from "./thunks/booking/bookingThunks";

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  razorpayOrder: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  razorpayOrder: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createRazorpayOrder.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.razorpayOrder = action.payload;
        }
      )
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPaymentAndCreateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyPaymentAndCreateBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.bookings.unshift(action.payload);
          state.currentBooking = action.payload;
        }
      )
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.bookings.unshift(action.payload);
          state.currentBooking = action.payload;
        }
      )
      .addCase(verifyPaymentAndCreateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGuideBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGuideBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchGuideBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentBooking = null;
      })
      .addCase(
        fetchBookingById.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.currentBooking = action.payload;
        }
      )
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBookingStatus.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          const index = state.bookings.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
          if (state.currentBooking?._id === action.payload._id) {
            state.currentBooking = action.payload;
          }
        }
      )
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelAndRefundBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        cancelAndRefundBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          const index = state.bookings.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
          if (state.currentBooking?._id === action.payload._id) {
            state.currentBooking = action.payload;
          }
        }
      )
      .addCase(cancelAndRefundBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignSubstituteGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        assignSubstituteGuide.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          const index = state.bookings.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
          if (state.currentBooking?._id === action.payload._id) {
            state.currentBooking = action.payload;
          }
        }
      )
      .addCase(assignSubstituteGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.bookings = state.bookings.filter(
            (b) => b._id !== action.payload
          );
          if (state.currentBooking?._id === action.payload) {
            state.currentBooking = null;
          }
        }
      )
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;

export default bookingSlice.reducer;