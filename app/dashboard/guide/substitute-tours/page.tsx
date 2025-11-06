// app/dashboard/guide/backup-assignments/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { bookings as initialBookings, tours, guides } from '@/lib/data';
import type { Booking, Tour, Guide, BookingStatus } from '@/lib/data';
import { 
  Search, 
  Shield,
  Eye,
  Calendar,
  MapPin,
  User as UserIcon,
  Mail,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

// --- DETAIL SHEET COMPONENT ---
// This component shows the full details of a backup assignment.
function TourDetailSheet({ 
    booking, 
    tour, 
    mainGuide,
    subGuide,
    isOpen, 
    onOpenChange 
}: { 
    booking: Booking; 
    tour: Tour;
    mainGuide: Guide;
    subGuide: Guide;
    isOpen: boolean; 
    onOpenChange: (isOpen: boolean) => void;
}) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-4xl sm:max-w-4xl flex flex-col p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-2xl">Backup Assignment Details</SheetTitle>
                    <SheetDescription>Viewing details for booking ID: {booking._id}</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- LEFT (MAIN DETAILS) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>{tour.title}</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <img src={tour.images[0]} alt={tour.title} className="w-full h-48 object-cover rounded-lg"/>
                                <div className="flex items-center gap-3 text-muted-foreground"><Calendar className="w-4 h-4 text-primary"/><span>{new Date(booking.startDate).toDateString()} to {new Date(booking.endDate).toDateString()}</span></div>
                                <div className="flex items-center gap-3 text-muted-foreground"><MapPin className="w-4 h-4 text-primary"/><span>{tour.locations.join(', ')}</span></div>
                                <div className="flex items-center gap-3 text-muted-foreground"><Clock className="w-4 h-4 text-primary"/><span>{tour.duration}</span></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3"><UserIcon className="w-4 h-4 text-primary"/><span>{booking.userName}</span></div>
                                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary"/><span>{booking.userEmail}</span></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- RIGHT (GUIDE & STATUS) --- */}
                    <div className="space-y-6">
                         <Card>
                            <CardHeader><CardTitle>Guide Roster</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <img src={mainGuide.photo} alt={mainGuide.name} className="w-12 h-12 rounded-full object-cover"/>
                                    <div>
                                        <p className="font-semibold">{mainGuide.name}</p>
                                        <p className="text-sm text-muted-foreground">Main Guide</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <img src={subGuide.photo} alt={subGuide.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary"/>
                                    <div>
                                        <p className="font-semibold">{subGuide.name} (You)</p>
                                        <p className="text-sm text-muted-foreground">Substitute Guide</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Trip Status</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center text-green-600 font-bold">
                                    <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5"/>Booking Status</span>
                                    <span>Confirmed</span>
                                </div>
                                <p className="text-xs text-muted-foreground">This trip is confirmed and the advance payment has been made by the customer. Be prepared in case the main guide is unavailable.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <SheetFooter className="p-6 border-t bg-muted/50">
                    <SheetClose asChild><Button variant="outline">Close</Button></SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}


// --- MAIN PAGE COMPONENT ---
export default function GuideBackupAssignmentsPage() {
  const loggedInGuideId = "guide_prof_09"; // Mock: Rahul Khanna is a substitute in our data

  const [searchTerm, setSearchTerm] = useState('');
  // State to manage which booking's details are being viewed
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const populatedBookings = useMemo(() => {
    return initialBookings
      .filter(b => b.substituteGuideId === loggedInGuideId && b.status === 'Upcoming')
      .map(booking => {
        const tour = tours.find(t => t._id === booking.tourId);
        const mainGuide = guides.find(g => g.guideProfileId === booking.guideId);
        const subGuide = guides.find(g => g.guideProfileId === booking.substituteGuideId);
        return { ...booking, tour, mainGuide, subGuide };
      })
      .filter(item => item.tour && item.mainGuide && item.subGuide);
  }, []);

  const filteredBookings = useMemo(() => {
    return populatedBookings.filter(b => {
        const searchLower = searchTerm.toLowerCase();
        return (
          b.tour!.title.toLowerCase().includes(searchLower) ||
          b.userName?.toLowerCase().includes(searchLower) ||
          b.mainGuide!.name.toLowerCase().includes(searchLower)
        );
      });
  }, [populatedBookings, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-10">
        <section className="py-10 bg-card border-b">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold">My Backup Assignments</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              These are upcoming tours where you are assigned as the substitute guide.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container max-w-7xl mx-auto px-4">
            <Card className="mb-8">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    type="text" 
                    placeholder="Search by tour, customer, or main guide..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {filteredBookings.length > 0 ? filteredBookings.map(item => (
                <Card key={item._id} className="overflow-hidden">
                  <div className="p-6 flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div className="flex gap-4">
                      <img src={item.tour!.images[0]} alt={item.tour!.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg" />
                      <div>
                        <Badge variant="default">{item.status}</Badge>
                        <h3 className="font-bold text-xl mt-1">{item.tour!.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">Customer: <span className="font-medium text-foreground">{item.userName}</span></p>
                        <p className="text-sm text-muted-foreground">Main Guide: <span className="font-medium text-foreground">{item.mainGuide!.name}</span></p>
                        <p className="text-sm text-muted-foreground">Dates: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button variant="outline" onClick={() => setSelectedBooking(item)}>
                        <Eye className="w-4 h-4 mr-2"/> View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-24 bg-card rounded-lg border">
                  <h2 className="text-2xl font-bold">No Backup Assignments</h2>
                  <p className="text-muted-foreground">You are not currently listed as a substitute for any upcoming tours.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* --- RENDER THE DETAIL SHEET WHEN A BOOKING IS SELECTED --- */}
      {selectedBooking && (
        <TourDetailSheet
            isOpen={!!selectedBooking}
            onOpenChange={(isOpen) => !isOpen && setSelectedBooking(null)}
            booking={selectedBooking}
            tour={selectedBooking.tour!}
            mainGuide={selectedBooking.mainGuide!}
            subGuide={selectedBooking.subGuide!}
        />
      )}
    </div>
  );
}