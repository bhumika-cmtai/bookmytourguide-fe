// lib/data.ts

export type Review = {
    user: string; // Typically ObjectId as a string
    fullName: string;
    avatar: string; // URL to user's avatar
    rating: number;
    comment: string;
    images: string[];
  };
  
  export type Tour = {
    _id: string;
    title: string;
    description: string;
    images: string[]; // Now just a single main image
    basePricePerPerson: number;
    pricePerPerson: number;
    duration: string;
    locations: string[];
  };

  export type AvailabilityPeriod = {
    startDate: string; // "YYYY-MM-DD"
    endDate: string; // "YYYY-MM-DD"
    available: boolean; // true = available, false = blocked
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
    // Optimized availability using date ranges
    availabilityPeriods: AvailabilityPeriod[];
    unavailableDates:Date[];
  };
  
export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";
export type PaymentStatus = "Advance Paid" | "Fully Paid" | "Refunded";

export interface Booking {
  _id: string;
  tour: string; // This will be the ID of the AdminPackage
  guide: string; // This will be the ID of the Guide
  user: string; // This will be the ID of the User
  startDate: string; // Stored as an ISO date string, e.g., "2025-11-19T00:00:00.000Z"
  endDate: string; // Stored as an ISO date string
  numberOfTourists: number;
  totalPrice: number;
  advanceAmount: number;
  paymentId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string; // From Mongoose timestamps
  updatedAt: string; // From Mongoose timestamps
}

export type CustomTourRequestStatus = "Pending" | "Quoted" | "Booked" | "Rejected";

export type CustomTourRequest = {
  _id: string;
  userName: string;
  userEmail: string;
  locations: string[];
  language: string; // The value, e.g., 'hindi', 'english'
  startDate: string | null;
  endDate: string | null;
  numTravelers: number;
  specialRequests: string;
  submissionDate: string;
  status: CustomTourRequestStatus;
  // Admin-assigned fields
  assignedGuideId: string | null;
  quotedPrice: number | null;
  adminNotes: string;
};

export type AddOnPerk = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string; // A single representative image
  // Updated categories to match your drawing
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

// Defines the structure for a location package created by the admin
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
  extraCharge: number; // The additional cost for this language service
};


export type SubscriptionPlan = {
  _id: string;
  title: string;
  duration: string;
  totalPrice: number;
  monthlyPrice: number;
  benefits: string[];
  popular: boolean; // To highlight the "Most Popular" plan
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
  // Optimized availability using date ranges
  availabilityPeriods: AvailabilityPeriod[];
  unavailableDates:Date[];
  
}

// Defines the shape of the state within the guide slice
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


export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'user' },
  { id: 'user-2', name: 'Robert Brown', email: 'rob.brown@example.com', role: 'user' },
  { id: 'user-3', name: 'Charlie Davis', email: 'charlie.d@example.com', role: 'user' },
  { id: 'user-4', name: 'Rohan Verma', email: 'rohan.v@guidelink.com', role: 'guide' },
  { id: 'user-5', name: 'Anjali Sharma', email: 'anjali.s@guidelink.com', role: 'guide' },
  { id: 'user-6', name: 'Diana Miller', email: 'diana.m@example.com', role: 'user' },
  { id: 'user-7', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
];


