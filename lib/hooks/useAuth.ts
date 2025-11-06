// lib/hooks/useAuth.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "../store";
import {
  loginUser,
  verifyOtpAndRegister,
  sendOTP,
  getCurrentUser,
  logoutUser,
  refreshToken,
  updateUser,
  setError,
  clearAuth,
} from "@/lib/redux/authSlice";
import { LoginRequest, OTPRequest, User } from "@/types/auth";
import { showToast } from "@/lib/utils/toastHelper";

const ROLE_ROUTES: Record<string, string> = {
  guide: "/dashboard/guide",
  admin: "/dashboard/admin",
  manager: "/dashboard/admin",
  user: "/dashboard/user",
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.data?.role ?? "user";
      showToast.success(
        `Welcome back, ${result.payload.data?.name || "User"}!`
      );
      router.push(ROLE_ROUTES[role] ?? "/dashboard");
    } else {
      showToast.error((result.payload as string) || "Login failed");
    }
    return result;
  };

  const sendOtp = async (data: OTPRequest) => {
    const result = await dispatch(sendOTP(data));
    if (sendOTP.fulfilled.match(result)) {
      showToast.success("OTP sent successfully to your email!");
    } else {
      showToast.error((result.payload as string) || "Failed to send OTP");
    }
    return result;
  };

  const verifyAndRegister = async (formData: FormData) => {
    const result = await dispatch(verifyOtpAndRegister(formData));
    if (verifyOtpAndRegister.fulfilled.match(result)) {
      showToast.success("Registration successful! Please login to continue.");
    } else {
      showToast.error((result.payload as string) || "Registration failed");
    }
    return result;
  };

  const fetchCurrentUser = async () => {
    const result = await dispatch(getCurrentUser());
    if (getCurrentUser.rejected.match(result)) {
      // Only redirect to login if we're not already on auth pages
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        router.push("/login");
      }
    }
    return result;
  };

  const refresh = async () => {
    const result = await dispatch(refreshToken());
    return result;
  };

  const logout = async () => {
    await dispatch(logoutUser());
    showToast.info("Logged out successfully. See you soon!");
    router.push("/login");
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    sendOtp,
    verifyAndRegister,
    fetchCurrentUser,
    refresh,
    logout,
    clearAuthError: () => dispatch(setError(null)),
    updateAuthUser: (data: Partial<User>) => dispatch(updateUser(data)),
    clearAuth: () => dispatch(clearAuth()),
  };
};
