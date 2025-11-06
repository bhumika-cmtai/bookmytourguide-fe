// app/tours/[id]/select-guide/page.tsx
"use client"

import { Suspense } from 'react';
import { useSearchParams, notFound, useParams } from 'next/navigation';

import { guides, tours, isDateRangeAvailable } from '@/lib/data';
import { GuideCard } from '@/components/GuideCard';
import HeroSection from '@/components/all/CommonHeroSection';
import { XCircle } from 'lucide-react';

function GuideSelectionContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    const tourId = Array.isArray(params.id) ? params.id[0] : params.id;
    const tour = tours.find(t => t._id === tourId);

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const numberOfTourists = searchParams.get('tourists');

    if (!tour || !startDate || !endDate || !numberOfTourists) {
        notFound();
    }

    const tourDurationDays = parseInt(tour.duration) || 1;

    // --- Core Filtering Logic ---
    const availableGuides = guides.filter(guide => 
        isDateRangeAvailable(guide, startDate, tourDurationDays)
    );
    // --------------------------

    const formattedStartDate = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const formattedEndDate = new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
        <main>
            <HeroSection
                badgeText={`For ${numberOfTourists} Guest(s) from ${formattedStartDate} - ${formattedEndDate}`}
                title="Available Local Guides"
                description={`Here are the expert guides available for your ${tour.title} tour.`}
                backgroundImage="/3.jpg"
            />

            <section className="py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    {availableGuides.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {availableGuides.map((guide, index) => {
                                // Construct the final checkout link for each guide
                                const checkoutHref = `/checkout?tourId=${tourId}&guideId=${guide.guideProfileId}&startDate=${startDate}&endDate=${endDate}&tourists=${numberOfTourists}`;
                                
                                return (
                                    <div
                                        key={guide._id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
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
                                Unfortunately, no guides are available for the selected dates. Please go back and try a different start date.
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
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading available guides...</div>}>
                <GuideSelectionContent />
            </Suspense>
        </div>
    );
}