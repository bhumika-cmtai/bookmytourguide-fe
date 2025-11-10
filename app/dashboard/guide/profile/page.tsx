"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store"; // Adjust this path to your Redux store
import { getMyGuideProfile, updateMyGuideProfile } from "@/lib/redux/thunks/guide/guideThunk"; // Adjust this path to your thunks file
import Image from "next/image";

// Helper function to format date strings for the date input field
const formatDateForInput = (isoDate?: string) => {
  if (!isoDate) return "";
  try {
    // Returns date in "YYYY-MM-DD" format
    return new Date(isoDate).toISOString().split("T")[0];
  } catch (error) {
    console.error("Invalid date format:", isoDate);
    return "";
  }
};

const GuideProfilePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { myProfile, loading, error } = useSelector(
    (state: RootState) => state.guide // Assuming 'guide' is the name of your slice in the root reducer
  );

  // --- LOCAL STATE FOR THE FORM ---
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: "",
    state: "",
    country: "",
    experience: "",
    description: "",
    languages: "", // Stored as a comma-separated string for the input field
    specializations: "", // Stored as a comma-separated string
    availability: "", // Stored as a comma-separated string
  });

  // State to hold the actual file objects for submission
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // State to hold URLs for image previews
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);


  // --- SIDE EFFECTS ---

  // 1. Fetch the guide's profile data when the component first loads.
  useEffect(() => {
    dispatch(getMyGuideProfile());
  }, [dispatch]);

  // 2. Populate the form with the profile data once it has been fetched.
  useEffect(() => {
    if (myProfile) {
      setFormData({
        name: myProfile.name || "",
        mobile: myProfile.mobile || "",
        dob: formatDateForInput(myProfile.dob),
        state: myProfile.state || "",
        country: myProfile.country || "",
        experience: myProfile.experience || "",
        description: myProfile.description || "",
        languages: myProfile.languages?.join(", ") || "",
        specializations: myProfile.specializations?.join(", ") || "",
        availability: myProfile.availabilityPeriods?.join(", ") || "",
      });
      
      // Set initial image/document previews from existing data
      if (myProfile.photo) setPhotoPreview(myProfile.photo);
      if (myProfile.license) setLicensePreview(myProfile.license);
    }
  }, [myProfile]);


  // --- EVENT HANDLERS ---

  // Handles changes in all text-based input fields.
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles new file selections for photo and license.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (name === "photo") {
        setPhotoFile(file);
        setPhotoPreview(previewUrl);
      } else if (name === "license") {
        setLicenseFile(file);
        // If the new file is an image, show a preview. Otherwise, show its name.
        if (file.type.startsWith("image/")) {
          setLicensePreview(previewUrl);
        } else {
          setLicensePreview(file.name);
        }
      }
    }
  };

  // Handles the form submission.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submissionFormData = new FormData();

    // Append all text fields from the local state to the FormData object
    Object.entries(formData).forEach(([key, value]) => {
      // For array-like fields, split the string and append each item
      if (
        ["languages", "specializations", "availability"].includes(key) &&
        typeof value === "string"
      ) {
        const arrayValue = value.split(",").map((item: string) => item.trim()).filter(Boolean);
        arrayValue.forEach((item) => submissionFormData.append(`${key}[]`, item));
      } else {
        submissionFormData.append(key, String(value));
      }
    });

    // Append the file objects only if a new file has been selected
    if (photoFile) {
      submissionFormData.append("photo", photoFile);
    }
    if (licenseFile) {
      submissionFormData.append("license", licenseFile);
    }

    dispatch(updateMyGuideProfile(submissionFormData));
  };


  // --- STYLING CONSTANTS (using your CSS variables) ---
  const inputFieldStyle = "w-full px-3 py-2 bg-[var(--input)] border border-[var(--border)] rounded-md shadow-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--primary)] transition";
  const fileInputStyle = "block w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)]/10 file:text-[var(--primary)] hover:file:bg-[var(--primary)]/20 cursor-pointer";
  const labelStyle = "block text-sm font-medium text-[var(--muted-foreground)] mb-1";

console.log(myProfile)
  return (
    <div className="container mx-auto p-4 md:p-8 bg-[var(--background)]">
      <div className="bg-[var(--card)] p-6 md:p-8 rounded-lg shadow-md border border-[var(--border)]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)]">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            Profile Information
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputFieldStyle}/>
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input type="email" value={myProfile?.email || ""} disabled className={`${inputFieldStyle} bg-[var(--muted)] cursor-not-allowed`}/>
            </div>
             <div>
              <label className={labelStyle}>Mobile</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={inputFieldStyle}/>
            </div>
            <div>
              <label className={labelStyle}>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={inputFieldStyle}/>
            </div>
             <div>
              <label className={labelStyle}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputFieldStyle}/>
            </div>
            <div>
              <label className={labelStyle}>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleInputChange} className={inputFieldStyle}/>
            </div>
          </div>

          {/* Section 2: Professional Information */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelStyle}>Experience (e.g., 5 years)</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className={inputFieldStyle}/>
            </div>
             <div>
              <label className={labelStyle}>Languages (comma separated)</label>
              <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="e.g. English, Hindi, Spanish" className={inputFieldStyle}/>
            </div>
            <div>
              <label className={labelStyle}>Specializations (comma separated)</label>
              <input type="text" name="specializations" value={formData.specializations} onChange={handleInputChange} placeholder="e.g. History, Adventure, Food Tours" className={inputFieldStyle}/>
            </div>
            <div className="md:col-span-2">
                <label className={labelStyle}>Availability (comma separated)</label>
                <input type="text" name="availability" value={formData.availability} onChange={handleInputChange} placeholder="e.g. Weekends, Mon-Fri" className={inputFieldStyle}/>
            </div>
            <div className="md:col-span-2">
                <label className={labelStyle}>Description / Bio</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className={inputFieldStyle}
                placeholder="Tell travelers a little about yourself..."></textarea>
            </div>
           </div>

          {/* Section 3: File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
                <label className={`${labelStyle} mb-2`}>Profile Photo</label>
                <div className="flex items-center gap-4 mt-2">
                    {photoPreview && (
                      <Image src={photoPreview} alt="Profile Preview" width={80} height={80} className="rounded-full object-cover w-20 h-20"/>
                    )}
                    <input type="file" name="photo" onChange={handleFileChange} accept="image/*" className={fileInputStyle}/>
                </div>
            </div>
             <div>
                <label className={`${labelStyle} mb-2`}>License/Certificate (Image or PDF)</label>
                 <div className="flex flex-col gap-4 mt-2">
                    {licensePreview && (
                      <div className="p-2 border border-dashed border-[var(--border)] rounded-md">
                        {licensePreview.startsWith('blob:') || licenseFile?.type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(licensePreview) ? (
                          <Image src={licensePreview} alt="License Preview" width={120} height={80} className="rounded-md object-contain"/>
                        ) : (
                          <p className="text-sm text-[var(--muted-foreground)] p-2">
                            Current document: {licenseFile?.name || licensePreview.split('/').pop()}
                          </p>
                        )}
                      </div>
                    )}
                    <input type="file" name="license" onChange={handleFileChange} accept="image/*,.pdf" className={fileInputStyle}/>
                </div>
            </div>
          </div>

          {/* Section 4: Submission */}
          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-end gap-4">
            {error && <p className="text-sm text-[var(--destructive)] animate-pulse">{error}</p>}
            <button type="submit" disabled={loading} className="bg-[var(--primary)] text-[var(--primary-foreground)] font-bold py-2 px-6 rounded-lg hover:bg-[var(--destructive)] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideProfilePage;