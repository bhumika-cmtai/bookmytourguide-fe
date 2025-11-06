// dashboard/user/my-bookings/[bookingId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { myBookingsData as initialBookings, tours, guides } from '@/lib/data';
import type { Booking, Tour, Guide } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, MapPin, User, Shield, IndianRupee, CreditCard, XCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingDetailPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | undefined>(() => 
    initialBookings.find(b => b._id === params.bookingId)
  );
  
  // Find associated data
  const tour = tours.find(t => t._id === booking?.tourId);
  const mainGuide = guides.find(g => g.guideProfileId === booking?.guideId);
  const subGuide = guides.find(g => g.guideProfileId === booking?.substituteGuideId);

  if (!booking || !tour || !mainGuide || !subGuide) {
    notFound();
  }

  const handleFinalPayment = () => {
    // Simulate payment
    console.log("Processing final payment...");
    // In a real app, you would have an API call here.
    
    // Redirect to the success page
    const successUrl = `/dashboard/user/payment-success?bookingId=${booking._id}&amount=${booking.totalPrice * 0.8}`;
    router.push(successUrl);
  };
  
  const handleCancelTrip = () => {
      if (confirm("Are you sure you want to cancel this trip? This action cannot be undone.")) {
          // Simulate state update
          setBooking(prev => ({ ...prev!, status: 'Cancelled' }));
          // In a real app, you'd send this update to your backend.
          toast.success("Your trip has been cancelled.");
      }
  };

  const remainingAmount = booking.totalPrice * 0.80;

  return (
    <div className="min-h-screen bg-muted/50 pt-12">
            <Link href="/dashboard/user/my-bookings" className='bg-black text-white px-4 py-2 rounded-md'>
                Go Back
            </Link>
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <Card className="shadow-lg animate-fade-in-up">
                <CardHeader className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <CardTitle className="text-3xl font-extrabold">{tour.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                                <MapPin className="w-4 h-4" /> {tour.locations.join(', ')}
                            </CardDescription>
                        </div>
                        <Badge variant={booking.status === 'Cancelled' ? 'destructive' : 'default'} className="text-base">
                            {booking.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {/* --- Payment & Action Section --- */}
                    {booking.status === 'Upcoming' && booking.advancePaid && (
                         <Alert className="bg-primary/10 border-primary/20">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <AlertTitle className="font-bold">Your Trip is Confirmed!</AlertTitle>
                            <AlertDescription>
                                The 20% advance has been paid. To begin your tour, please pay the remaining balance of 
                                <span className="font-bold"> ₹{remainingAmount.toLocaleString()}</span>.
                            </AlertDescription>
                            <div className="mt-4 flex gap-4">
                                <Button onClick={handleFinalPayment} className="red-gradient">
                                    <CreditCard className="w-4 h-4 mr-2"/> Pay Rest 80%
                                </Button>
                                <Button variant="destructive" onClick={handleCancelTrip}>
                                    <XCircle className="w-4 h-4 mr-2"/> Cancel Trip
                                </Button>
                            </div>
                        </Alert>
                    )}
                     {booking.status === 'Cancelled' && (
                         <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Trip Cancelled</AlertTitle>
                            <AlertDescription>This booking was cancelled. If you have any questions, please contact support.</AlertDescription>
                        </Alert>
                     )}
                     {booking.status === 'Completed' && (
                         <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Trip Completed</AlertTitle>
                            <AlertDescription>We hope you had an amazing journey!</AlertDescription>
                        </Alert>
                     )}
                    
                    <Separator/>

                    {/* --- Guides Section --- */}
                    <div>
                        <h3 className="font-bold text-xl mb-4">Your Assigned Guides</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Main Guide */}
                            <div className="flex items-center gap-4">
                                <img src={mainGuide.photo} alt={mainGuide.name} className="w-20 h-20 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-lg">{mainGuide.name}</p>
                                    <p className="text-sm text-muted-foreground">Main Guide</p>
                                </div>
                            </div>
                             {/* Substitute Guide */}
                            <div className="flex items-center gap-4">
                                <img src={subGuide.photo} alt={subGuide.name} className="w-20 h-20 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-lg">{subGuide.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3"/>Substitute Guide</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}