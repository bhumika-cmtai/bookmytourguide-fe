// app/find-guides/[id]/book/page.tsx
"use client";

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { guides, addOnPerks, getAvailableDates } from '@/lib/data';
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
  const params = useParams();
  const guideId = Array.isArray(params.id) ? params.id[0] : params.id;
  const guide = guides.find(g => g.guideProfileId === guideId);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });
  const [numTravelers, setNumTravelers] = useState(1);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);

  if (!guide) {
    notFound();
  }

  // Disable dates that are not available for the guide
  const disabledDays = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    if (isBefore(day, today)) return true; // Disable past dates

    const dateStr = format(day, 'yyyy-MM-dd');
    const availableDates = getAvailableDates(guide, "2025-01-01", "2026-12-31"); // Fetch a wide range
    return !availableDates.includes(dateStr);
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
                      disabled={disabledDays} // Disable unavailable dates
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

              {/* Step 3: Add-On Services */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center"><CheckSquare className="mr-3 h-6 w-6 text-primary" /> Add-On Services & Itinerary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addOnPerks.map(perk => (
                    <div key={perk._id} className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border transition-all hover:border-primary">
                      <Checkbox
                        id={perk._id}
                        checked={selectedPerks.includes(perk._id)}
                        onCheckedChange={() => handlePerkChange(perk._id)}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                         <label htmlFor={perk._id} className="font-medium cursor-pointer">{perk.title} - (₹{perk.price})</label>
                         <p className="text-sm text-muted-foreground">{perk.description}</p>
                      </div>
                    </div>
                  ))}
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
                <Image src={guide.photo} alt={guide.name} width={128} height={128} className="rounded-full mb-4 border-4 border-primary/20 shadow-md"/>
                <h2 className="text-2xl font-bold">{guide.name}</h2>
                <p className="text-muted-foreground">{guide.state}, {guide.country}</p>
                <div className="flex items-center gap-1.5 mt-2 text-yellow-500">
                    <span className="font-bold text-foreground">{guide.averageRating} ★</span>
                    <span className="text-muted-foreground">({guide.numReviews} reviews)</span>
                </div>
                </div>
                <hr className="my-6"/>
                <div>
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <p className="text-muted-foreground">{guide.languages.join(', ')}</p>
                    <h4 className="font-semibold mt-4 mb-2">Specializations</h4>
                    <p className="text-muted-foreground">{guide.specializations.join(', ')}</p>
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