export const tours: Tour[] = [
  {
    _id: "tour_05",
    title: "Old Delhi Rickshaw Tour",
    description: "Navigate the chaotic, vibrant lanes of Old Delhi on a traditional rickshaw. Explore the bustling Chandni Chowk market and witness centuries of history.",
    images: ["https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
    basePricePerPerson: 3000,
    pricePerPerson: 2499,
    duration: "1 Day",
    locations: ["Old Delhi", "Chandni Chowk"],
  },
  // --- NEW TOUR 2: Golden Triangle ---
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
  {
    _id: "tour_01",
    title: "The Crimson Trail of Rajasthan",
    description: "Journey through the heart of Rajputana. A vibrant tapestry of majestic forts, opulent palaces, and rich cultural traditions.",
    images: ["https://i.pinimg.com/736x/7f/eb/85/7feb8540c9b74207a5d7b3bde8a4538f.jpg"],
    basePricePerPerson: 15000,
    pricePerPerson: 12999,
    duration: "7 Days",
    locations: ["Jaipur", "Jodhpur", "Udaipur"],
  },
  {
    _id: "tour_02",
    title: "Himalayan Serenity Trek",
    description: "Escape to the breathtaking landscapes of the Himalayas. This trek takes you through serene valleys and charming mountain villages.",
    images: ["https://i.pinimg.com/736x/f2/5f/e1/f25fe1b9e9dbf4ffded1247f20028431.jpg"],
    basePricePerPerson: 20000,
    pricePerPerson: 17499,
    duration: "5 Days",
    locations: ["Manali", "Solang Valley"],
  },
  {
    _id: "tour_03",
    title: "Echoes of the Mughal Empire",
    description: "Walk through history as you explore the architectural marvels of the Mughal era in the iconic Golden Triangle.",
    images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"],
    basePricePerPerson: 11000,
    pricePerPerson: 8999,
    duration: "4 Days",
    locations: ["Delhi", "Agra", "Jaipur"],
  },
  {
    _id: "tour_04",
    title: "Kerala Backwaters Retreat",
    description: "Experience the tranquil beauty of God's Own Country. Cruise through serene backwaters and explore spice plantations.",
    images: ["https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
    basePricePerPerson: 18000,
    pricePerPerson: 15999,
    duration: "5 Days",
    locations: ["Alleppey", "Kochi", "Munnar"],
  },
  // Add more tours as needed...
];

      // --- NEW GUIDE DATA ---
export const guides: Guide[] = [
        {
          _id: "user_guide_01",
          guideProfileId: "guide_prof_01",
          name: "Rohan Verma",
          email: "rohan.v@guidelink.com",
          mobile: "",
          age: 38,
          state: "Rajasthan",
          country: "India",
          languages: ["English", "Hindi", "Marwari"],
          experience: "12+ Years",
          specializations: ["Historical Tours", "Cultural Immersion", "Forts & Palaces"],
          description: "A passionate historian and storyteller, Rohan brings the vibrant history of Rajasthan's kingdoms to life. Born and raised in Jaipur, he has an intimate knowledge of every fort, palace, and hidden alleyway.",
          photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 152,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-10", available: true },
            { startDate: "2025-11-11", endDate: "2025-11-15", available: false },
            { startDate: "2025-11-16", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-20", available: true },
            { startDate: "2025-12-21", endDate: "2025-12-31", available: false },
            { startDate: "2026-01-01", endDate: "2026-01-31", available: true },
          ],
        },
        {
          _id: "user_guide_02",
          guideProfileId: "guide_prof_02",
          name: "Anjali Sharma",
          email: "anjali.s@guidelink.com",
          mobile: "+91 9988776655",
          age: 32,
          state: "Himachal Pradesh",
          country: "India",
          languages: ["English", "Hindi", "Pahari"],
          experience: "8+ Years",
          specializations: ["Trekking", "Nature Walks", "Adventure Sports"],
          description: "An avid mountaineer and certified trekking guide, Anjali's expertise lies in the Himalayan trails. She ensures a safe, thrilling, and unforgettable adventure for every traveler.",
          photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 112,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-05", available: false },
            { startDate: "2025-11-06", endDate: "2025-11-25", available: true },
            { startDate: "2025-11-26", endDate: "2025-11-30", available: false },
            { startDate: "2025-12-01", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-02-28", available: true },
          ],
        },
        {
          _id: "user_guide_03",
          guideProfileId: "guide_prof_03",
          name: "Vikram Singh",
          email: "vikram.s@guidelink.com",
          mobile: "+91 9123456789",
          age: 45,
          state: "Delhi",
          country: "India",
          languages: ["English", "Hindi", "Punjabi", "Urdu"],
          experience: "20+ Years",
          specializations: ["Mughal History", "Street Food Tours", "Architectural Walks"],
          description: "Vikram is a walking encyclopedia of Delhi's history. His tours are a captivating blend of historical facts, cultural anecdotes, and culinary delights that reveal the city's soul.",
          photo: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.8,
          numReviews: 210,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-10", available: false },
            { startDate: "2025-12-11", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-03-31", available: true },
          ],
        },
        {
          _id: "user_guide_04",
          guideProfileId: "guide_prof_04",
          name: "Priya Nair",
          email: "priya.n@guidelink.com",
          mobile: "+91 9876501234",
          age: 29,
          state: "Kerala",
          country: "India",
          languages: ["English", "Malayalam", "Tamil", "Hindi"],
          experience: "6+ Years",
          specializations: ["Backwater Tours", "Ayurveda Wellness", "Spice Plantations"],
          description: "Priya is a Kerala native who specializes in showcasing the serene beauty of God's Own Country. Her tours blend nature, wellness, and authentic Kerala culture.",
          photo: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 98,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-15", available: false },
            { startDate: "2025-12-16", endDate: "2026-01-31", available: true },
            { startDate: "2026-02-01", endDate: "2026-02-10", available: false },
            { startDate: "2026-02-11", endDate: "2026-04-30", available: true },
          ],
        },
        {
          _id: "user_guide_05",
          guideProfileId: "guide_prof_05",
          name: "Arjun Reddy",
          email: "arjun.r@guidelink.com",
          mobile: "+91 9912345678",
          age: 35,
          state: "Karnataka",
          country: "India",
          languages: ["English", "Kannada", "Telugu", "Hindi"],
          experience: "10+ Years",
          specializations: ["Heritage Sites", "Temple Tours", "Royal History"],
          description: "Arjun is a certified guide with deep knowledge of Karnataka's royal heritage. From Mysore Palace to Hampi ruins, he brings history alive with engaging storytelling.",
          photo: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.8,
          numReviews: 145,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-08", available: true },
            { startDate: "2025-11-09", endDate: "2025-11-12", available: false },
            { startDate: "2025-11-13", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-01-15", available: false },
            { startDate: "2026-01-16", endDate: "2026-03-31", available: true },
          ],
        },
        {
          _id: "user_guide_06",
          guideProfileId: "guide_prof_06",
          name: "Neha Kapoor",
          email: "neha.k@guidelink.com",
          mobile: "+91 9823456789",
          age: 31,
          state: "Goa",
          country: "India",
          languages: ["English", "Hindi", "Konkani", "Portuguese"],
          experience: "7+ Years",
          specializations: ["Beach Tours", "Portuguese Heritage", "Water Sports"],
          description: "Neha offers the perfect blend of Goa's beach culture and rich Portuguese history. Her tours include hidden beaches, colonial architecture, and authentic Goan cuisine.",
          photo: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.7,
          numReviews: 167,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-20", available: true },
            { startDate: "2025-11-21", endDate: "2025-11-25", available: false },
            { startDate: "2025-11-26", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-02-28", available: true },
          ],
        },
        {
          _id: "user_guide_07",
          guideProfileId: "guide_prof_07",
          name: "Sanjay Mehta",
          email: "sanjay.m@guidelink.com",
          mobile: "+91 9734567890",
          age: 42,
          state: "Uttar Pradesh",
          country: "India",
          languages: ["English", "Hindi", "Awadhi"],
          experience: "15+ Years",
          specializations: ["Spiritual Tours", "Ganga Ghats", "Temple Architecture"],
          description: "Sanjay specializes in spiritual tours of Varanasi and other holy cities. His deep understanding of Hindu philosophy and rituals provides travelers with meaningful experiences.",
          photo: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 234,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-25", available: true },
            { startDate: "2025-12-26", endDate: "2025-12-31", available: false },
            { startDate: "2026-01-01", endDate: "2026-03-31", available: true },
          ],
        },
        {
          _id: "user_guide_08",
          guideProfileId: "guide_prof_08",
          name: "Kavita Desai",
          email: "kavita.d@guidelink.com",
          mobile: "+91 9845678901",
          age: 28,
          state: "Gujarat",
          country: "India",
          languages: ["English", "Gujarati", "Hindi"],
          experience: "5+ Years",
          specializations: ["Wildlife Safaris", "Tribal Culture", "Textile Tours"],
          description: "Kavita brings Gujarat's vibrant culture to life through her expertise in wildlife, handicrafts, and tribal traditions. Her tours offer authentic experiences beyond typical tourist paths.",
          photo: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.8,
          numReviews: 87,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-15", available: false },
            { startDate: "2025-11-16", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-01-20", available: false },
            { startDate: "2026-01-21", endDate: "2026-04-30", available: true },
          ],
        },
        {
          _id: "user_guide_09",
          guideProfileId: "guide_prof_09",
          name: "Rahul Khanna",
          email: "rahul.k@guidelink.com",
          mobile: "+91 9956789012",
          age: 36,
          state: "Jammu & Kashmir",
          country: "India",
          languages: ["English", "Hindi", "Kashmiri", "Urdu"],
          experience: "11+ Years",
          specializations: ["Mountain Trekking", "Skiing", "Photography Tours"],
          description: "Rahul is a mountain enthusiast who knows every trail in Kashmir. His expertise in adventure sports and photography makes him ideal for thrill-seekers and nature lovers.",
          photo: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 176,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2026-02-28", available: true },
            { startDate: "2026-03-01", endDate: "2026-03-15", available: false },
            { startDate: "2026-03-16", endDate: "2026-05-31", available: true },
          ],
        },
        {
          _id: "user_guide_10",
          guideProfileId: "guide_prof_10",
          name: "Meera Iyer",
          email: "meera.i@guidelink.com",
          mobile: "+91 9867890123",
          age: 33,
          state: "Tamil Nadu",
          country: "India",
          languages: ["English", "Tamil", "Telugu", "Hindi"],
          experience: "9+ Years",
          specializations: ["Temple Architecture", "Classical Dance", "South Indian Cuisine"],
          description: "Meera is passionate about Tamil Nadu's rich cultural heritage. Her tours beautifully combine temple visits with cultural performances and culinary experiences.",
          photo: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.8,
          numReviews: 198,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-10", available: true },
            { startDate: "2025-11-11", endDate: "2025-11-20", available: false },
            { startDate: "2025-11-21", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-03-31", available: true },
          ],
        },
        {
          _id: "user_guide_11",
          guideProfileId: "guide_prof_11",
          name: "Aditya Bose",
          email: "aditya.b@guidelink.com",
          mobile: "+91 9778901234",
          age: 40,
          state: "West Bengal",
          country: "India",
          languages: ["English", "Bengali", "Hindi"],
          experience: "14+ Years",
          specializations: ["Colonial Architecture", "Literary Tours", "Tea Gardens"],
          description: "Aditya specializes in Bengal's colonial past and literary heritage. From Kolkata's streets to Darjeeling's tea gardens, he offers intellectually enriching experiences.",
          photo: "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 156,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-15", available: false },
            { startDate: "2025-12-16", endDate: "2026-01-31", available: true },
            { startDate: "2026-02-01", endDate: "2026-04-30", available: true },
          ],
        },
        {
          _id: "user_guide_12",
          guideProfileId: "guide_prof_12",
          name: "Simran Kaur",
          email: "simran.k@guidelink.com",
          mobile: "+91 9689012345",
          age: 27,
          state: "Punjab",
          country: "India",
          languages: ["English", "Punjabi", "Hindi"],
          experience: "4+ Years",
          specializations: ["Sikh Heritage", "Rural Tourism", "Punjabi Cuisine"],
          description: "Simran offers authentic Punjabi experiences from Golden Temple visits to village stays. Her tours showcase Punjab's warm hospitality and vibrant culture.",
          photo: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.7,
          numReviews: 73,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-05", available: false },
            { startDate: "2025-11-06", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-01-10", available: false },
            { startDate: "2026-01-11", endDate: "2026-03-31", available: true },
          ],
        },
        {
          _id: "user_guide_13",
          guideProfileId: "guide_prof_13",
          name: "Karthik Pillai",
          email: "karthik.p@guidelink.com",
          mobile: "+91 9590123456",
          age: 34,
          state: "Ladakh",
          country: "India",
          languages: ["English", "Hindi", "Ladakhi"],
          experience: "10+ Years",
          specializations: ["High Altitude Treks", "Monastery Tours", "Photography"],
          description: "Karthik is a seasoned high-altitude guide who knows Ladakh's terrain like the back of his hand. His tours combine adventure with cultural immersion in Buddhist monasteries.",
          photo: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 142,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: false }, // Winter - roads closed
            { startDate: "2026-05-01", endDate: "2026-09-30", available: true },
            { startDate: "2026-10-01", endDate: "2026-10-31", available: false },
          ],
        },
        {
          _id: "user_guide_14",
          guideProfileId: "guide_prof_14",
          name: "Divya Menon",
          email: "divya.m@guidelink.com",
          mobile: "+91 9401234567",
          age: 30,
          state: "Maharashtra",
          country: "India",
          languages: ["English", "Marathi", "Hindi"],
          experience: "7+ Years",
          specializations: ["Bollywood Tours", "Street Art", "Urban Exploration"],
          description: "Divya offers unique Mumbai experiences from Bollywood studio tours to street art walks. She reveals the city's modern culture alongside its historical landmarks.",
          photo: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.8,
          numReviews: 189,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-20", available: true },
            { startDate: "2025-12-21", endDate: "2025-12-31", available: false },
            { startDate: "2026-01-01", endDate: "2026-03-31", available: true },
          ],
        },
        {
          _id: "user_guide_15",
          guideProfileId: "guide_prof_15",
          name: "Manish Joshi",
          email: "manish.j@guidelink.com",
          mobile: "+91 9312345678",
          age: 44,
          state: "Uttarakhand",
          country: "India",
          languages: ["English", "Hindi", "Garhwali"],
          experience: "18+ Years",
          specializations: ["Yoga Retreats", "River Rafting", "Himalayan Treks"],
          description: "Manish combines spirituality with adventure in Rishikesh and surrounding areas. A certified yoga instructor and adventure guide, he offers holistic Himalayan experiences.",
          photo: "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          averageRating: 4.9,
          numReviews: 221,
          availabilityPeriods: [
            { startDate: "2025-11-01", endDate: "2025-11-30", available: true },
            { startDate: "2025-12-01", endDate: "2025-12-31", available: true },
            { startDate: "2026-01-01", endDate: "2026-01-15", available: false },
            { startDate: "2026-01-16", endDate: "2026-04-30", available: true },
          ],
        },
];
      


