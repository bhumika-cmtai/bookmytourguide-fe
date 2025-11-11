// lib/redux/thunks/booking/bookingThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/service/api";
import { tourGuideBooking as Booking } from "@/lib/data"; // Assuming Booking type is defined in data.ts

// Define the shape of the data needed to create a booking
export interface BookingCreationData {
  guideId: string;
  location: string;
  language: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

// This single thunk handles the entire process:
// 1. Creates the Razorpay order.
// 2. Opens the Razorpay payment modal.
// 3. On success, calls our backend to verify and create the booking document.
export const createAndVerifyBooking = createAsyncThunk<
  Booking, // This is what it returns on success
  BookingCreationData, // This is the input
  { rejectValue: string } // Type for rejection payload
>("booking/createAndVerify", async (bookingData, { rejectWithValue }) => {
  try {
    // Step 1: Create the Razorpay order from our backend
    console.log("Creating Razorpay order for amount:", bookingData.totalPrice);
    const orderResponse = await apiService.post<{ id: string; amount: number }>(
      "/api/tourguide/create-order",
      { totalPrice: bookingData.totalPrice }
    );

    const razorpayOrder = orderResponse.data;
    if (!razorpayOrder || !razorpayOrder.id) {
      return rejectWithValue("Failed to create Razorpay order.");
    }

    // Step 2: Open the Razorpay modal. We wrap this in a Promise.
    return new Promise<Booking>((resolve, reject) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is in your .env.local
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "TourBooker",
        description: `Advance payment for booking with a guide.`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          // Step 3: Payment was successful, now verify with our backend.
          try {
            console.log("Payment successful, verifying with backend...");
            const verificationPayload = {
              ...bookingData,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const finalApiResponse = await apiService.post<Booking>(
              "/api/tourguide/verify-and-create",
              verificationPayload
            );
            
            console.log("Backend verification successful, booking created:", finalApiResponse.data);
            resolve(finalApiResponse.data!); // Resolve the promise with the final booking object
          } catch (error: any) {
            console.error("Backend verification failed:", error);
            reject(error.message || "Failed to verify payment and create booking.");
          }
        },
        prefill: {
          name: bookingData.contactInfo.fullName,
          email: bookingData.contactInfo.email,
          contact: bookingData.contactInfo.phone,
        },
        theme: {
          color: "#0052d4",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed by user.");
            reject("Payment was cancelled.");
          },
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  } catch (error: any) {
    console.error("Error in booking process:", error);
    return rejectWithValue(error.message || "An unknown error occurred during booking.");
  }
});