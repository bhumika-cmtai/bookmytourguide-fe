// app/dashboard/admin/bookings/[bookingId]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchBookingById,
  updateBookingStatus,
} from "@/lib/redux/thunks/booking/bookingThunks";
import { getAllGuides } from "@/lib/redux/thunks/guide/guideThunk"; // Maan rahe hain ki yeh thunk aapke paas hai
import type { Booking, Guide, BookingStatus } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  AlertCircle,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Edit,
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

export default function AdminBookingDetailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { bookingId } = params;

  const {
    currentBooking: booking,
    loading: bookingLoading,
    error: bookingError,
  } = useAppSelector((state) => state.bookings);
  // Maan rahe hain ki aapke paas guideSlice bhi hai
  const { guides, loading: guidesLoading } = useAppSelector(
    (state) => state.guide
  );

  const [newStatus, setNewStatus] = useState<BookingStatus | "">("");

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId as string));
      dispatch(getAllGuides()); // Substitute assign karne ke liye saare guides fetch karein
    }
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (booking) {
      setNewStatus(booking.status);
    }
  }, [booking]);

  const handleStatusUpdate = () => {
    if (!newStatus || newStatus === booking?.status) return;
    dispatch(
      updateBookingStatus({ bookingId: bookingId as string, status: newStatus })
    )
      .unwrap()
      .then(() => toast.success("Booking status updated successfully!"))
      .catch((err) => toast.error(err || "Failed to update status."));
  };

  // Yahaan hum check kar rahe hain ki data load ho raha hai ya nahi
  if (bookingLoading || guidesLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  // Error handling
  if (bookingError) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Error</h2>
        <p className="text-muted-foreground">{bookingError}</p>
      </div>
    );
  }

  // Agar booking nahi milti hai
  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Booking not found.</h2>
      </div>
    );
  }

  const tour = typeof booking.tour === "object" ? booking.tour : null;
  const guide = typeof booking.guide === "object" ? booking.guide : null;
  const user = typeof booking.user === "object" ? booking.user : null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Bookings
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
      <p className="text-muted-foreground mb-8">Booking ID: {booking._id}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Update Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as BookingStatus)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={newStatus === booking.status}
              >
                <Edit className="w-4 h-4 mr-2" /> Update Status
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
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
                <UserIcon className="w-6 h-6 text-primary" />
                <p>
                  <strong>Guests:</strong> {booking.numberOfTourists}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" />{" "}
                <span className="font-bold">{user?.name}</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" /> {user?.email}
              </p>
              {user?.mobile && (
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" /> {user.mobile}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assigned Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src={guide?.photo || "/placeholder.png"}
                  alt={guide?.name || "Guide"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{guide?.name}</p>
                  <p className="text-xs text-muted-foreground">Main Guide</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}