export const isDateAvailable = (guide: Guide, date: string): boolean => {
    const checkDate = new Date(date);
    
    for (const period of guide.availabilityPeriods) {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      
      if (checkDate >= start && checkDate <= end) {
        return period.available;
      }
    }
    
    // If no period matches, default to unavailable
    return false;
  };

export const getAvailableDates = (guide: Guide, startDate: string, endDate: string): string[] => {
    const availableDates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      if (isDateAvailable(guide, dateStr)) {
        availableDates.push(dateStr);
      }
    }
    
    return availableDates;
};
  

export const isDateRangeAvailable = (guide: Guide, startDate: string, durationInDays: number): boolean => {
    const start = new Date(startDate + 'T00:00:00');
    
    for (let i = 0; i < durationInDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (!isDateAvailable(guide, dateStr)) {
        // If even one day in the range is not available, the whole range is invalid
        return false;
      }
    }
    
    // If the loop completes, all dates in the range are available
    return true;
};


  // export const bookings: Booking[] = [
  //   {
  //     _id: "booking_01",
  //     bookingDate: "2025-10-15",
  //     tourId: "643a1b1a1b8f8a1b1a1b1a1b", // Himalayan Serenity Trek
  //     guideId: "guide_prof_02", // Anjali Sharma
  //     startDate: "2025-11-18",
  //     endDate: "2025-11-22",
  //     totalPrice: 17499,
  //     status: "Upcoming",
  //   },
  //   {
  //     _id: "booking_02",
  //     bookingDate: "2025-08-20",
  //     tourId: "643a1b1a1b8f8a1b1a1b1a1a", // The Crimson Trail of Rajasthan
  //     guideId: "guide_prof_01", // Rohan Verma
  //     startDate: "2025-09-05",
  //     endDate: "2025-09-11",
  //     totalPrice: 12999,
  //     status: "Completed",
  //   },
  //   {
  //     _id: "booking_03",
  //     bookingDate: "2025-06-10",
  //     tourId: "643a1b1a1b8f8a1b1a1b1a1f", // Pink City Explorer
  //     guideId: "guide_prof_01", // Rohan Verma
  //     startDate: "2025-07-01",
  //     endDate: "2025-07-03",
  //     totalPrice: 4999,
  //     status: "Completed",
  //   },
  //   {
  //     _id: "booking_04",
  //     bookingDate: "2025-09-01",
  //     tourId: "643a1b1a1b8f8a1b1a1b1a1c", // Echoes of the Mughal Empire
  //     guideId: "guide_prof_03", // Vikram Singh
  //     startDate: "2025-09-20",
  //     endDate: "2025-09-23",
  //     totalPrice: 8999,
  //     status: "Cancelled",
  //   },
  // ];

