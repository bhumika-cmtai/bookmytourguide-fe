// app/custom-tour/page.tsx
"use client"

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { formLocations, formLanguages } from '@/lib/data';
import HeroSection from '@/components/all/CommonHeroSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Send, PartyPopper, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function CustomTourPage() {
    // States for form fields
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [numTravelers, setNumTravelers] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    // States to control popovers explicitly
    const [isLocationsOpen, setLocationsOpen] = useState(false);
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [isFortnightMode, setFortnightMode] = useState(false);
    
    // State for form submission status
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

    // Calculate tour duration in days
    const getTourDuration = () => {
        if (dateRange?.from && dateRange?.to) {
            return differenceInDays(dateRange.to, dateRange.from) + 1;
        }
        return 0;
    };

    const handleDateSelect = (selectedRange: DateRange | undefined) => {
        if (isFortnightMode && selectedRange?.from) {
            const start = selectedRange.from;
            const end = new Date(start);
            end.setDate(start.getDate() + 13);
            setDateRange({ from: start, to: end });
            setCalendarOpen(false);
            setFortnightMode(false);
        } else {
            setDateRange(selectedRange);
            if (selectedRange?.from && selectedRange?.to) {
                setCalendarOpen(false);
            }
        }
    };

    const handleSelectLocation = (locationLabel: string) => {
        const isSelected = selectedLocations.includes(locationLabel);
        if (isSelected) {
            setSelectedLocations(prev => prev.filter(l => l !== locationLabel));
        } else {
            setSelectedLocations(prev => [...prev, locationLabel]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        
        const formData = {
            selectedLocations,
            selectedLanguage,
            dateRange: {
                from: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : null,
                to: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : null,
            },
            tourDuration: getTourDuration(),
            numTravelers,
            fullName,
            email,
            phone,
            specialRequests,
            submittedAt: new Date().toISOString(),
        };

        console.log("=".repeat(50));
        console.log("🎯 CUSTOM TOUR REQUEST SUBMITTED");
        console.log("=".repeat(50));
        console.log("📍 Destinations:", formData.selectedLocations.join(", ") || "None selected");
        console.log("🗣️  Preferred Language:", formData.selectedLanguage || "Not specified");
        console.log("📅 Tour Start Date:", formData.dateRange.from || "Not set");
        console.log("📅 Tour End Date:", formData.dateRange.to || "Not set");
        console.log("⏰ Tour Duration:", formData.tourDuration ? `${formData.tourDuration} days` : "Not calculated");
        console.log("👥 Number of Travelers:", formData.numTravelers || "Not specified");
        console.log("👤 Full Name:", formData.fullName);
        console.log("📧 Email:", formData.email);
        console.log("📱 Phone:", formData.phone || "Not provided");
        console.log("📝 Special Requests:", formData.specialRequests || "None");
        console.log("🕐 Submitted At:", formData.submittedAt);
        console.log("=".repeat(50));
        console.log("\n📦 Complete Form Data Object:");
        console.log(JSON.stringify(formData, null, 2));
        console.log("=".repeat(50));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setFormStatus('submitted');
    };

    if (formStatus === 'submitted') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-center p-4">
                <div className="animate-fade-in-up">
                    <PartyPopper className="w-24 h-24 mx-auto text-primary mb-6" />
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">Request Sent!</h1>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto">
                        Thank you for your submission. You will be contacted shortly.
                    </p>
                    <Button 
                        onClick={() => {
                            setFormStatus('idle');
                            setSelectedLocations([]);
                            setSelectedLanguage('');
                            setDateRange(undefined);
                            setNumTravelers('');
                            setFullName('');
                            setEmail('');
                            setPhone('');
                            setSpecialRequests('');
                        }}
                        className="mt-6"
                        variant="outline"
                    >
                        Submit Another Request
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-10">
                <section className="">
                    <div className="container max-w-4xl mx-auto px-4">
                        <Card className="animate-fade-in-up animate-delay-200">
                            <CardHeader>
                                <CardTitle className="text-3xl">Design Your Custom Tour</CardTitle>
                                <CardDescription>Fill out the form below and we'll create a custom itinerary and quote for you.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Destination Selector */}
                                    <div>
                                        <Label htmlFor="locations" className="font-bold text-lg">Destinations</Label>
                                        <p className="text-sm text-muted-foreground mb-2">Select one or more places you want to visit.</p>
                                        <Popover open={isLocationsOpen} onOpenChange={setLocationsOpen} modal={true}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="flex items-center justify-between w-full p-2 border rounded-md min-h-12 cursor-pointer hover:bg-accent/50 transition-colors bg-background"
                                                    onClick={() => setLocationsOpen(!isLocationsOpen)}
                                                >
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedLocations.length > 0 ? (
                                                            selectedLocations.map(loc => (
                                                                <Badge key={loc} variant="secondary" className="text-base">
                                                                    {loc}
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleSelectLocation(loc);
                                                                        }} 
                                                                        className="ml-1.5 rounded-full outline-none hover:bg-destructive/80"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground">Select locations...</span>
                                                        )}
                                                    </div>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent 
                                                className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-gray-950 border shadow-lg" 
                                                align="start" 
                                                sideOffset={4}
                                                style={{ zIndex: 50 }}
                                            >
                                                <Command className="bg-white dark:bg-gray-950">
                                                    <CommandInput placeholder="Search locations..." className="h-9" />
                                                    <CommandList className="max-h-[300px]">
                                                        <CommandEmpty>No location found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {formLocations.map((location) => (
                                                                <CommandItem 
                                                                    key={location.value} 
                                                                    value={location.label} 
                                                                    onSelect={() => handleSelectLocation(location.label)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Check className={`mr-2 h-4 w-4 ${selectedLocations.includes(location.label) ? "opacity-100" : "opacity-0"}`} />
                                                                    {location.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    
                                    {/* Tour Preferences */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="language" className="font-bold text-lg">Preferred Guide Language</Label>
                                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                                <SelectTrigger className="h-12 bg-white dark:bg-gray-950">
                                                    <SelectValue placeholder="Select a language" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white dark:bg-gray-950 border shadow-lg" style={{ zIndex: 50 }}>
                                                    {formLanguages.map(lang => (
                                                        <SelectItem key={lang.value} value={lang.value}>
                                                            {lang.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="travelers" className="font-bold text-lg">Number of Travelers</Label>
                                            <Input 
                                                id="travelers" 
                                                type="number" 
                                                placeholder="e.g., 2" 
                                                value={numTravelers} 
                                                onChange={e => setNumTravelers(e.target.value)} 
                                                required 
                                                min="1"
                                                className="h-12"
                                            />
                                        </div>
                                    </div>

                                    {/* Duration Selector */}
                                    <div>
                                        <Label className="font-bold text-lg">Tour Duration</Label>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {getTourDuration() > 0 && (
                                                <span className="font-semibold text-primary">Selected: {getTourDuration()} days</span>
                                            )}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen} modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button 
                                                        id="date" 
                                                        variant="outline" 
                                                        className="flex-grow justify-start text-left font-normal h-12 hover:bg-accent/50"
                                                        type="button"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {dateRange?.from ? (
                                                            dateRange.to ? (
                                                                <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                                                            ) : (
                                                                format(dateRange.from, "LLL dd, y")
                                                            )
                                                        ) : (
                                                            <span>Pick a date range</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent 
                                                    className="w-auto p-0 bg-white dark:bg-gray-950 border shadow-lg" 
                                                    align="start"
                                                    sideOffset={4}
                                                    style={{ zIndex: 50 }}
                                                >
                                                    <div className="p-3 border-b bg-white dark:bg-gray-950">
                                                        <p className="text-sm font-medium">
                                                            {isFortnightMode 
                                                                ? "Select start date for 14-day tour" 
                                                                : "Select start and end dates"}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white dark:bg-gray-950">
                                                        {isFortnightMode ? (
                                                            <Calendar 
                                                                mode="single"
                                                                selected={dateRange?.from}
                                                                onSelect={(date) => {
                                                                    if (date) {
                                                                        handleDateSelect({ from: date, to: undefined });
                                                                    }
                                                                }}
                                                                numberOfMonths={2}
                                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                            />
                                                        ) : (
                                                            <Calendar 
                                                                mode="range"
                                                                selected={dateRange}
                                                                onSelect={handleDateSelect}
                                                                numberOfMonths={2}
                                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                            />
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <Button 
                                                type="button" 
                                                variant="secondary" 
                                                onClick={() => {
                                                    setFortnightMode(true);
                                                    setCalendarOpen(true);
                                                }} 
                                                className="h-12 whitespace-nowrap"
                                            >
                                                Set 14-Day Tour
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Personal Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="fullname" className="font-bold">Full Name</Label>
                                            <Input 
                                                id="fullname" 
                                                placeholder="John Doe" 
                                                value={fullName} 
                                                onChange={e => setFullName(e.target.value)} 
                                                required 
                                                className="h-12"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="font-bold">Email Address</Label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                placeholder="you@example.com" 
                                                value={email} 
                                                onChange={e => setEmail(e.target.value)} 
                                                required 
                                                className="h-12"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone" className="font-bold">Phone Number (Optional)</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            placeholder="+91 9876543210" 
                                            value={phone} 
                                            onChange={e => setPhone(e.target.value)} 
                                            className="h-12"
                                        />
                                    </div>
                                    
                                    {/* Special Requests */}
                                    <div>
                                        <Label htmlFor="requests" className="font-bold text-lg">Special Requests</Label>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Share any special requirements or preferences
                                        </p>
                                        <Textarea 
                                            id="requests" 
                                            placeholder="e.g., accessibility needs, dietary restrictions, specific hotels, activities you'd like to include..." 
                                            value={specialRequests} 
                                            onChange={e => setSpecialRequests(e.target.value)} 
                                            rows={5}
                                            className="resize-none"
                                        />
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        size="lg" 
                                        className="w-full text-lg h-14 red-gradient text-white font-bold hover:opacity-90 transition-opacity" 
                                        disabled={formStatus === 'submitting'}
                                    >
                                        {formStatus === 'submitting' ? (
                                            <>Submitting...</>
                                        ) : (
                                            <>
                                                Send My Request <Send className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
}