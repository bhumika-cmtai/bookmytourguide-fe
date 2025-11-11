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
      // --- Create Razorpay Order ---
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createRazorpayOrder.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log("Redux: Razorpay order created", action.payload);
          state.loading = false;
          state.razorpayOrder = action.payload;
        }
      )
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        console.error("Redux: Razorpay order failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Create Booking ---
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
          console.log(
            "Redux: Payment verified & booking created",
            action.payload
          );
          state.loading = false;
          state.bookings.unshift(action.payload);
          state.currentBooking = action.payload;
        }
      )
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          console.log("Redux: Booking created", action.payload);
          state.loading = false;
          state.bookings.unshift(action.payload);
          state.currentBooking = action.payload;
        }
      )
      .addCase(verifyPaymentAndCreateBooking.rejected, (state, action) => {
        console.error("Redux: Payment verification failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.rejected, (state, action) => {
        console.error("Redux: Booking creation failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Fetch All Bookings ---
      .addCase(fetchAllBookings.pending, (state) => {
        console.log("Redux: Fetching all bookings...");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          console.log("Redux: All bookings fetched", action.payload);
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchAllBookings.rejected, (state, action) => {
        console.error("Redux: Fetch all bookings failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Fetch My Bookings ---
      .addCase(fetchMyBookings.pending, (state) => {
        console.log("Redux: Fetching my bookings...");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          console.log("Redux: My bookings received:", action.payload);
          console.log("Redux: Number of bookings:", action.payload.length);
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchMyBookings.rejected, (state, action) => {
        console.error("Redux: Fetch my bookings failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Fetch Guide Bookings ---
      .addCase(fetchGuideBookings.pending, (state) => {
        console.log("Redux: Fetching guide bookings...");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGuideBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          console.log("Redux: Guide bookings fetched", action.payload);
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchGuideBookings.rejected, (state, action) => {
        console.error("Redux: Fetch guide bookings failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Fetch Single Booking By ID ---
      .addCase(fetchBookingById.pending, (state) => {
        console.log("Redux: Fetching booking by ID...");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBookingById.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          console.log("Redux: Booking by ID fetched", action.payload);
          state.loading = false;
          state.currentBooking = action.payload;
        }
      )
      .addCase(fetchBookingById.rejected, (state, action) => {
        console.error("Redux: Fetch booking by ID failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Update Booking Status ---
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBookingStatus.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          console.log("Redux: Booking status updated", action.payload);
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
        console.error("Redux: Update booking status failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Delete Booking ---
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<string>) => {
          console.log("Redux: Booking deleted", action.payload);
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
        console.error("Redux: Delete booking failed", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
