// dashboard/user/my-bookings/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { myBookingsData as bookings, tours, guides } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Ticket, Calendar, MapPin, User as UserIcon } from 'lucide-react';
import type { Booking, Tour, Guide, BookingStatus } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

// --- THIS IS THE COMPLETELY REDESIGNED BOOKING CARD COMPONENT ---
function MyBookingCard({ booking, tour, guide }: { booking: Booking, tour: Tour, guide: Guide }) {
    const getStatusVariant = (status: BookingStatus) => {
        switch (status) {
            case "Upcoming": return "destructive"; // Red color
            case "Completed": return "secondary"; // Dark/Gray color
            case "Cancelled": return "outline";
            default: return "default";
        }
    };

    return (
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative h-60 md:h-auto flex-shrink-0">
            <Image
              src={tour.images[0]}
              alt={tour.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
                <h3 className="font-bold text-2xl mt-1 text-foreground">{tour.title}</h3>
              </div>
              <Badge variant={getStatusVariant(booking.status)} className="text-sm px-4 py-1">
                {booking.status}
              </Badge>
            </div>
            
            <div className="border-t my-4 pt-4 space-y-3 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary"/>
                <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary"/>
                <span className="font-medium">{tour.locations.join(', ')}</span>
              </div>
               <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary"/>
                <span className="font-medium">Guide: <span className="font-bold text-foreground">{guide.name}</span></span>
              </div>
            </div>

            {/* Footer Section of the card */}
            <div className="mt-auto flex justify-between items-end">
              <p className="text-3xl font-extrabold text-primary">
                ₹{booking.totalPrice.toLocaleString()}
              </p>
              <Button asChild variant="outline">
                <Link href={`/dashboard/user/my-bookings/${booking._id}`}>
                  View Tour Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
}


export default function MyBookingsPage() {
  // Data fetching and preparation remains the same
  const populatedBookings = bookings.map(booking => {
    const tour = tours.find(t => t._id === booking.tourId);
    const guide = guides.find(g => g.guideProfileId === booking.guideId);
    return { booking, tour, guide };
  }).filter(item => item.tour && item.guide);

  return (
    <div className="min-h-screen bg-muted/50">
      <main className="pt-10">
        {/* Header Section */}
        <section className="py-10">
            <div className="container max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold">My Bookings</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Review your upcoming adventures and revisit your past journeys.
                </p>
            </div>
        </section>

        {/* Bookings List Section */}
        <section className="pb-12">
          <div className="container max-w-4xl mx-auto px-4">
            {populatedBookings.length > 0 ? (
              <div className="space-y-8">
                {populatedBookings.map(({ booking, tour, guide }) => (
                  <MyBookingCard key={booking._id} booking={booking} tour={tour!} guide={guide!} />
                ))}
              </div>
            ) : (
              // Empty state when there are no bookings
              <div className="text-center py-16 px-6 bg-card rounded-xl border">
                  <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-3xl font-bold mb-2">No Journeys Yet</h2>
                  <p className="text-muted-foreground text-lg mb-6">You haven't booked any tours.</p>
                  <Button size="lg" asChild className="red-gradient text-white font-bold">
                      <Link href="/tours">Explore Tours</Link>
                  </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}