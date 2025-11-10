// app/tours/[id]/select-guide/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, notFound, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { GuideCard } from "@/components/GuideCard";
import HeroSection from "@/components/all/CommonHeroSection";
import { XCircle } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import { getAllGuides } from "@/lib/redux/thunks/guide/guideThunk";
import { fetchPackages } from "@/lib/redux/thunks/admin/packageThunks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const GuideCardSkeleton = () => (
  <Card className="animate-pulse">
    <div className="w-full h-56 bg-gray-300 rounded-t-lg"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </Card>
);

function GuideSelectionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const tourId = Array.isArray(params.id) ? params.id[0] : params.id;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const numberOfTourists = searchParams.get("tourists");

  const { items: packages, loading: packagesLoading } = useSelector(
    (state: RootState) => state.packages
  );
  const {
    guides,
    loading: guidesLoading,
    error,
  } = useSelector((state: RootState) => state.guide);

  // Find the tour
  const tour = packages.find((t) => t._id === tourId);

  useEffect(() => {
    dispatch(getAllGuides({ approved: true }));
  }, [dispatch]); // Remove packages.length dependency

  useEffect(() => {
    if (packages.length === 0 && packagesLoading !== 'pending') {
      dispatch(fetchPackages());
    }
  }, [dispatch, packages.length, packagesLoading]); // Separate effect for packages

  const uniqueLanguages = useMemo(() => {
    const languages = new Set<string>();
    guides.forEach((guide) => {
      if (guide.isApproved && guide.isCertified) {
        guide.languages?.forEach((lang) => languages.add(lang));
      }
    });
    return ["all", ...Array.from(languages)];
  }, [guides]);

  const availableGuides = useMemo(() => {
    if (!startDate || !endDate || guides.length === 0) {
      return [];
    }

    const bookingStart = new Date(startDate);
    bookingStart.setUTCHours(0, 0, 0, 0);

    const bookingEnd = new Date(endDate);
    bookingEnd.setUTCHours(0, 0, 0, 0);

    const qualifiedGuides = guides.filter(
      (guide) => guide.isApproved && guide.isCertified
    );

    const dateFilteredGuides = qualifiedGuides.filter((guide) => {
      if (!guide.unavailableDates || guide.unavailableDates.length === 0) {
        return true;
      }

      const isUnavailable = guide.unavailableDates.some((unavailableDateStr) => {
        const unavailableDate = new Date(unavailableDateStr);
        unavailableDate.setUTCHours(0, 0, 0, 0);
        return unavailableDate >= bookingStart && unavailableDate <= bookingEnd;
      });

      return !isUnavailable;
    });

    if (selectedLanguage === "all") {
      return dateFilteredGuides;
    }

    return dateFilteredGuides.filter((guide) =>
      guide.languages?.some(
        (lang) => lang.toLowerCase() === selectedLanguage.toLowerCase()
      )
    );
  }, [guides, startDate, endDate, selectedLanguage]);

  // FIXED: Better loading state handling
  const isLoading = packagesLoading === "pending" || guidesLoading;
  
  // FIXED: Only show loading skeleton if we're actually loading
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <GuideCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // FIXED: Check for missing query params BEFORE checking for tour
  if (!startDate || !endDate || !numberOfTourists) {
    notFound();
  }

  // FIXED: Only call notFound() if packages have loaded AND tour is still not found
  // This prevents premature 404 on page refresh
  if (packagesLoading === "succeeded" && !tour) {
    notFound();
  }

  // FIXED: Guard against accessing tour properties while still loading
  if (!tour) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold">Loading tour information...</div>
      </div>
    );
  }

  const formattedStartDate = new Date(startDate + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric" }
  );
  const formattedEndDate = new Date(endDate + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric" }
  );

  return (
    <main>
      <HeroSection
        badgeText={`For ${numberOfTourists} Guest(s) from ${formattedStartDate} - ${formattedEndDate}`}
        title="Available Local Guides"
        description={`Here are the expert guides available for your ${tour.title} tour.`}
        backgroundImage="/3.jpg"
      />

      <section className="py-6 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 flex justify-center">
          <div className="w-full md:w-72">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Filter by Language" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="capitalize">
                    {lang === "all" ? "All Languages" : lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          {availableGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableGuides.map((guide, index) => {
                const checkoutHref = `/checkout?tourId=${tourId}&guideId=${guide._id}&startDate=${startDate}&endDate=${endDate}&tourists=${numberOfTourists}`;
                return (
                  <div
                    key={guide._id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "forwards",
                      opacity: 0,
                    }}
                  >
                    <GuideCard guide={guide} checkoutHref={checkoutHref} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 max-w-lg mx-auto">
              <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
              <h2 className="text-3xl font-bold mb-2">No Guides Available</h2>
              <p className="text-muted-foreground text-lg">
                Unfortunately, no guides are available that match your criteria.
                Please go back and try a different date or language.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function SelectGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen font-bold text-xl">
            Loading available guides...
          </div>
        }
      >
        <GuideSelectionContent />
      </Suspense>
    </div>
  );
}