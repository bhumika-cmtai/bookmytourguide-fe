// lib/redux/thunks/booking/bookingThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/service/api";
import {
  Booking,
  CreateRazorpayOrderData,
  UpdateBookingStatusData,
} from "@/lib/data";

// --- INTERFACES FOR THUNK PAYLOADS ---

interface CreateBookingData {
  tourId: string;
  guideId: string;
  startDate: string;
  endDate: string;
  numberOfTourists: number;
  paymentId: string;
}

interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  tourId: string;
  guideId: string;
  startDate: string;
  endDate: string;
  numberOfTourists: number;
}

// --- ASYNC THUNKS ---

export const createRazorpayOrder = createAsyncThunk<
  any,
  CreateRazorpayOrderData
>("bookings/createRazorpayOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await apiService.post<{ data: any }>(
      `/api/bookings/create-order`,
      orderData
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create Razorpay order"
    );
  }
});

export const verifyPaymentAndCreateBooking = createAsyncThunk<
  Booking,
  VerifyPaymentData
>("bookings/verifyAndCreate", async (verificationData, { rejectWithValue }) => {
  try {
    const response = await apiService.post<{ data: Booking }>(
      "/api/bookings/verify",
      verificationData
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Payment verification failed"
    );
  }
});

export const createBooking = createAsyncThunk<Booking, CreateBookingData>(
  "bookings/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: Booking }>(
        "/api/bookings/create",
        bookingData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const fetchAllBookings = createAsyncThunk<Booking[]>(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: Booking[] }>(
        "/api/bookings"
      );
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const fetchMyBookings = createAsyncThunk<Booking[]>(
  "bookings/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: Booking[] }>(
        "/api/bookings/my-bookings"
      );
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your bookings"
      );
    }
  }
);

export const fetchGuideBookings = createAsyncThunk<Booking[]>(
  "bookings/fetchForGuide",
  async (_, { rejectWithValue }) => {
    try {
      // --- YEH LINE THEEK KI GAYI HAI ---
      // Ab hum naye aur sahi endpoint ko call kar rahe hain
      const response = await apiService.get<{ data: Booking[] }>(
        `/api/bookings/guide-bookings`
      );
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch guide bookings"
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk<Booking, string>(
  "bookings/fetchById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: Booking }>(
        `/api/bookings/${bookingId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking details"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk<
  Booking,
  UpdateBookingStatusData
>(
  "bookings/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await apiService.patch<{ data: Booking }>(
        `/api/bookings/${bookingId}/status`,
        { status }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  }
);

export const deleteBooking = createAsyncThunk<string, string>(
  "bookings/delete",
  async (bookingId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/api/bookings/${bookingId}`);
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete booking"
      );
    }
  }
);