export const formLocations = [
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'himachal pradesh', label: 'Himachal Pradesh' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'goa', label: 'Goa' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'ladakh', label: 'Ladakh' },
    { value: 'uttar pradesh', label: 'Uttar Pradesh' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil nadu', label: 'Tamil Nadu' },
    { value: 'west bengal', label: 'West Bengal' },
];
  
export const formLanguages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'local', label: 'Local Language (Varies by region)' },
];


export const bookings: Booking[] = [
    {
      _id: "booking_01",
      bookingDate: "2025-10-15",
      userName: "Alice Johnson",
      userEmail: "alice.j@example.com",
      tourId: "643a1b1a1b8f8a1b1a1b1a1b", // Himalayan Serenity Trek
      guideId: "guide_prof_02", // Anjali Sharma
      substituteGuideId: "guide_prof_09", // Rahul Khanna (another trekking guide)
      startDate: "2025-11-18",
      endDate: "2025-11-22",
      totalPrice: 17499,
      status: "Upcoming",
      advancePaid: true, // Let's assume 20% is already paid
    },
    {
      _id: "booking_02",
      bookingDate: "2025-08-20",
      userName: "Robert Brown",
      userEmail: "rob.brown@example.com",
      tourId: "643a1b1a1b8f8a1b1a1b1a1a", // The Crimson Trail of Rajasthan
      guideId: "guide_prof_01", // Rohan Verma
      substituteGuideId: "guide_prof_03", // Vikram Singh
      startDate: "2025-09-05",
      endDate: "2025-09-11",
      totalPrice: 12999,
      status: "Completed",
      advancePaid: true,
    },
    {
      _id: "booking_03",
      bookingDate: "2025-06-10",
      userName: "Charlie Davis",
      userEmail: "charlie.d@example.com",
      tourId: "643a1b1a1b8f8a1b1a1b1a1f", // Pink City Explorer
      guideId: "guide_prof_01", // Rohan Verma
      substituteGuideId: "guide_prof_12", // Simran Kaur
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      totalPrice: 4999,
      status: "Completed",
      advancePaid: true,
    },
    {
      _id: "booking_04",
      bookingDate: "2025-09-01",
      userName: "Diana Miller",
      userEmail: "diana.m@example.com",
      tourId: "643a1b1a1b8f8a1b1a1b1a1c", // Echoes of the Mughal Empire
      guideId: "guide_prof_03", // Vikram Singh
      substituteGuideId: "guide_prof_01", // Rohan Verma
      startDate: "2025-09-20",
      endDate: "2025-09-23",
      totalPrice: 8999,
      status: "Cancelled",
      advancePaid: false,
    },
];
  

