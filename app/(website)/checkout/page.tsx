// app/(website)/checkout/page.tsx
"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MapPin, Users, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useToast } from "@/components/ui/use-toast"
import { verifyPaymentAndCreateBooking } from '@/lib/redux/thunks/booking/bookingThunks';
import { clearBookingError } from '@/lib/redux/bookingSlice';
import { apiService } from '@/lib/service/api';

// --- Thunks for fetching specific data if missing ---
import { fetchPackageById } from '@/lib/redux/thunks/admin/packageThunks';
import { getGuideById } from '@/lib/redux/thunks/guide/guideThunk';

// This makes the Razorpay object available on the window
declare global {
    interface Window {
      Razorpay: any;
    }
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();

    // 1. Get booking parameters from URL
    const tourId = searchParams.get('tourId');
    const guideId = searchParams.get('guideId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const numberOfTourists = searchParams.get('tourists');

    // 2. Get data and loading states from Redux
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { items: packages, loading: packagesLoading } = useSelector((state: RootState) => state.packages);
    const { guides, loading: guidesLoading } = useSelector((state: RootState) => state.guide);
    const { loading: bookingLoading, error, currentBooking } = useSelector((state: RootState) => state.bookings);

    // Find tour and guide from the already-loaded Redux state
    const tour = packages.find(t => t._id === tourId);
    const guide = guides.find(g => g._id === guideId);

    // 3. useEffect to fetch missing data on page refresh
    useEffect(() => {
        // If tourId exists, the tour isn't in state, and we're not already loading, then fetch it.
        if (tourId && !tour && packagesLoading !== 'pending') {
            dispatch(fetchPackageById(tourId));
        }
    }, [dispatch, tourId, tour, packagesLoading]);

    useEffect(() => {
        // If guideId exists, the guide isn't in state, and we are not already loading, then fetch it.
        if (guideId && !guide && !guidesLoading) {
            dispatch(getGuideById(guideId));
        }
    }, [dispatch, guideId, guide, guidesLoading]);

    // Effect for handling booking errors
    useEffect(() => {
        if(error) {
            toast({ variant: "destructive", title: "Booking Failed", description: error });
            dispatch(clearBookingError());
        }
    }, [error, dispatch, toast]);
    
    // Effect for redirecting on successful booking
    useEffect(() => {
        if(currentBooking?._id) {
            router.push(`/booking-success?bookingId=${currentBooking._id}`);
        }
    }, [currentBooking, router]);

    // 4. Handle Payment Logic
    const handlePayment = async () => {
        if (!tour || !guide || !currentUser || !numberOfTourists) {
            console.log("tour- ",tour)
            console.log("guide- ",guide)
            console.log("currentuser- ",currentUser)
            console.log("numberOfTourists- ",numberOfTourists)
            toast({ variant: "destructive", title: "Error", description: "Missing booking details." });
            return;
        }

        const touristsCount = parseInt(numberOfTourists);
        const totalCost = tour.price * touristsCount;
        const advanceAmount = totalCost * 0.20;

        try {
            console.log('Initiating payment request...');
            
            // FIXED: Changed from '/bookings/create-order' to '/bookings/create-order'
            // Since apiService already has '/api' in baseURL, we don't need it here
            const orderResponse = await apiService.post('/api/bookings/create-order', {
                amount: advanceAmount,
                receipt: `receipt_tour_${Date.now()}`
            });
            
            console.log('Order Response:', orderResponse);
            
            // The response structure from apiService is already unwrapped
            // So orderResponse.data contains your actual data
            const order = orderResponse.data;

            if (!order || !order.id) {
                toast({ 
                    variant: "destructive", 
                    title: "Payment Error", 
                    description: "Invalid order response from server." 
                });
                return;
            }

            if (!window.Razorpay) {
                toast({ 
                    variant: "destructive", 
                    title: "Payment Error", 
                    description: "Payment gateway script not loaded." 
                });
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "BookMyTourGuide",
                description: `Advance for ${tour.title}`,
                order_id: order.id,
                handler: function (response: any) {
                    console.log('Payment successful:', response);
                    dispatch(verifyPaymentAndCreateBooking({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        tourId: tourId!,
                        guideId: guideId!,
                        startDate: startDate!,
                        endDate: endDate!,
                        numberOfTourists: touristsCount,
                    }));
                },
                prefill: {
                    name: currentUser.name,
                    email: currentUser.email,
                    contact: currentUser.mobile || "",
                },
                notes: {
                    address: "BookMyTourGuide Booking"
                },
                theme: {
                    color: "#FF0000"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err: any) {
            console.error('Payment Error:', err);
            toast({ 
                variant: "destructive", 
                title: "Payment Error", 
                description: err.message || "Could not initiate payment." 
            });
        }
    };

    // --- RENDER LOGIC ---

    // 5. Loading State UI
    if ((!tour && packagesLoading === 'pending') || (!guide && guidesLoading)) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground text-lg">Loading booking details...</p>
            </div>
        );
    }

    // 6. Invalid URL Check
    if (!tourId || !guideId || !startDate || !endDate || !numberOfTourists) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-destructive">Invalid Booking URL</h1>
                <p className="text-muted-foreground">Missing required parameters. Please start your booking from the tours page.</p>
                <Button onClick={() => router.push('/tours')} className="mt-4">
                    Browse Tours
                </Button>
            </div>
        );
    }

    // 7. Data Not Found Error
    if (!tour || !guide) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-destructive">Booking Information Missing</h1>
                <p className="text-muted-foreground mb-4">
                    Could not find the {!tour ? 'tour' : 'guide'} details. Please go back and try again.
                </p>
                <Button onClick={() => router.push('/tours')} className="mt-4">
                    Browse Tours
                </Button>
            </div>
        );
    }
    
    // 8. Render final component if all data is present
    const touristsCount = parseInt(numberOfTourists);
    const totalCost = tour.price * touristsCount;
    const advanceAmount = totalCost * 0.20;
    const formattedStartDate = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedEndDate = new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Summary Column */}
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
                        <div className="flex items-center gap-3"><MapPin className="w-5 h-5" /><span>{tour.locations.join(', ')}</span></div>
                        <div className="flex items-center gap-3"><User className="w-5 h-5" /><span>Guide: <span className="font-bold">{guide.name}</span></span></div>
                        <div className="flex items-center gap-3"><Users className="w-5 h-5" /><span>{touristsCount} Guest{touristsCount > 1 ? 's' : ''}</span></div>
                        <div className="flex items-center gap-3"><Calendar className="w-5 h-5" /><span>{`${formattedStartDate} to ${formattedEndDate}`}</span></div>
                        <Separator />
                        <div className="flex justify-between items-center text-lg"><span className="font-medium">Total Price:</span><span className="font-bold">₹{totalCost.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center text-2xl"><span className="font-bold text-primary">Advance Payable (20%):</span><span className="font-extrabold text-primary">₹{advanceAmount.toLocaleString()}</span></div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Column */}
            <div className="animate-slide-in-right">
                <h2 className="text-3xl font-bold mb-6">Confirm Your Booking</h2>
                <Card>
                    <CardHeader><CardTitle>Pay Advance to Book</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            You only need to pay 20% of the total amount now to confirm your booking with the guide. The remaining balance can be paid later.
                        </p>
                        <Button 
                            size="lg" 
                            className="w-full text-lg h-14 mt-4 font-bold" 
                            onClick={handlePayment}
                            disabled={bookingLoading}
                        >
                            {bookingLoading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                            ) : (
                                `Pay ₹${advanceAmount.toLocaleString()} Securely`
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Main page component with Suspense wrapper
export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container max-w-5xl mx-auto px-4 py-12">
                <Suspense fallback={
                    <div className="flex justify-center items-center py-40">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground text-lg">Loading checkout...</p>
                    </div>
                }>
                    <CheckoutContent />
                </Suspense>
            </div>
        </div>
    )
}