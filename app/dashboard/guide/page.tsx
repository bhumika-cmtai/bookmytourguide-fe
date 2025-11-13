"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchDashboardStats } from "@/lib/redux/thunks/dashboard/dashboardThunks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  BadgeInfo,
  BadgeCheck,
} from "lucide-react";

type StatCardProps = {
  icon: React.ElementType; // 'icon' ek React component hai, isliye 'ElementType'
  title: string;
  value: string | number; // Value number ya string ho sakti hai
  description?: string;   // 'description' optional ho sakta hai, isliye '?' lagayein
  colorClass?: string;    // 'colorClass' bhi optional hai
};

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, title, value, description, colorClass }:StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass || "text-muted-foreground"}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

// Loading State Skeleton
const DashboardSkeleton = () => (
    <div className="space-y-6 p-8">
        <Skeleton className="h-24" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
    </div>
);


export default function GuideDashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Profile Status Alert
  const ProfileStatusAlert = () => {
    if (!stats || !stats.profileStatus) return null;

    const { isApproved, profileComplete } = stats.profileStatus;

    if (isApproved && profileComplete) {
      return (
        <Alert className="bg-green-50 border-green-200">
          <BadgeCheck className="h-4 w-4 text-green-700" />
          <AlertTitle className="text-green-800">Profile Approved!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your profile is complete and approved by the admin. You can now receive booking requests.
          </AlertDescription>
        </Alert>
      );
    }

    if (!profileComplete) {
      return (
        <Alert variant="destructive">
          <BadgeInfo className="h-4 w-4" />
          <AlertTitle>Action Required: Complete Your Profile</AlertTitle>
          <AlertDescription>
            Your profile is incomplete. Please add all required details like photo, license, and experience to get approved.
            <Button asChild variant="link" className="p-0 h-auto ml-1">
              <Link href="/guide/profile">Update Profile</Link>
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!isApproved && profileComplete) {
        return (
          <Alert>
            <BadgeInfo className="h-4 w-4" />
            <AlertTitle>Profile Submitted for Review</AlertTitle>
            <AlertDescription>
              Your profile is complete and is currently being reviewed by the admin. You will be notified upon approval.
            </AlertDescription>
          </Alert>
        );
      }

    return null;
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load your dashboard stats. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8">No statistics available.</div>;
  }

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 md:p-8 bg-muted/40">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name || "Guide"}!
          </h2>
          <p className="text-muted-foreground">
            Here's a summary of your bookings and profile status.
          </p>
        </div>
      </div>
      
      {/* Profile Status Alert */}
      <ProfileStatusAlert />

      {/* Package Bookings Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Package Tour Bookings</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Bookings"
            value={stats.totalPackageBookings || 0}
            description="Bookings from pre-made packages."
            icon={Package}
            colorClass="text-blue-500"
          />
          <StatCard
            title="Completed"
            value={stats.completedPackageBookings || 0}
            description="Tours you have successfully completed."
            icon={CheckCircle}
            colorClass="text-green-500"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcomingPackageBookings || 0}
            description="Your future scheduled tours."
            icon={Clock}
            colorClass="text-orange-500"
          />
        </div>
      </div>

      {/* Direct Tour Guide Bookings Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Direct Tour Guide Bookings</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Bookings"
            value={stats.totalTourGuideBookings || 0}
            description="Direct bookings made by users for you."
            icon={Briefcase}
            colorClass="text-purple-500"
          />
          <StatCard
            title="Completed"
            value={stats.completedTourGuideBookings || 0}
            description="Direct tours you have completed."
            icon={CheckCircle}
            colorClass="text-green-500"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcomingTourGuideBookings || 0}
            description="Your future scheduled direct tours."
            icon={Clock}
            colorClass="text-orange-500"
          />
        </div>
      </div>
    </div>
  );
}