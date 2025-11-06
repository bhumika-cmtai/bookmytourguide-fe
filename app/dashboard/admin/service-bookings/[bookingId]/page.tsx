// app/dashboard/admin/bookings/[bookingId]/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { notFound } from "next/navigation";
import Image from "next/image";
import { tours, guides, bookings as initialBookings, isDateRangeAvailable } from "@/lib/data";
import type { Booking, Tour, Guide, BookingStatus } from '@/lib/data';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, MapPin, User as UserIcon, Mail, Phone, Calendar, IndianRupee, Shield, UserPlus } from "lucide-react";

// Helper function
const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
        case "Upcoming": return "default";
        case "Completed": return "secondary";
        case "Cancelled": return "destructive";
        default: return "outline";
    }
};

export default function AdminBookingDetailPage({ params }: { params: { bookingId: string } }) {
    const [bookings, setBookings] = useState(initialBookings);
    const booking = bookings.find(b => b._id === params.bookingId);
    
    if (!booking) notFound();

    const tour = tours.find(t => t._id === booking.tourId);
    const mainGuide = guides.find(g => g.guideProfileId === booking.guideId);
    const subGuide = guides.find(g => g.guideProfileId === booking.substituteGuideId);

    if (!tour || !mainGuide) notFound();

    // --- LOGIC FOR FINDING SUITABLE GUIDES ---
    const suitableSubstituteGuides = useMemo(() => {
        const tourDuration = (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24) + 1;
        
        return guides.filter(guide => {
            // Must not be the main guide
            if (guide.guideProfileId === mainGuide.guideProfileId) return false;
            // Check if guide is available for the entire tour duration
            return isDateRangeAvailable(guide, booking.startDate, tourDuration);
        });
    }, [booking, mainGuide]);

    const handleAssignSubstitute = (subGuideId: string) => {
        setBookings(prev => prev.map(b => 
            b._id === booking._id ? { ...b, substituteGuideId: subGuideId } : b
        ));
        toast.success("Substitute guide has been assigned!");
    };

    return (
        <div className="min-h-screen bg-muted/50 pt-20">
            <div className="container max-w-5xl mx-auto px-4 py-12">
                <Card className="shadow-lg">
                    <CardHeader className="p-6">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-3xl font-extrabold">Booking Details</CardTitle>
                            <Badge variant={getStatusVariant(booking.status)} className="text-base">{booking.status}</Badge>
                        </div>
                        <CardDescription>Booking ID: {booking._id}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader><CardTitle>{tour.title}</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {tour.locations.join(', ')}</p>
                                    <p className="flex items-center gap-2 mt-2"><Calendar className="w-4 h-4"/> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="flex items-center gap-2"><UserIcon className="w-4 h-4"/> {booking.userName}</p>
                                    <p className="flex items-center gap-2 mt-2"><Mail className="w-4 h-4"/> {booking.userEmail}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Guide Roster</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img src={mainGuide.photo} alt={mainGuide.name} className="w-12 h-12 rounded-full"/>
                                        <div><p className="font-semibold">{mainGuide.name}</p><p className="text-xs text-muted-foreground">Main Guide</p></div>
                                    </div>
                                    <Separator />
                                    {subGuide ? (
                                        <div className="flex items-center gap-3">
                                            <img src={subGuide.photo} alt={subGuide.name} className="w-12 h-12 rounded-full"/>
                                            <div><p className="font-semibold">{subGuide.name}</p><p className="text-xs text-muted-foreground">Substitute Guide</p></div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-center text-muted-foreground py-2">No substitute assigned.</p>
                                    )}

                                    {booking.status === "Upcoming" && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full mt-4"><UserPlus className="w-4 h-4 mr-2"/> {subGuide ? "Change Substitute" : "Assign Substitute"}</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader><DialogTitle>Select a Substitute Guide</DialogTitle></DialogHeader>
                                                <p className="text-sm text-muted-foreground">Showing available guides for the tour period.</p>
                                                <div className="max-h-[50vh] overflow-y-auto space-y-3 p-1">
                                                    {suitableSubstituteGuides.map(guide => (
                                                        <div key={guide._id} className="flex items-center justify-between p-2 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <img src={guide.photo} alt={guide.name} className="w-10 h-10 rounded-full"/>
                                                                <div><p className="font-semibold">{guide.name}</p><p className="text-xs text-muted-foreground">{guide.specializations.join(', ')}</p></div>
                                                            </div>
                                                            <Button size="sm" onClick={() => handleAssignSubstitute(guide.guideProfileId)}>Assign</Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}