// app/checkout/page.tsx
"use client"

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { tours, guides } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
    const searchParams = useSearchParams();

    const tourId = searchParams.get('tourId');
    const guideId = searchParams.get('guideId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const numberOfTourists = searchParams.get('tourists');

    const tour = tours.find(t => t._id === tourId);
    const guide = guides.find(g => g.guideProfileId === guideId);

    if (!tour || !guide || !startDate || !endDate || !numberOfTourists) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-destructive">Booking Information Missing</h1>
                <p className="text-muted-foreground">Could not load tour details. Please try again.</p>
            </div>
        );
    }
    
    const touristsCount = parseInt(numberOfTourists);
    const totalCost = tour.pricePerPerson * touristsCount;

    const newBookingId = `booking_${Date.now()}`;

    // --- CONSTRUCT THE SUCCESS PAGE URL ---
    const successUrl = `/booking-success?bookingId=${newBookingId}&tourId=${tourId}&guideId=${guideId}&startDate=${startDate}&endDate=${endDate}&tourists=${numberOfTourists}`;

    const formattedStartDate = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Tour Summary Column */}
            <div className="animate-slide-in-left">
                <h2 className="text-3xl font-bold mb-6">Your Booking Summary</h2>
                <Card>
                    <CardHeader>
                        <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                           <Image src={tour.images[0]} alt={tour.title} fill className="object-cover" />
                        </div>
                        <CardTitle className="pt-4 text-2xl">{tour.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span>{tour.locations.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <User className="w-5 h-5 text-primary" />
                            <span>Your Guide: <span className="font-bold text-foreground">{guide.name}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Users className="w-5 h-5 text-primary" />
                            <span>{touristsCount} Guest{touristsCount > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{formattedStartDate} to {formattedEndDate}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-medium">Price per person:</span>
                            <span className="font-bold text-foreground">₹{tour.pricePerPerson.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl">
                            <span className="font-bold">Total Price:</span>
                            <span className="font-extrabold text-primary">₹{totalCost.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Details Column */}
            <div className="animate-slide-in-right">
                <h2 className="text-3xl font-bold mb-6">Payment Details</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Enter Card Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                        </div>
                         <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input id="cardName" placeholder="Your Name" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM / YY" />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" />
                            </div>
                        </div>
                        <Button size="lg" className="w-full text-lg h-14 mt-4 red-gradient text-white font-bold" asChild>
                            <Link href={successUrl}>
                                Pay ₹{totalCost.toLocaleString()} Securely
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// It's best practice to wrap components using useSearchParams in a Suspense boundary
export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container max-w-5xl mx-auto px-4 py-12">
                <Suspense fallback={<div>Loading...</div>}>
                    <CheckoutContent />
                </Suspense>
            </div>
        </div>
    )
}