export const customTourRequests: CustomTourRequest[] = [
  {
    _id: "req_001",
    userName: "Olivia Martinez",
    userEmail: "olivia.m@example.com",
    locations: ["Rajasthan", "Agra"],
    language: "english",
    startDate: "2026-02-10",
    endDate: "2026-02-20",
    numTravelers: 2,
    specialRequests: "We are interested in photography and would love a guide who can help with finding scenic spots. Also interested in luxury heritage hotels.",
    submissionDate: "2025-10-28",
    status: "Pending",
    assignedGuideId: null,
    quotedPrice: null,
    adminNotes: ""
  },
  {
    _id: "req_002",
    userName: "Benjamin Carter",
    userEmail: "ben.c@example.com",
    locations: ["Kerala"],
    language: "local",
    startDate: "2026-03-05",
    endDate: "2026-03-12",
    numTravelers: 4,
    specialRequests: "Family trip with two children (ages 8 and 11). Looking for a mix of relaxation (backwaters) and light activities. Need family-friendly accommodations.",
    submissionDate: "2025-10-25",
    status: "Quoted",
    assignedGuideId: "guide_prof_04", // Priya Nair
    quotedPrice: 75000,
    adminNotes: "Priya is excellent with families. Quoted price includes a private houseboat and child-friendly activities."
  },
  {
    _id: "req_003",
    userName: "Sophia Loren",
    userEmail: "sophia.l@example.com",
    locations: ["Delhi", "Varanasi"],
    language: "french",
    startDate: "2026-01-15",
    endDate: "2026-01-22",
    numTravelers: 1,
    specialRequests: "Solo traveler interested in spiritual and historical sites. Would prefer a female guide if possible.",
    submissionDate: "2025-10-22",
    status: "Pending",
    assignedGuideId: null,
    quotedPrice: null,
    adminNotes: ""
  },
];
  

