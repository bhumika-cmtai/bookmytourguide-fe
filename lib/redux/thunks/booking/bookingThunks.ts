import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/service/api'; // Your configured apiService
import { Booking } from '@/lib/data'; // You'll need to define this type

interface CreateBookingData {
  tourId: string;
  guideId: string;
  startDate: string;
  endDate: string;
  numberOfTourists: number;
  paymentId: string; // A mock payment ID for now
}

interface VerifyPaymentData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    // Booking details
    tourId: string;
    guideId: string;
    startDate: string;
    endDate: string;
    numberOfTourists: number;
  }

export const createBooking = createAsyncThunk<Booking, CreateBookingData>(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: Booking }>('/api/bookings/create', bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);


export const verifyPaymentAndCreateBooking = createAsyncThunk<Booking, VerifyPaymentData>(
    'bookings/verifyAndCreate',
    async (verificationData, { rejectWithValue }) => {
      try {
        // The API call now goes to our new verification endpoint
        const response = await apiService.post<{ data: Booking }>('/api/bookings/verify', verificationData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
      }
    }
  );