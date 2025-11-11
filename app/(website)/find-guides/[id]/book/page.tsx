"use client";

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { getGuideById } from '@/lib/redux/thunks/guide/guideThunk';
// NOTE: You'll need to create a thunk to fetch add-on perks dynamically in the future.
import { addOnPerks } from '@/lib/data'; 
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { Calendar as CalendarIcon, Users, CheckSquare, ArrowRight } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format, isBefore } from 'date-fns';

export default function BookGuidePage() {
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const guideId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Get the specific guide and loading state from the Redux store
  const { currentGuide: guide, loading } = useSelector((state: RootState) => state.guide);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });
  const [numTravelers, setNumTravelers] = useState(1);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);

  // Fetch the guide's data when the component mounts or if the ID changes
  useEffect(() => {
    if (guideId) {
      // Only fetch if the correct guide isn't already in the state
      if (!guide || guide._id !== guideId) {
        dispatch(getGuideById(guideId));
      }
    }
  }, [dispatch, guideId, guide]);

  // --- FIX: ROBUST LOADING STATE ---
  // The component is considered "loading" if the Redux loading flag is true,
  // OR if we don't have a guide object yet, OR if the guide in the store
  // doesn't match the ID from the URL. This prevents the premature 404.
  if (loading || !guide || guide._id !== guideId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading Guide Details...</p>
      </div>
    );
  }

  // This check now only runs AFTER the loading is complete.
  // If the API call finished and we still have no guide, it's a true 404.
  if (!guide) {
    return notFound();
  }

  // Disable dates that are unavailable for the guide
  const disabledDays = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today
    if (isBefore(day, today)) return true; // Disable past dates

    // Disable dates from the guide's unavailableDates array
    if (guide.unavailableDates) {
      return guide.unavailableDates.some(
        (unavailableDate) => format(new Date(unavailableDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
    }
    
    return false;
  };

  const handlePerkChange = (perkId: string) => {
    setSelectedPerks(prev =>
      prev.includes(perkId)
        ? prev.filter(id => id !== perkId)
        : [...prev, perkId]
    );
  };

  const formattedDate = date?.from
    ? date.to
      ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
      : format(date.from, "LLL dd, y")
    : "Please select a date range";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <section
        className="relative py-20 md:py-28 bg-cover bg-center"
        style={{ backgroundImage: "url('/3.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50" />
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Book Your Tour with {guide.name}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">Complete the details below to plan your personalized journey with an expert.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-2 bg-background border p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 border-b pb-4">Booking Details</h2>

            <div className="space-y-8">
              {/* Step 1: Dates */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center"><CalendarIcon className="mr-3 h-6 w-6 text-primary" /> Select Your Dates</h3>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 flex justify-center">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={disabledDays}
                    />
                </div>
                 <p className="text-sm text-muted-foreground mt-2 text-center">Only available dates for {guide.name} are shown. Past dates are disabled.</p>
              </div>

              {/* Step 2: Travelers */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center"><Users className="mr-3 h-6 w-6 text-primary" /> Number of Travelers</h3>
                <div className="flex items-center gap-4">
                    <Input
                        type="number"
                        id="numTravelers"
                        value={numTravelers}
                        onChange={(e) => setNumTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                        className="max-w-[120px] h-11 text-center"
                        min="1"
                    />
                    <Label htmlFor="numTravelers" className="text-md">Person(s)</Label>
                </div>
              </div>

              {/* Step 4: Contact Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Your Contact Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name" className="mb-2 block">Full Name</Label>
                        <Input id="name" placeholder="Enter your full name"/>
                    </div>
                    <div>
                        <Label htmlFor="email" className="mb-2 block">Email Address</Label>
                        <Input id="email" type="email" placeholder="you@example.com"/>
                    </div>
                    <div>
                        <Label htmlFor="phone" className="mb-2 block">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+91 12345 67890"/>
                    </div>
                 </div>
              </div>

              <Button size="lg" className="w-full text-lg h-14 mt-6">
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Column: Sticky Guide Info & Summary */}
          <div className="lg:sticky top-24 self-start">
            <div className="bg-background border p-6 rounded-xl shadow-lg">
                <div className="flex flex-col items-center text-center">
                <Image src={guide.photo || '/placeholder-avatar.png'} alt={guide.name} width={128} height={128} className="rounded-full mb-4 border-4 border-primary/20 shadow-md"/>
                <h2 className="text-2xl font-bold">{guide.name}</h2>
                <p className="text-muted-foreground">{guide.state}, {guide.country}</p>
                <div className="flex items-center gap-1.5 mt-2 text-yellow-500">
                    <span className="font-bold text-foreground">{guide.averageRating?.toFixed(1)} ★</span>
                    <span className="text-muted-foreground">({guide.numReviews} reviews)</span>
                </div>
                </div>
                <hr className="my-6"/>
                <div>
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <p className="text-muted-foreground">{guide.languages?.join(', ')}</p>
                    <h4 className="font-semibold mt-4 mb-2">Specializations</h4>
                    <p className="text-muted-foreground">{guide.specializations?.join(', ')}</p>
                </div>
            </div>
            
            <div className="bg-background border p-6 rounded-xl shadow-lg mt-8">
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                <div className="space-y-3 text-muted-foreground">
                    <div className="flex justify-between"><span>Guide:</span><span className="font-medium text-foreground">{guide.name}</span></div>
                    <div className="flex justify-between"><span>Dates:</span><span className="font-medium text-foreground text-right">{formattedDate}</span></div>
                    <div className="flex justify-between"><span>Guests:</span><span className="font-medium text-foreground">{numTravelers} Person(s)</span></div>
                    <div className="flex justify-between"><span>Add-ons:</span><span className="font-medium text-foreground">{selectedPerks.length} Selected</span></div>
                </div>
                <hr className="my-4"/>
                <p className="text-center text-muted-foreground">Total price will be calculated at checkout.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}