export const addOnPerks: AddOnPerk[] = [
  {
    _id: "perk_06",
    title: "Comfort Hotel Stay",
    description: "Daily stay in a well-reviewed 3-star hotel with breakfast. Price is per person, per night.",
    price: 4500,
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Accommodation",
  },
  {
    _id: "perk_07",
    title: "Full Meal Plan (Lunch & Dinner)",
    description: "Enjoy authentic local cuisine with pre-arranged lunch and dinner at top-rated restaurants. Price is per person, per day.",
    price: 2000,
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Culinary",
  },
  {
    _id: "perk_08",
    title: "Local Cooking Class",
    description: "Learn the secrets of local cuisine in a hands-on cooking session with a professional chef. A delicious, immersive experience.",
    price: 3000,
    image: "https://images.pexels.com/photos/3764353/pexels-photo-3764353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Culinary",
  },
  {
    _id: "perk_02",
    title: "Private Heritage Tour",
    description: "A deep dive into the history and cultural significance of a key local landmark with your private guide.",
    price: 4000,
    image: "https://images.pexels.com/photos/9848512/pexels-photo-9848512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Heritage Tour",
  },
  {
    _id: "perk_05",
    title: "Spice Market Tour",
    description: "An immersive walk through a vibrant local spice market with an expert guide to explain the local flora.",
    price: 2500,
    image: "https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Spice Market Tour",
  },
  {
    _id: "perk_04",
    title: "Handicraft Workshop",
    description: "A hands-on workshop or a guided shopping tour focused on local traditional crafts like pottery or textiles.",
    price: 3000,
    image: "https://images.pexels.com/photos/4101138/pexels-photo-4101138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Handicraft Tour",
  },
  {
    _id: "perk_01",
    title: "Eco-Adventure Tour",
    description: "An environmentally conscious excursion focusing on local nature, wildlife, and conservation efforts.",
    price: 3500,
    image: "https://images.pexels.com/photos/1654228/pexels-photo-1654228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Eco Tour",
  },
  {
    _id: "perk_03",
    title: "Day Trip Excursion",
    description: "A full-day excursion to a nearby point of interest outside the main tour itinerary, includes private transport.",
    price: 5000,
    image: "https://images.pexels.com/photos/3889857/pexels-photo-3889857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "One-day Tour",
  },
];


