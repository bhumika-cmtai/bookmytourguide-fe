// app/my-custom-requests/[requestId]/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { customTourRequests as initialRequests, guides } from '@/lib/data';
import type { CustomTourRequest } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { User, MapPin, Calendar, Languages, IndianRupee, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';

const PaymentCard = ({ request, onPaymentSuccess }: { request: CustomTourRequest, onPaymentSuccess: () => void }) => {
    const router = useRouter();
    const { status, quotedPrice } = request;

    if (status === 'Pending') {
        return (
            <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Awaiting Quote</AlertTitle>
                <AlertDescription>Our team is reviewing your request. We will notify you via email once your personalized quote is ready.</AlertDescription>
            </Alert>
        );
    }

    if (status === 'Quoted' && quotedPrice) {
        const advanceAmount = quotedPrice * 0.20;
        return (
            <div className="space-y-4">
                <p className="text-lg">To confirm your booking, please pay a 20% advance of <span className="font-bold text-primary">₹{advanceAmount.toLocaleString()}</span>.</p>
                <Button size="lg" className="w-full red-gradient" onClick={onPaymentSuccess}>
                    <CreditCard className="w-5 h-5 mr-2" /> Pay 20% Advance
                </Button>
            </div>
        );
    }
    
    if (status === 'Booked' && quotedPrice) {
        const remainingAmount = quotedPrice * 0.80;
        return (
             <div className="space-y-4">
                <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Advance Paid!</AlertTitle>
                    <AlertDescription className="text-green-700">Your booking is confirmed. The remaining balance is due before the tour starts.</AlertDescription>
                </Alert>
                <p className="text-lg">Ready to complete your payment? Pay the remaining 80%: <span className="font-bold text-primary">₹{remainingAmount.toLocaleString()}</span>.</p>
                <Button size="lg" className="w-full">
                    <CreditCard className="w-5 h-5 mr-2" /> Pay Rest 80% & Begin Tour
                </Button>
            </div>
        );
    }

    return null;
};


export default function CustomRequestDetailPage({ params }: { params: { requestId: string } }) {
    const router = useRouter();
    const [request, setRequest] = useState(() => initialRequests.find(r => r._id === params.requestId));

    if (!request) {
        notFound();
    }
    
    const guide = guides.find(g => g.guideProfileId === request.assignedGuideId);
    
    const handlePaymentSuccess = () => {
        // This simulates updating the backend and then the local state.
        console.log("Simulating 20% payment...");
        setRequest(prev => ({ ...prev!, status: 'Booked' }));

        // You would also persist this change, e.g., via an API call.
        // For now, we redirect to a success page.
        const successUrl = `/dashboard/user/payment-success?requestId=${request._id}&amount=${request.quotedPrice! * 0.20}`;
        router.push(successUrl);
    };

    return (
        <div className="min-h-screen bg-muted/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Your Original Request */}
                        <Card>
                            <CardHeader><CardTitle>Your Custom Request</CardTitle></CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
                                <div className="flex gap-3"><MapPin className="w-4 h-4 mt-1" /><div><p className="text-muted-foreground">Destinations</p><p className="font-semibold">{request.locations.join(', ')}</p></div></div>
                                <div className="flex gap-3"><Calendar className="w-4 h-4 mt-1" /><div><p className="text-muted-foreground">Dates</p><p className="font-semibold">{request.startDate ? `${new Date(request.startDate).toLocaleDateString()}` : 'Flexible'}</p></div></div>
                                <div className="flex gap-3"><User className="w-4 h-4 mt-1" /><div><p className="text-muted-foreground">Travelers</p><p className="font-semibold">{request.numTravelers}</p></div></div>
                                <div className="flex gap-3"><Languages className="w-4 h-4 mt-1" /><div><p className="text-muted-foreground">Language</p><p className="font-semibold capitalize">{request.language}</p></div></div>
                            </CardContent>
                        </Card>

                        {/* Admin's Quote */}
                        {request.status !== 'Pending' && (
                            <Card>
                                <CardHeader><CardTitle>Our Custom Quote For You</CardTitle></CardHeader>
                                <CardContent>
                                    {guide && (
                                        <>
                                            <h4 className="font-semibold mb-2">Your Assigned Guide</h4>
                                            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg mb-6">
                                                <img src={guide.photo} alt={guide.name} className="w-16 h-16 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-bold text-lg">{guide.name}</p>
                                                    <p className="text-sm text-muted-foreground">{guide.specializations.join(', ')}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <h4 className="font-semibold mb-2">Admin Notes</h4>
                                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">{request.adminNotes || "No additional notes."}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Status & Payment */}
                    <div className="sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Status</CardTitle>
                                <Badge variant={request.status === 'Quoted' ? 'default' : 'secondary'} className="w-fit">{request.status}</Badge>
                            </CardHeader>
                            <CardContent>
                                {request.quotedPrice && (
                                    <>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <p className="text-lg text-muted-foreground">Total Quote Price</p>
                                        <p className="text-4xl font-extrabold text-primary">₹{request.quotedPrice.toLocaleString()}</p>
                                    </div>
                                    <Separator className="my-6"/>
                                    </>
                                )}
                                <PaymentCard request={request} onPaymentSuccess={handlePaymentSuccess} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}