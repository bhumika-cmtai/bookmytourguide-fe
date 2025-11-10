"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { toast } from "react-toastify";
import { Save, Edit, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Import your thunks and slice actions correctly
import {
  getMyGuideProfile,
  updateMyGuideProfile,
} from "@/lib/redux/thunks/guide/guideThunk";
import { clearGuideError } from "@/lib/redux/guideSlice";

// ++ 1. Reusable Image Modal Component ++
const ImageModal = ({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg shadow-xl max-w-3xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
      >
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-md"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-700 hover:bg-gray-200"
          aria-label="Close image view"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

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

  // ++ 2. State for Modal Visibility and Image URL ++
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

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
        if (Array.isArray(field)) return field.join(", ");
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    // Logic to append form data and files (unchanged)
    Object.entries(formData).forEach(([key, value]) => {
        const trimmedValue = typeof value === "string" ? value.trim() : value;
        if (["languages", "specializations", "availability"].includes(key)) {
            if (trimmedValue) {
                const array = (trimmedValue as string).split(",").map(item => item.trim()).filter(Boolean);
                if (array.length > 0) formDataToSend.append(key, JSON.stringify(array));
            }
        } else if (trimmedValue !== "") {
            formDataToSend.append(key, trimmedValue.toString());
        }
    });
    if (files.photo) formDataToSend.append("photo", files.photo);
    if (files.license) formDataToSend.append("license", files.license);

    const result = await dispatch(updateMyGuideProfile(formDataToSend));
    if (updateMyGuideProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setFiles({});
      dispatch(getMyGuideProfile());
    } else {
      toast.error("Failed to update profile.");
    }
  };
  
  // ++ 3. Modal Control Functions ++
  const openModal = (url: string) => {
    setModalImageUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageUrl("");
  };

  // ++ RESTORED: Helper functions for stats ++
  const getProfileCompletionPercentage = () => {
    if (!myProfile) return 0;
    const fields = [
      myProfile.name, myProfile.mobile, myProfile.dob, myProfile.state,
      myProfile.country, myProfile.experience, myProfile.description,
      myProfile.license, myProfile.photo, myProfile.languages?.length,
      myProfile.specializations?.length,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getMissingFields = () => {
    if (!myProfile) return [];
    const missing: string[] = [];
    if (!myProfile.name) missing.push("Name");
    if (!myProfile.mobile) missing.push("Mobile");
    if (!myProfile.dob) missing.push("Date of Birth");
    if (!myProfile.state) missing.push("State");
    if (!myProfile.country) missing.push("Country");
    if (!myProfile.experience) missing.push("Experience");
    if (!myProfile.description) missing.push("Description");
    if (!myProfile.license) missing.push("License");
    if (!myProfile.photo) missing.push("Photo");
    if (!myProfile.languages?.length) missing.push("Languages");
    if (!myProfile.specializations?.length) missing.push("Specializations");
    return missing;
  };

  if (loading && !myProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ++ 4. Render the modal when it's open ++ */}
      <ImageModal imageUrl={modalImageUrl} onClose={closeModal} />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ++ RESTORED: Stats Cards Section ++ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Profile Completion</h3>
            <p className="text-3xl font-bold text-foreground">{getProfileCompletionPercentage()}%</p>
            <div className="mt-3 w-full bg-muted rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${getProfileCompletionPercentage()}%` }}/></div>
          </div>
          <div className="bg-card rounded-lg shadow-sm border p-6">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Approval Status</h3>
                {myProfile?.isApproved ? <CheckCircle className="w-5 h-5 text-green-500"/> : <XCircle className="w-5 h-5 text-yellow-500"/>}
             </div>
            <p className="text-3xl font-bold text-foreground">{myProfile?.isApproved ? "Approved" : "Pending"}</p>
            <p className="text-xs text-muted-foreground mt-2">{myProfile?.isApproved ? "Ready for bookings" : "Complete profile for approval"}</p>
          </div>
          <div className="bg-card rounded-lg shadow-sm border p-6">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Profile Status</h3>
                {myProfile?.profileComplete ? <CheckCircle className="w-5 h-5 text-green-500"/> : <AlertCircle className="w-5 h-5 text-orange-500"/>}
             </div>
            <p className="text-3xl font-bold text-foreground">{myProfile?.profileComplete ? "Complete" : "Incomplete"}</p>
             <p className="text-xs text-muted-foreground mt-2">{!myProfile?.profileComplete ? `${getMissingFields().length} fields remaining` : "All info provided"}</p>
          </div>
        </div>

        {/* ++ RESTORED: Completion Alert ++ */}
        {!myProfile?.profileComplete && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5"/>
                    <div>
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Your profile is incomplete.</h3>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Missing: {getMissingFields().join(', ')}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Profile Form (Main Content) */}
        <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields are unchanged */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label>Full Name *</label><Input name="name" value={formData.name} onChange={handleInputChange}/></div>
                    <div><label>Mobile Number *</label><Input name="mobile" type="tel" value={formData.mobile} onChange={handleInputChange}/></div>
                    <div><label>Date of Birth *</label><Input name="dob" type="date" value={formData.dob} onChange={handleInputChange}/></div>
                    <div><label>Age</label><Input name="age" type="number" value={formData.age} onChange={handleInputChange}/></div>
                    <div><label>State *</label><Input name="state" value={formData.state} onChange={handleInputChange}/></div>
                    <div><label>Country *</label><Input name="country" value={formData.country} onChange={handleInputChange}/></div>
                    <div><label>Experience *</label><Input name="experience" value={formData.experience} onChange={handleInputChange}/></div>
                    <div><label>Hourly Rate (₹)</label><Input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange}/></div>
                </div>
                <div><label>Languages * (comma-separated)</label><Input name="languages" value={formData.languages} onChange={handleInputChange}/></div>
                <div><label>Specializations * (comma-separated)</label><Input name="specializations" value={formData.specializations} onChange={handleInputChange}/></div>
                <div><label>Availability (comma-separated)</label><Input name="availability" value={formData.availability} onChange={handleInputChange}/></div>
                <div><label>Description *</label><Textarea name="description" value={formData.description} onChange={handleInputChange} rows={4}/></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label>Profile Photo *</label><Input name="photo" type="file" onChange={handleFileChange} accept="image/*"/></div>
                    <div><label>License/Certificate *</label><Input name="license" type="file" onChange={handleFileChange} accept="image/*,.pdf"/></div>
                </div>
                <div className="flex justify-end space-x-4"><Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>{loading ? "Saving..." : "Save Changes"}</Button></div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display fields... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><h3 className="text-sm font-medium text-muted-foreground">Name</h3><p>{myProfile?.name || <span className="text-red-500">Not provided</span>}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">Email</h3><p>{myProfile?.email}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">Mobile</h3><p>{myProfile?.mobile || <span className="text-red-500">Not provided</span>}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3><p>{myProfile?.dob ? new Date(myProfile.dob).toLocaleDateString() : <span className="text-red-500">Not provided</span>}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">State</h3><p>{myProfile?.state || <span className="text-red-500">Not provided</span>}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">Country</h3><p>{myProfile?.country || <span className="text-red-500">Not provided</span>}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">Experience</h3><p>{myProfile?.experience || <span className="text-red-500">Not provided</span>}</p></div>
                <div><h3 className="text-sm font-medium text-muted-foreground">Hourly Rate</h3><p>{myProfile?.hourlyRate ? `₹${myProfile.hourlyRate}` : <span className="text-muted-foreground">Not set</span>}</p></div>
              </div>
              <div><h3 className="text-sm font-medium text-muted-foreground">Languages</h3><p>{myProfile?.languages?.join(", ") || <span className="text-red-500">Not provided</span>}</p></div>
              <div><h3 className="text-sm font-medium text-muted-foreground">Specializations</h3><p>{myProfile?.specializations?.join(", ") || <span className="text-red-500">Not provided</span>}</p></div>
              <div><h3 className="text-sm font-medium text-muted-foreground">Availability</h3><p>{myProfile?.availability?.join(", ") || <span className="text-muted-foreground">Not provided</span>}</p></div>
              <div><h3 className="text-sm font-medium text-muted-foreground">Description</h3><p className="whitespace-pre-wrap">{myProfile?.description || <span className="text-red-500">Not provided</span>}</p></div>

              {/* ++ 5. Updated Image/License Display with Click Handlers ++ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Photo</h3>
                      {myProfile?.photo ? (
                          <img
                              src={myProfile.photo}
                              alt="Profile"
                              className="w-32 h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openModal(myProfile.photo)}
                          />
                      ) : (
                          <p className="text-red-500">Not uploaded</p>
                      )}
                  </div>
                  <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">License/Certificate</h3>
                      {myProfile?.license ? (
                           <button
                              onClick={() => openModal(myProfile.license)}
                              className="text-primary hover:underline"
                           >
                              View License
                           </button>
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