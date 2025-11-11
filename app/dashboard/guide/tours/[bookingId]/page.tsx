// app/dashboard/guide/tours/[bookingId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchBookingById } from "@/lib/redux/thunks/booking/bookingThunks";
import type { BookingStatus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";

const getStatusVariant = (status: BookingStatus) => {
  switch (status) {
    case "Upcoming":
      return "default";
    case "Completed":
      return "secondary";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export default function GuideBookingDetailsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { bookingId } = params;

  const {
    currentBooking: booking,
    loading,
    error,
  } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId as string));
    }
  }, [dispatch, bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Booking not found.</h2>
      </div>
    );
  }

  const tour = typeof booking.tour === "object" ? booking.tour : null;
  const user = typeof booking.user === "object" ? booking.user : null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Bookings
      </Button>
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold">{tour?.title}</h1>
        <Badge
          variant={getStatusVariant(booking.status)}
          className="text-md px-4 py-2"
        >
          {booking.status}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-8">Assignment ID: {booking._id}</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-0">
              <div className="relative w-full h-80 rounded-t-lg overflow-hidden">
                <Image
                  src={tour?.images?.[0] || "/placeholder.png"}
                  alt={tour?.title || "Tour"}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assignment Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <p>
                  <strong>Dates:</strong>{" "}
                  {new Date(booking.startDate).toLocaleDateString()} to{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <p>
                  <strong>Number of Tourists:</strong>{" "}
                  {booking.numberOfTourists}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <p>
                  <strong>Location:</strong> {tour?.locations?.join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-center gap-3 text-lg">
                <User className="w-5 h-5 text-primary" />{" "}
                <span className="font-bold">{user?.name}</span>
              </p>
              <p className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5" /> {user?.email}
              </p>
              {user?.mobile && (
                <p className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" /> {user.mobile}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
