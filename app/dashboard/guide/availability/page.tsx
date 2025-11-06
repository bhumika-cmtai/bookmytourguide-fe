// app/dashboard/guide/my-schedule/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { guides as initialGuides } from '@/lib/data';
import type { AvailabilityPeriod } from '@/lib/data';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon, CheckCircle, XCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';

// --- HELPER FUNCTION ---
// This function "flattens" the date ranges from your data into individual Date objects for the calendar.
const getDatesFromPeriods = (periods: AvailabilityPeriod[], availableStatus: boolean): Date[] => {
    const dates: Date[] = [];
    periods.forEach(period => {
        if (period.available === availableStatus) {
            let currentDate = new Date(period.startDate + 'T00:00:00');
            const endDate = new Date(period.endDate + 'T00:00:00');
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    });
    return dates;
};


export default function GuideSchedulePage() {
    const loggedInGuideId = "guide_prof_01"; // Mock: Assuming Rohan Verma is logged in

    const [guide] = useState(() => initialGuides.find(g => g.guideProfileId === loggedInGuideId)!);
    
    // State to manage the user's current date selections on the calendar
    const [selectedDays, setSelectedDays] = useState<Date[] | undefined>([]);
    
    // State to hold the guide's availability, initialized from mock data
    const [availableDays, setAvailableDays] = useState<Date[]>(() => getDatesFromPeriods(guide.availabilityPeriods, true));
    const [unavailableDays, setUnavailableDays] = useState<Date[]>(() => getDatesFromPeriods(guide.availabilityPeriods, false));

    const [isLoading, setIsLoading] = useState(false);

    // This function applies the user's selection to either the available or unavailable list
    const handleSetAvailability = (isAvailable: boolean) => {
        if (!selectedDays || selectedDays.length === 0) {
            toast.info("Please select one or more dates on the calendar first.");
            return;
        }

        const selectedDateStrings = selectedDays.map(d => d.toISOString().split('T')[0]);
        
        if (isAvailable) {
            // Add to available, remove from unavailable
            const newAvailable = new Set([...availableDays.map(d => d.toISOString().split('T')[0]), ...selectedDateStrings]);
            const newUnavailable = unavailableDays.filter(d => !selectedDateStrings.includes(d.toISOString().split('T')[0]));
            
            setAvailableDays(Array.from(newAvailable).map(ds => new Date(ds + 'T00:00:00')));
            setUnavailableDays(newUnavailable);
            toast.success(`${selectedDays.length} day(s) marked as available.`);
        } else {
            // Add to unavailable, remove from available
            const newUnavailable = new Set([...unavailableDays.map(d => d.toISOString().split('T')[0]), ...selectedDateStrings]);
            const newAvailable = availableDays.filter(d => !selectedDateStrings.includes(d.toISOString().split('T')[0]));

            setUnavailableDays(Array.from(newUnavailable).map(ds => new Date(ds + 'T00:00:00')));
            setAvailableDays(newAvailable);
            toast.success(`${selectedDays.length} day(s) marked as unavailable.`);
        }
        
        setSelectedDays([]); // Clear selection after applying
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        // In a real app, you would convert the `availableDays` and `unavailableDays` arrays
        // back into the `availabilityPeriods` format and send it to your backend API.
        console.log("Simulating save...");
        console.log("New Available Days:", availableDays);
        console.log("New Unavailable Days:", unavailableDays);

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        setIsLoading(false);
        toast.success("Your schedule has been updated successfully!");
    };
    
    // Modifiers for react-day-picker to style the calendar dates
    const modifiers = {
        available: availableDays,
        unavailable: unavailableDays,
    };
    const modifierStyles = {
        available: {
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
            fontWeight: 'bold',
        },
        unavailable: {
            backgroundColor: 'hsl(var(--destructive) / 0.1)',
            color: 'hsl(var(--destructive))',
            textDecoration: 'line-through',
        }
    };

    return (
        <div className="min-h-screen bg-muted/50">
            <main className="pt-10">
                <section className="py-10">
                    <div className="container max-w-7xl mx-auto px-4">
                        <h1 className="text-4xl font-extrabold">My Schedule</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Set your available and unavailable dates. This will determine which tours you are eligible for.
                        </p>
                    </div>
                </section>

                <section className="pb-12">
                    <div className="container max-w-7xl mx-auto px-4">
                        <Card className="shadow-lg">
                           <div className="grid grid-cols-1 lg:grid-cols-3">
                                {/* Left Side: Calendar */}
                                <div className="lg:col-span-2 p-4 flex justify-center border-b lg:border-b-0 lg:border-r">
                                    <Calendar
                                        mode="multiple"
                                        min={0} // Allows selecting multiple dates
                                        selected={selectedDays}
                                        onSelect={setSelectedDays}
                                        modifiers={modifiers}
                                        modifiersStyles={modifierStyles}
                                        numberOfMonths={2}
                                        className="p-3"
                                    />
                                </div>
                                
                                {/* Right Side: Action Panel */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4">Update Your Schedule</h3>
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-start gap-2 mb-6">
                                        <Info className="w-4 h-4 mt-0.5 shrink-0"/>
                                        <p>Select one or more dates on the calendar, then mark them as available or unavailable.</p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleSetAvailability(true)}>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Selected as Available
                                        </Button>
                                        <Button className="w-full" variant="destructive" onClick={() => handleSetAvailability(false)}>
                                            <XCircle className="w-4 h-4 mr-2" /> Mark Selected as Unavailable
                                        </Button>
                                    </div>

                                    <Separator className="my-6"/>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold">Legend</h4>
                                        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-full" style={modifierStyles.available}/> Available</div>
                                        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-full" style={modifierStyles.unavailable}/> Unavailable</div>
                                        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-full bg-primary"/> Selected</div>
                                    </div>

                                    <Separator className="my-6"/>
                                    
                                    <Button size="lg" className="w-full red-gradient" onClick={handleSaveChanges} disabled={isLoading}>
                                        {isLoading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin"/>Saving...</> : 'Save All Changes'}
                                    </Button>
                                </div>
                           </div>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
}