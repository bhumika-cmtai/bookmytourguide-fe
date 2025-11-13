"use client";

import { useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCustomTourRequestById } from "@/lib/redux/thunks/customTour/customTourThunks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  User,
  MapPin,
  Calendar,
  Languages,
  IndianRupee,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const PaymentCard = ({ request }: { request: any }) => {
  // This logic can be further enhanced with real payment integration
  const { status, quotedPrice } = request;

  if (status === "Pending") {
    return (
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Awaiting Quote</AlertTitle>
        <AlertDescription>Our team is reviewing your request.</AlertDescription>
      </Alert>
    );
  }
  if (status === "Quoted" && quotedPrice) {
    const advanceAmount = quotedPrice * 0.2;
    return (
      <div className="space-y-4">
        <p>
          To confirm, please pay 20% advance:{" "}
          <span className="font-bold">₹{advanceAmount.toLocaleString()}</span>.
        </p>
        <Button size="lg" className="w-full">
          <CreditCard className="w-5 h-5 mr-2" /> Pay Advance
        </Button>
      </div>
    );
  }
  if (status === "Booked" && quotedPrice) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Booking Confirmed!</AlertTitle>
        <AlertDescription>Your advance has been paid.</AlertDescription>
      </Alert>
    );
  }
  return null;
};

export default function CustomRequestDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const requestId = params.requestId as string;

  const {
    currentRequest: request,
    detailLoading,
    detailError,
  } = useAppSelector((state) => state.customTour);

  useEffect(() => {
    if (requestId) {
      dispatch(fetchCustomTourRequestById(requestId));
    }
  }, [dispatch, requestId]);

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
  if (!request) return (<div>Not found</div>);

  return (
    <div className="min-h-screen bg-muted/50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Custom Request</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 mt-1" />
                  <div>
                    <p className="text-muted-foreground">Destinations</p>
                    <p className="font-semibold">
                      {request.selectedLocations
                        ?.map((loc: any) => loc.placeName)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-4 h-4 mt-1" />
                  <div>
                    <p className="text-muted-foreground">Dates</p>
                    <p className="font-semibold">
                      {request.dateRange?.from
                        ? new Date(request.dateRange.from).toLocaleDateString()
                        : "Flexible"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="w-4 h-4 mt-1" />
                  <div>
                    <p className="text-muted-foreground">Travelers</p>
                    <p className="font-semibold">{request.numTravelers}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Languages className="w-4 h-4 mt-1" />
                  <div>
                    <p className="text-muted-foreground">Language</p>
                    <p className="font-semibold">
                      {request.selectedLanguage?.languageName || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {request.status !== "Pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Custom Quote</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Admin Notes: {request.adminNotes || "No additional notes."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
                <Badge className="w-fit">{request.status}</Badge>
              </CardHeader>
              <CardContent>
                {request.quotedPrice && (
                  <>
                    <div className="flex justify-between items-baseline mb-4">
                      <p className="text-lg text-muted-foreground">
                        Total Quote
                      </p>
                      <p className="text-4xl font-extrabold text-primary">
                        ₹{request.quotedPrice.toLocaleString()}
                      </p>
                    </div>
                    <Separator className="my-6" />
                  </>
                )}
                <PaymentCard request={request} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