export const adminLocations: AdminLocation[] = [
  {
    _id: 'loc_01',
    placeName: 'Delhi',
    pricePerPerson: 2500,
    description: 'Explore the vibrant capital, a blend of ancient history and modernity. From Mughal forts to bustling markets, Delhi has it all.',
    image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    addOns: [
      { title: 'Comfort Hotel Stay (per night)', price: 4000 },
      { title: 'Full Meal Plan (per day)', price: 1800 },
      { title: 'Airport Transfer', price: 1500 },
    ],
  },
  {
    _id: 'loc_02',
    placeName: 'Jaipur',
    pricePerPerson: 2200,
    description: "Discover the Pink City's royal heritage through its majestic forts, opulent palaces, and rich cultural traditions.",
    image: 'https://i.pinimg.com/736x/7f/eb/85/7feb8540c9b74207a5d7b3bde8a4538f.jpg',
    addOns: [
      { title: 'Heritage Hotel Stay (per night)', price: 7500 },
      { title: 'Full Meal Plan (per day)', price: 2000 },
      { title: 'Cooking Class', price: 2500 },
    ],
  },
  {
    _id: 'loc_03',
    placeName: 'Manali',
    pricePerPerson: 3000,
    description: 'Escape to the breathtaking landscapes of the Himalayas. This destination offers serene valleys and thrilling mountain adventures.',
    image: 'https://i.pinimg.com/736x/f2/5f/e1/f25fe1b9e9dbf4ffded1247f20028431.jpg',
    addOns: [
      { title: 'Mountain View Hotel (per night)', price: 5500 },
      { title: 'Adventure Sports Pass', price: 3500 },
    ],
  },
];


