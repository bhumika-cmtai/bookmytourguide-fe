// store/thunks/admin/subscriptionThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/service/api';
import { SubscriptionPlan, CreateSubscriptionPlan } from '@/types/admin';

const API_BASE_URL = '/api/subscriptions';

// API se aane wale response ka structure
interface SubscriptionListResponse {
  success: boolean;
  count: number;
  data: SubscriptionPlan[];
}

interface SubscriptionSingleResponse {
  success: boolean;
  message?: string;
  data: SubscriptionPlan;
}

/**
 * Saare subscription plans server se fetch karta hai.
 */
export const fetchSubscriptions = createAsyncThunk<SubscriptionPlan[]>(
  'admin/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<SubscriptionListResponse>(API_BASE_URL);
      
      // --- YAHAN HAI ASLI FIX ---
      // Humein response body ke andar se sirf 'data' property chahiye, jisme array hai.
      return response.data || [];

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch subscription plans';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Ek naya subscription plan add karta hai.
 */
export const addSubscription = createAsyncThunk<SubscriptionPlan, CreateSubscriptionPlan>(
  'admin/addSubscription',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await apiService.post<SubscriptionSingleResponse>(API_BASE_URL, planData);
      
      // --- YAHAN BHI ASLI FIX ---
      // Naya plan 'response.data' me hai.
      const newPlan = response.data;

      if (newPlan) {
        return newPlan;
      } else {
        return rejectWithValue('Failed to create subscription: Invalid response from server.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add subscription plan';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Ek existing subscription plan update karta hai.
 */
export const updateSubscription = createAsyncThunk<SubscriptionPlan, SubscriptionPlan>(
  'admin/updateSubscription',
  async (planData, { rejectWithValue }) => {
    try {
      const { _id, ...updateData } = planData;
      const response = await apiService.put<SubscriptionSingleResponse>(`${API_BASE_URL}/${_id}`, updateData);
      
      // --- YAHAN BHI ASLI FIX ---
      // Updated plan 'response.data' me hai.
      const updatedPlan = response.data;

      if (updatedPlan) {
        return updatedPlan;
      } else {
        return rejectWithValue('Failed to update subscription: Invalid response from server.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update subscription plan';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete function me koi change nahi hai, woh pehle se theek hai.
export const deleteSubscription = createAsyncThunk<string, string>(
  'admin/deleteSubscription',
  async (planId, { rejectWithValue }) => {
    try {
      await apiService.delete(`${API_BASE_URL}/${planId}`);
      return planId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete subscription plan';
      return rejectWithValue(errorMessage);
    }
  }
);