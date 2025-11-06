// lib/hooks/useUser.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  getAllUsers,
  getUserById,
  getUsersByRole,
  createUser,
  updateUserById,
  updateOwnProfile,
  getOwnProfile,
  deleteUser,
  clearUsers,
  clearError,
  clearCurrentUser,
} from "@/lib/redux/userSlice";
import {
  GetUsersParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/auth";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, currentUser, loading, error, pagination } = useSelector(
    (state: RootState) => state.user
  );

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    pagination,

    // Own Profile Actions (for regular users/guides)
    getOwnProfile: () => dispatch(getOwnProfile()),
    updateOwnProfile: (data: UpdateUserRequest) => dispatch(updateOwnProfile(data)),

    // Admin Actions
    getAllUsers: (params?: GetUsersParams) => dispatch(getAllUsers(params)),
    getUserById: (id: string) => dispatch(getUserById(id)),
    getUsersByRole: (role: string) => dispatch(getUsersByRole(role)),
    createUser: (data: CreateUserRequest) => dispatch(createUser(data)),
    updateUserById: (id: string, data: UpdateUserRequest) =>
      dispatch(updateUserById({ userId: id, data })),
    deleteUser: (id: string) => dispatch(deleteUser(id)),

    // Utility Actions
    clearAllUsers: () => dispatch(clearUsers()),
    clearUserError: () => dispatch(clearError()),
    clearCurrentUser: () => dispatch(clearCurrentUser()),
  };
};
