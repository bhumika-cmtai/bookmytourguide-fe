"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  getMyGuideProfile,
  updateMyGuideProfile,
  clearGuideError,
} from "@/lib/redux/guideSlice";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, AlertCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";

export default function GuideDashboard() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myProfile, loading, error } = useSelector(
    (state: RootState) => state.guide
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: "",
    state: "",
    country: "",
    age: "",
    languages: "",
    experience: "",
    specializations: "",
    availability: "",
    hourlyRate: "",
    description: "",
  });
  const [files, setFiles] = useState<{ photo?: File; license?: File }>({});

  useEffect(() => {
    if (user?.role !== "guide") {
      router.push("/login");
      return;
    }
    dispatch(getMyGuideProfile());
  }, [dispatch, user, router]);

  useEffect(() => {
    if (myProfile) {
      const parseArray = (field: any) => {
        if (!field) return "";
        // If it's already an array, clean it
        if (Array.isArray(field)) {
          // handle ["[\"Hindi\"]"] case
          if (
            field.length === 1 &&
            typeof field[0] === "string" &&
            field[0].includes("[")
          ) {
            try {
              const inner = JSON.parse(field[0]);
              if (Array.isArray(inner)) return inner.join(", ");
            } catch {
              return field.join(", ");
            }
          }
          return field.join(", ");
        }
        // If it's a string, try parsing JSON
        if (typeof field === "string") {
          try {
            const arr = JSON.parse(field);
            if (Array.isArray(arr)) return arr.join(", ");
          } catch {
            return field;
          }
        }
        return "";
      };

      setFormData({
        name: myProfile.name || "",
        mobile: myProfile.mobile || "",
        dob: myProfile.dob ? myProfile.dob.split("T")[0] : "",
        state: myProfile.state || "",
        country: myProfile.country || "",
        age: myProfile.age?.toString() || "",
        languages: parseArray(myProfile.languages),
        experience: myProfile.experience || "",
        specializations: parseArray(myProfile.specializations),
        availability: parseArray(myProfile.availability),
        hourlyRate: myProfile.hourlyRate?.toString() || "",
        description: myProfile.description || "",
      });
    }
  }, [myProfile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearGuideError());
    }
  }, [error, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - only check if at least one field is filled
    const hasAnyData = Object.entries(formData).some(([key, value]) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return value !== null && value !== undefined;
    });

    if (!hasAnyData && !files.photo && !files.license) {
      toast.error("Please fill at least one field to update");
      return;
    }

    const formDataToSend = new FormData();

    // Add all non-empty fields
    Object.entries(formData).forEach(([key, value]) => {
      const trimmedValue = typeof value === "string" ? value.trim() : value;

      if (["languages", "specializations", "availability"].includes(key)) {
        if (trimmedValue) {
          const array = (trimmedValue as string)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          if (array.length > 0) {
            formDataToSend.append(key, JSON.stringify(array));
          }
        }
      } else if (trimmedValue !== "") {
        formDataToSend.append(key, trimmedValue.toString());
      }
    });

    // Add files if selected
    if (files.photo) formDataToSend.append("photo", files.photo);
    if (files.license) formDataToSend.append("license", files.license);

    const result = await dispatch(updateMyGuideProfile(formDataToSend));

    if (updateMyGuideProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setFiles({});
      // Refresh profile
      dispatch(getMyGuideProfile());
    } else {
      toast.error("Failed to update profile");
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!myProfile) return 0;
    const fields = [
      myProfile.name,
      myProfile.mobile,
      myProfile.dob,
      myProfile.state,
      myProfile.country,
      myProfile.experience,
      myProfile.description,
      myProfile.license,
      myProfile.photo,
      myProfile.languages?.length,
      myProfile.specializations?.length,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getMissingFields = () => {
    if (!myProfile) return [];
    const missingFields: string[] = [];
    if (!myProfile.name) missingFields.push("Full Name");
    if (!myProfile.mobile) missingFields.push("Mobile Number");
    if (!myProfile.dob) missingFields.push("Date of Birth");
    if (!myProfile.state) missingFields.push("State");
    if (!myProfile.country) missingFields.push("Country");
    if (!myProfile.experience) missingFields.push("Experience");
    if (!myProfile.description) missingFields.push("Description");
    if (!myProfile.license) missingFields.push("License/Certificate");
    if (!myProfile.photo) missingFields.push("Profile Photo");
    if (!myProfile.languages?.length) missingFields.push("Languages");
    if (!myProfile.specializations?.length)
      missingFields.push("Specializations");
    return missingFields;
  };

  if (loading && !myProfile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Profile Completion
              </h3>
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {getProfileCompletionPercentage()}%
            </p>
            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${getProfileCompletionPercentage()}%` }}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Approval Status
              </h3>
              {myProfile?.isApproved ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <p className="text-3xl font-bold text-foreground">
              {myProfile?.isApproved ? "Approved" : "Pending"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {myProfile?.isApproved
                ? "You're ready for bookings"
                : "Complete your profile for approval"}
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Profile Status
              </h3>
              {myProfile?.profileComplete ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <p className="text-3xl font-bold text-foreground">
              {myProfile?.profileComplete ? "Complete" : "Incomplete"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {myProfile?.profileComplete
                ? "All information provided"
                : `${getMissingFields().length} fields remaining`}
            </p>
          </div>
        </div>

        {/* Completion Alert */}
        {!myProfile?.profileComplete && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Your profile is {getProfileCompletionPercentage()}% complete.
                  You can update your profile partially - fill fields as you go!
                </p>
                {getMissingFields().length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      Missing fields:
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      {getMissingFields().join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Profile Information
            </h2>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              disabled={loading}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> You can save partial information. Fill
                  out the fields you have now and come back later to complete
                  the rest. Fields marked with * are required for final
                  approval.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Mobile Number *
                  </label>
                  <Input
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Your contact number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Date of Birth *
                  </label>
                  <Input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Age
                  </label>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Your age"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    State *
                  </label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Your state"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Country *
                  </label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Your country"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Experience *
                  </label>
                  <Input
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 years"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Hourly Rate (₹)
                  </label>
                  <Input
                    name="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="Your rate per hour"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Languages * (comma-separated)
                </label>
                <Input
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="e.g., English, Hindi, Spanish"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Specializations * (comma-separated)
                </label>
                <Input
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  placeholder="e.g., Historical tours, Adventure, Cultural experiences"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Availability (comma-separated)
                </label>
                <Input
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., Weekends, Weekdays, Evenings"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description *
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about yourself and your guiding experience..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Profile Photo *{" "}
                    {myProfile?.photo && (
                      <span className="text-green-600">(✓ Uploaded)</span>
                    )}
                  </label>
                  <Input
                    name="photo"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {files.photo && (
                    <p className="text-xs text-green-600">
                      New photo selected: {files.photo.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    License/Certificate *{" "}
                    {myProfile?.license && (
                      <span className="text-green-600">(✓ Uploaded)</span>
                    )}
                  </label>
                  <Input
                    name="license"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  {files.license && (
                    <p className="text-xs text-green-600">
                      New license selected: {files.license.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFiles({});
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Name
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.name || (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p className="text-foreground">{myProfile?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Mobile
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.mobile || (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.dob ? (
                      new Date(myProfile.dob).toLocaleDateString()
                    ) : (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    State
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.state || (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Country
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.country || (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Experience
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.experience || (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Hourly Rate
                  </h3>
                  <p className="text-foreground">
                    {myProfile?.hourlyRate ? (
                      `₹${myProfile.hourlyRate}`
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Languages
                </h3>
                <p className="text-foreground">
                  {myProfile?.languages?.join(", ") || (
                    <span className="text-red-500">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Specializations
                </h3>
                <p className="text-foreground">
                  {myProfile?.specializations?.join(", ") || (
                    <span className="text-red-500">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Availability
                </h3>
                <p className="text-foreground">
                  {myProfile?.availability?.join(", ") || (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {myProfile?.description || (
                    <span className="text-red-500">Not provided</span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Profile Photo
                  </h3>
                  {myProfile?.photo ? (
                    <img
                      src={myProfile.photo}
                      alt="Profile"
                      className="mt-2 w-32 h-32 object-cover rounded-lg border border-border"
                    />
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    License/Certificate
                  </h3>
                  {myProfile?.license ? (
                    <a
                      href={myProfile.license}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center mt-2"
                    >
                      View License →
                    </a>
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