export const languageOptions: LanguageOption[] = [
  {
    _id: 'lang_01',
    languageName: 'Hindi',
    extraCharge: 0,
  },
  {
    _id: 'lang_02',
    languageName: 'English',
    extraCharge: 0,
  },
  {
    _id: 'lang_03',
    languageName: 'Russian',
    extraCharge: 800,
  },
  {
    _id: 'lang_04',
    languageName: 'Spanish',
    extraCharge: 650,
  },
  {
    _id: 'lang_05',
    languageName: 'French',
    extraCharge: 650,
  },
];


export const myBookingsData: Booking[] = [
  // --- Bookings for Alice Johnson (alice.j@example.com) ---
  {
    _id: "booking_01",
    bookingDate: "2025-11-01",
    userName: "Alice Johnson",
    userEmail: "alice.j@example.com",
    tourId: "tour_02", // Himalayan Serenity Trek
    guideId: "guide_prof_02", // Anjali Sharma
    substituteGuideId: "guide_prof_09", 
    startDate: "2025-12-10",
    endDate: "2025-12-14",
    totalPrice: 17499,
    status: "Upcoming",
    advancePaid: true,
  },
  {
    _id: "booking_04",
    bookingDate: "2025-10-25",
    userName: "Alice Johnson",
    userEmail: "alice.j@example.com",
    tourId: "tour_04", // Kerala Backwaters Retreat
    guideId: "guide_prof_04", // Priya Nair
    substituteGuideId: "guide_prof_10", 
    startDate: "2025-09-15",
    endDate: "2025-09-19",
    totalPrice: 31998, // Price for 2 people
    status: "Completed",
    advancePaid: true,
  },

  // --- Bookings for Robert Brown (rob.brown@example.com) ---
  {
    _id: "booking_02",
    bookingDate: "2025-08-20",
    userName: "Robert Brown",
    userEmail: "rob.brown@example.com",
    tourId: "tour_01", // The Crimson Trail of Rajasthan
    guideId: "guide_prof_01", // Rohan Verma
    substituteGuideId: "guide_prof_03", 
    startDate: "2025-10-05",
    endDate: "2025-10-11",
    totalPrice: 12999,
    status: "Completed",
    advancePaid: true,
  },
  {
    _id: "booking_05",
    bookingDate: "2025-11-05",
    userName: "Robert Brown",
    userEmail: "rob.brown@example.com",
    tourId: "tour_06", // Classic Golden Triangle
    guideId: "guide_prof_03", // Vikram Singh
    substituteGuideId: "guide_prof_01", 
    startDate: "2025-12-20",
    endDate: "2025-12-22",
    totalPrice: 17998, // Price for 2 people
    status: "Upcoming",
    advancePaid: true,
  },


  // --- Bookings for Charlie Davis (charlie.d@example.com) ---
  {
    _id: "booking_03",
    bookingDate: "2025-09-01",
    userName: "Charlie Davis",
    userEmail: "charlie.d@example.com",
    tourId: "tour_03", // Echoes of the Mughal Empire
    guideId: "guide_prof_03", // Vikram Singh
    substituteGuideId: "guide_prof_01", 
    startDate: "2025-09-20",
    endDate: "2025-09-23",
    totalPrice: 8999,
    status: "Cancelled",
    advancePaid: false,
  },
];


export const subscriptionPlans: SubscriptionPlan[] = [
  {
    _id: 'plan_explorer',
    title: 'Explorer',
    duration: '3 Months Plan',
    totalPrice: 4500,
    monthlyPrice: 1500,
    benefits: [
      'Certified Guide Badge',
      'Listing on Certified Guides Page',
      'Receive Direct Booking Inquiries',
      'Standard Support',
    ],
    popular: false,
  },
  {
    _id: 'plan_pro',
    title: 'Pro',
    duration: '6 Months Plan',
    totalPrice: 7200,
    monthlyPrice: 1200,
    benefits: [
      'All features from Explorer',
      'Priority Listing in Search Results',
      'Access to Performance Analytics',
      'Featured in a Monthly Newsletter',
    ],
    popular: true,
  },
  {
    _id: 'plan_partner',
    title: 'Partner',
    duration: '1 Year Plan',
    totalPrice: 10800,
    monthlyPrice: 900,
    benefits: [
      'All features from Pro',
      'Dedicated Account Manager',
      'Premium 24/7 Support',
      'Early Access to New Features',
    ],
    popular: false,
  },
];