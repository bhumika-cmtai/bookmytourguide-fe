"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchMyBookings,
  cancelAndRefundBooking,
} from "@/lib/redux/thunks/booking/bookingThunks";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Calendar,
  MapPin,
  User as UserIcon,
  Undo2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function MyBookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (bookingId: string, tourTitle: string) => void;
}) {
  const tour =
    booking.tour && typeof booking.tour === "object" ? booking.tour : null;
  const guide =
    booking.guide && typeof booking.guide === "object" ? booking.guide : null;

  if (!tour || !guide) return null;

  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case "Upcoming":
        return "default"; // Upcoming is the default/active state
      case "Completed":
        return "secondary";
      case "Cancelled":
        return "destructive"; // Cancelled is a destructive state
      default:
        return "outline";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative h-60 md:h-auto flex-shrink-0">
          <Image
            src={tour.images?.[0] || "/placeholder.png"}
            alt={tour.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </p>
              <h3 className="font-bold text-2xl mt-1 text-foreground">
                {tour.title}
              </h3>
            </div>
            <Badge
              variant={getStatusVariant(booking.status)}
              className="text-sm px-4 py-1"
            >
              {booking.status}
            </Badge>
          </div>
          <div className="border-t my-4 pt-4 space-y-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {Array.isArray(tour.locations) && tour.locations.length > 0
                  ? tour.locations.join(", ")
                  : "Location not specified"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">
                Guide:{" "}
                <span className="font-bold text-foreground">{guide.name}</span>
              </span>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-end">
            <p className="text-3xl font-extrabold text-primary">
              ₹{booking.totalPrice.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              {booking.status === "Upcoming" && (
                <Button
                  variant="destructive"
                  onClick={() => onCancel(booking._id, tour.title)}
                >
                  <Undo2 className="w-4 h-4 mr-2" />
                  Cancel & Refund
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={`/dashboard/user/my-bookings/${booking._id}`}>
                  View Tour Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function MyBookingsPage() {
  const dispatch = useAppDispatch();
  const { bookings, loading, error } = useAppSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = (bookingId: string, tourTitle: string) => {
    if (
      confirm(
        `Are you sure you want to cancel your booking for "${tourTitle}"? Your advance payment will be refunded.`
      )
    ) {
      dispatch(cancelAndRefundBooking(bookingId))
        .unwrap()
        .then(() => {
          toast.success("Booking cancelled! Refund has been initiated.");
        })
        .catch((err) => {
          toast.error(err || "Failed to cancel booking.");
        });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h3 className="text-xl font-semibold">Error loading your bookings</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (bookings && Array.isArray(bookings) && bookings.length > 0) {
      const validBookings = bookings.filter((booking) => {
        if (!booking) return false;
        const tour =
          booking.tour && typeof booking.tour === "object"
            ? booking.tour
            : null;
        const guide =
          booking.guide && typeof booking.guide === "object"
            ? booking.guide
            : null;
        return tour && guide;
      });

      if (validBookings.length === 0) {
        // This case handles if data is malformed but exists
        return (
          <div className="text-center py-16 px-6 bg-card rounded-xl border">
            <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-3xl font-bold mb-2">No Journeys Yet</h2>
            <p className="text-muted-foreground text-lg mb-6">
              You haven't booked any tours.
            </p>
            <Button
              size="lg"
              asChild
              className="red-gradient text-white font-bold"
            >
              <Link href="/tours">Explore Tours</Link>
            </Button>
          </div>
        );
      }

      return (
        <div className="space-y-8">
          {validBookings.map((booking) => (
            <MyBookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-16 px-6 bg-card rounded-xl border">
        <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-3xl font-bold mb-2">No Journeys Yet</h2>
        <p className="text-muted-foreground text-lg mb-6">
          You haven't booked any tours.
        </p>
        <Button size="lg" asChild className="red-gradient text-white font-bold">
          <Link href="/tours">Explore Tours</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <main className="pt-10">
        <section className="py-10">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">My Bookings</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Review your upcoming adventures and revisit your past journeys.
            </p>
          </div>
        </section>
        <section className="pb-12">
          <div className="container max-w-4xl mx-auto px-4">
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
}
