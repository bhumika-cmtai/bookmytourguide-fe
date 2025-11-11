// lib/data.ts

// --- Populated Object Interfaces ---
// Yeh batata hai ki jab data populate hoke aayega to kaisa dikhega

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
}

interface PopulatedGuide {
  _id: string;
  name: string;
  photo?: string;
  email?: string;
  mobile?: string;
}

interface PopulatedTour {
  _id: string;
  title: string;
  images?: string[];
  locations?: string[]; // <-- SABSE ZAROORI: locations ko yahaan add kiya gaya hai
}


// --- Main Booking Interface ---
// Yeh aapke poore project ke liye 'Booking' ki EKLOTI (single) definition hai.

export interface Booking {
  _id: string;
  tour: string | PopulatedTour;
  guide: string | PopulatedGuide;
  user: string | PopulatedUser;
  startDate: string;
  endDate: string;
  numberOfTourists: number;
  totalPrice: number;
  advanceAmount: number;
  paymentId: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  paymentStatus: "Advance Paid" | "Fully Paid" | "Refunded";
  createdAt: string;
  updatedAt: string;
}


// --- API Data Types ---

export interface CreateRazorpayOrderData {
    amount: number;
    receipt: string;
}

export interface VerifyAndCreateBookingData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    tourId: string;
    guideId: string;
    startDate: string;
    endDate: string;
    numberOfTourists: number;
}

export interface UpdateBookingStatusData {
    bookingId: string;
    status: "Upcoming" | "Completed" | "Cancelled";
}


// --- Other Type Definitions from your original file ---

export type Review = {
    user: string;
    fullName: string;
    avatar: string;
    rating: number;
    comment: string;
    images: string[];
};
  
export type Tour = {
    _id: string;
    title: string;
    description: string;
    images: string[];
    basePricePerPerson: number;
    pricePerPerson: number;
    duration: string;
    locations: string[];
};

export type AvailabilityPeriod = {
    startDate: string;
    endDate: string;
    available: boolean;
};

export type Guide = {
    _id: string;
    user: string;
    name: string;
    email: string;
    mobile?: string;
    dob?: string;
    state?: string;
    serviceLocations?:string[];
    country?: string;
    age?: number;
    languages?: string[];
    experience?: string;
    specializations?: string[];
    availability?: string[];
    description?: string;
    license?: string;
    photo?: string;
    isApproved: boolean;
    profileComplete: boolean;
    createdAt: string;
    updatedAt: string;
    guideProfileId: string;
    averageRating?: number;
    numReviews?: number;
    isCertified: boolean;
    subscriptionId:string;
    subscriptionPlan: string;
    subscriptionExpiresAt?: Date;
    availabilityPeriods: AvailabilityPeriod[];
    unavailableDates:Date[];
};
  
export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";
export type PaymentStatus = "Advance Paid" | "Fully Paid" | "Refunded";

// NOTE: The second conflicting 'Booking' interface has been REMOVED.

export type CustomTourRequestStatus = "Pending" | "Quoted" | "Booked" | "Rejected";

export type CustomTourRequest = {
  _id: string;
  userName: string;
  userEmail: string;
  locations: string[];
  language: string;
  startDate: string | null;
  endDate: string | null;
  numTravelers: number;
  specialRequests: string;
  submissionDate: string;
  status: CustomTourRequestStatus;
  assignedGuideId: string | null;
  quotedPrice: number | null;
  adminNotes: string;
};

export type AddOnPerk = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: "Eco Tour" | "Heritage Tour" | "One-day Tour" | "Handicraft Tour" | "Spice Market Tour" | "Culinary" | "Accommodation";
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "guide" | "admin";
};

export type AdminAddOn = {
  title: string;
  price: number;
};

export type AdminLocation = {
  _id: string;
  placeName: string;
  pricePerPerson: number;
  description: string;
  image: string;
};

export type LanguageOption = {
  _id: string;
  languageName: string;
  extraCharge: number;
};

export type SubscriptionPlan = {
  _id: string;
  title: string;
  duration: string;
  totalPrice: number;
  monthlyPrice: number;
  benefits: string[];
  popular: boolean;
};

export interface GuideProfile {
  _id: string;
  user: string;
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  state?: string;
  country?: string;
  age?: number;
  languages?: string[];
  serviceLocations?:string[];
  experience?: string;
  specializations?: string[];
  availability?: string[];
  description?: string;
  license?: string;
  photo?: string;
  isApproved: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  guideProfileId: string;
  averageRating: number;
  numReviews: number;
  isCertified: boolean;
  subscriptionId:string;
  subscriptionPlan: string;
  subscriptionExpiresAt?: Date;
  availabilityPeriods: AvailabilityPeriod[];
  unavailableDates:Date[];
}

export interface GuideState {
  guides: GuideProfile[];
  currentGuide: GuideProfile | null;
  myProfile: GuideProfile | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}


// --- Mock Data (Kept from your original file) ---
// Note: This data is not used by the live pages anymore.

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'user' },
];

export const tours: Tour[] = [
  {
    _id: "tour_06",
    title: "Classic Golden Triangle",
    description: "The quintessential Indian journey. Witness the splendor of Delhi, the romance of the Taj Mahal in Agra, and the royal heritage of Jaipur.",
    images: ["https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
    basePricePerPerson: 10000,
    pricePerPerson: 8999,
    duration: "3 Days",
    locations: ["Delhi", "Agra", "Jaipur"],
  },
];

export const guides: Guide[] = [
    {
      _id: "user_guide_01",
      guideProfileId: "guide_prof_01",
      name: "Rohan Verma",
      email: "rohan.v@guidelink.com",
    },
];