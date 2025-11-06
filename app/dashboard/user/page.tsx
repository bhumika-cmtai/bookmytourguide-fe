// app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUser } from "@/lib/hooks/useUser";
import { toast } from "react-toastify";
import { Edit, Save, User as UserIcon } from "lucide-react";
import { UpdateUserRequest } from "@/types/auth";

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    currentUser,
    loading: profileLoading,
    updateOwnProfile,
    getOwnProfile,
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateUserRequest>>({
    name: "",
    mobile: "",
  });

  // Fetch own profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      getOwnProfile();
    }
  }, [isAuthenticated, currentUser, getOwnProfile]);

  // Update form data when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        mobile: currentUser.mobile || "",
      });

      // Auto-enable editing if profile is incomplete
      if (!currentUser.name || !currentUser.mobile) {
        setIsEditing(true);
      }
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.mobile?.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    try {
      const resultAction = await updateOwnProfile(
        formData as UpdateUserRequest
      );

      // Check the dispatched action's meta.requestStatus to determine success
      if ((resultAction as any)?.meta?.requestStatus === "fulfilled") {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        getOwnProfile(); // refresh profile
      } else {
        // Show error from rejected payload or action.error.message
        const errorMessage =
          (resultAction as any)?.payload ||
          (resultAction as any)?.error?.message ||
          "Failed to update profile.";
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  // Show error if user is not loaded
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-600 mb-4">Failed to load user data</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Show loading if currentUser is not yet loaded
  if (!currentUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading profile data...</p>
      </div>
    );
  }

  // Gatekeeper: Force profile completion if necessary
  if (!currentUser.name || !currentUser.mobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto mt-10 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Complete Your Profile
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Please provide your full name and mobile number to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name *"
              disabled={profileLoading}
              required
            />
            <Input
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile Number *"
              disabled={profileLoading}
              required
            />
            <Button type="submit" disabled={profileLoading} className="w-full">
              {profileLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <UserIcon className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={profileLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  value={currentUser.email}
                  disabled
                  className="cursor-not-allowed bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Mobile Number *
                </label>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  disabled={profileLoading}
                  placeholder="Add your mobile number"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: currentUser.name || "",
                      mobile: currentUser.mobile || "",
                    });
                  }}
                  disabled={profileLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={profileLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {profileLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Full Name
                </h3>
                <p className="text-foreground col-span-2">{currentUser.name}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email Address
                </h3>
                <p className="text-foreground col-span-2">
                  {currentUser.email}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Mobile Number
                </h3>
                <p className="text-foreground col-span-2">
                  {currentUser.mobile || "Not provided"}
                </p>
              </div>
              {currentUser.role && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Role
                  </h3>
                  <p className="text-foreground col-span-2 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
