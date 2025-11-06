// app/dashboard/guide/previous-tours/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { bookings as initialBookings, tours, guides } from '@/lib/data';
import type { Booking, Tour, Guide, BookingStatus } from '@/lib/data';
import { 
  Search, 
  Filter,
  Eye,
  Calendar,
  MapPin,
  User as UserIcon,
  Clock,
  IndianRupee,
  CheckCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// --- HELPER FUNCTIONS (can be moved to a utils file) ---
const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
        case "Upcoming": return "default";
        case "Completed": return "secondary";
        case "Cancelled": return "destructive";
        default: return "outline";
    }
};

// --- TOUR DETAIL SHEET COMPONENT (Identical to the one in current-tours) ---
function TourDetailSheet({ 
    booking, 
    tour, 
    isOpen, 
    onOpenChange 
}: { 
    booking: Booking; 
    tour: Tour;
    isOpen: boolean; 
    onOpenChange: (isOpen: boolean) => void;
}) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-4xl sm:max-w-4xl flex flex-col p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-2xl">Past Trip Details</SheetTitle>
                    <SheetDescription>Viewing booking ID: {booking._id}</SheetDescription>
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

                    {/* --- RIGHT (PAYMENT & STATUS) --- */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Final Status</CardTitle></CardHeader>
                            <CardContent>
                                <Badge variant={getStatusVariant(booking.status)} className="text-lg w-full justify-center py-2">{booking.status}</Badge>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Payment Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total Package Price</span>
                                    <span className="font-semibold">₹{booking.totalPrice.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total Paid</span>
                                    <span className="text-primary">₹{booking.totalPrice.toLocaleString()}</span>
                                </div>
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
export default function GuidePreviousToursPage() {
  const loggedInGuideId = "guide_prof_01"; // Mock: Assuming Rohan Verma is logged in

  const [allBookings, setAllBookings] = useState<Booking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<"Completed" | "Cancelled" | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const populatedBookings = useMemo(() => {
    return allBookings
      .filter(b => b.guideId === loggedInGuideId) // Filter for the logged-in guide
      // --- KEY CHANGE: Only include past tours ---
      .filter(b => b.status === 'Completed' || b.status === 'Cancelled')
      .map(booking => {
        const tour = tours.find(t => t._id === booking.tourId);
        return { ...booking, tour };
      })
      .filter(item => item.tour);
  }, [allBookings]);

  const filteredBookings = useMemo(() => {
    return populatedBookings
      .filter(b => statusFilter === 'all' || b.status === statusFilter)
      .filter(b => {
        const searchLower = searchTerm.toLowerCase();
        return (
          b.tour!.title.toLowerCase().includes(searchLower) ||
          b.userName?.toLowerCase().includes(searchLower)
        );
      });
  }, [populatedBookings, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-10">
        <section className="py-10 bg-card border-b">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold">My Tour History</h1>
            <p className="mt-2 text-lg text-muted-foreground">A record of your completed and cancelled assignments.</p>
          </div>
        </section>

        <section className="py-8">
          <div className="container max-w-7xl mx-auto px-4">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input type="text" placeholder="Search by tour or customer name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-4 py-2 rounded-md border bg-transparent">
                      <option value="all">All Past Tours</option>
                      <option value="Completed">Completed Only</option>
                      <option value="Cancelled">Cancelled Only</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {filteredBookings.length > 0 ? filteredBookings.map(item => (
                <Card key={item._id} className="overflow-hidden">
                  <div className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      <img src={item.tour!.images[0]} alt={item.tour!.title} className="w-24 h-24 object-cover rounded-lg" />
                      <div>
                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                        <h3 className="font-bold text-xl mt-1">{item.tour!.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Customer: <span className="font-medium text-foreground">{item.userName}</span></p>
                        <p className="text-sm text-muted-foreground">Dates: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Button variant="outline" onClick={() => setSelectedBooking(item)}>
                        <Eye className="w-4 h-4 mr-2"/> View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-24 bg-card rounded-lg border">
                  <h2 className="text-2xl font-bold">No Tour History</h2>
                  <p className="text-muted-foreground">You have no completed or cancelled tours in your record.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {selectedBooking && (
        <TourDetailSheet
            isOpen={!!selectedBooking}
            onOpenChange={(isOpen) => !isOpen && setSelectedBooking(null)}
            booking={selectedBooking}
            tour={selectedBooking.tour!}
        />
      )}
    </div>
  );
}