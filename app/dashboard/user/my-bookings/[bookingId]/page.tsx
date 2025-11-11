"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchBookingById,
  cancelAndRefundBooking,
} from "@/lib/redux/thunks/booking/bookingThunks";
import type { Booking, BookingStatus, Guide } from "@/lib/data";
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
  Undo2,
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

const GuideInfo = ({ guide }: { guide: Guide }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <Image
        src={guide.photo || "/placeholder.png"}
        alt={guide.name}
        width={60}
        height={60}
        className="rounded-full object-cover"
      />
      <div>
        <p className="font-bold text-lg">{guide.name}</p>
        <p className="text-sm text-muted-foreground">Your Assigned Guide</p>
      </div>
    </div>
    <p className="flex items-center gap-3">
      <Mail className="w-5 h-5" /> {guide.email}
    </p>
    {guide.mobile && (
      <p className="flex items-center gap-3">
        <Phone className="w-5 h-5" /> {guide.mobile}
      </p>
    )}
  </div>
);

export default function UserBookingDetailsPage() {
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

  const handleCancel = () => {
    if (!booking) return;
    if (
      confirm(
        "Are you sure you want to cancel this booking? Your advance payment will be refunded."
      )
    ) {
      dispatch(cancelAndRefundBooking(booking._id))
        .unwrap()
        .then(() =>
          toast.success("Booking cancelled and refund initiated successfully!")
        )
        .catch((err) => toast.error(err || "Failed to cancel booking."));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold">
          {error ? "Error" : "Booking Not Found"}
        </h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const tour = typeof booking.tour === "object" ? booking.tour : null;
  const guide = typeof booking.guide === "object" ? booking.guide : null;

  if (!tour || !guide) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Incomplete Data</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/user/my-bookings")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Bookings
        </Button>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              {tour.title}
            </h1>
            <p className="text-muted-foreground">Booking ID: {booking._id}</p>
          </div>
          <Badge
            variant={getStatusVariant(booking.status)}
            className="text-md px-4 py-2 w-fit"
          >
            {booking.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <Image
                  src={tour.images?.[0] || "/placeholder.png"}
                  alt={tour.title}
                  width={1200}
                  height={600}
                  className="rounded-t-lg object-cover w-full h-80"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tourists</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {booking.numberOfTourists}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location(s)</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {tour.locations?.join(", ") || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide Information</CardTitle>
              </CardHeader>
              <CardContent>
                <GuideInfo guide={guide} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {booking.status === "Upcoming" ? (
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <Undo2 className="w-4 h-4 mr-2" />
                    Cancel & Refund
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    This booking cannot be cancelled.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
