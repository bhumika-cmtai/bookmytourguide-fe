"use client";

import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchCustomTourRequestById,
  updateCustomTourRequestStatus,
} from "@/lib/redux/thunks/customTour/customTourThunks";
import { toast } from "sonner";
import {
  User,
  MapPin,
  Calendar,
  Languages,
  Send,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// ✅ FIX: Label component ko yahan import karein
import { Label } from "@/components/ui/label";

const statusOptions = ["Pending", "Quoted", "Booked", "Rejected"];

export default function CustomRequestDetailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const requestId = params.requestId as string;

  const { currentRequest, detailLoading, detailError } = useAppSelector(
    (state) => state.customTour
  );
  const [newStatus, setNewStatus] = useState(currentRequest?.status || "");

  useEffect(() => {
    if (requestId) {
      dispatch(fetchCustomTourRequestById(requestId));
    }
  }, [dispatch, requestId]);

  useEffect(() => {
    if (currentRequest) {
      setNewStatus(currentRequest.status);
    }
  }, [currentRequest]);

  const handleStatusUpdate = () => {
    dispatch(updateCustomTourRequestStatus({ requestId, status: newStatus }))
      .unwrap()
      .then(() => toast.success(`Status updated to ${newStatus}`))
      .catch((err) => toast.error(err));
  };

  if (detailLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );

  if (detailError)
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-bold">Error</h2>
        <p>{detailError}</p>
      </div>
    );

  // ✅ FIX: notFound() function ko call karein
  if (!currentRequest) {
    return <div>Not found</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Requests
        </Button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inquiry Details</CardTitle>
                <CardDescription>
                  Request ID: {currentRequest._id}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Destinations</p>
                    <p>
                      {currentRequest.selectedLocations
                        ?.map((loc: any) => loc.placeName)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Dates</p>
                    <p>
                      {currentRequest.dateRange?.from
                        ? `${new Date(
                            currentRequest.dateRange.from
                          ).toLocaleDateString()} - ${new Date(
                            currentRequest.dateRange.to
                          ).toLocaleDateString()}`
                        : "Flexible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Travelers</p>
                    <p>{currentRequest.numTravelers}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Languages className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Language</p>
                    <p>
                      {currentRequest.selectedLanguage?.languageName || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Name:</strong> {currentRequest.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {currentRequest.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {currentRequest.phone || "Not provided"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">Preferred Monuments</p>
                  <p className="text-muted-foreground">
                    {currentRequest.preferredMonuments || "None specified"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Requested Services</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant={currentRequest.needsStay ? "default" : "outline"}
                    >
                      Stay
                    </Badge>
                    <Badge
                      variant={
                        currentRequest.needsLunch ? "default" : "outline"
                      }
                    >
                      Lunch
                    </Badge>
                    <Badge
                      variant={
                        currentRequest.needsDinner ? "default" : "outline"
                      }
                    >
                      Dinner
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Status</Label>
                  <p>
                    <Badge
                      variant={
                        currentRequest.status === "Pending"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {currentRequest.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label htmlFor="status">Update Status</Label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    // ✅ FIX: Styling ko behtar kiya
                    className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <Button className="w-full" onClick={handleStatusUpdate}>
                  <Send className="mr-2 h-4 w-4" /> Save Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
