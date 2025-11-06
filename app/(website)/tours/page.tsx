// app/tours/page.tsx
"use client";

import { useState } from "react";
import { tours } from "@/lib/data";
import { TourCard } from "@/components/TourCard";
import HeroSection from "@/components/all/CommonHeroSection";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function ToursPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const locations = ["all", ...new Set(tours.flatMap((tour) => tour.locations))];

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || tour.locations.some(loc => loc.toLowerCase() === selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <main>
      <HeroSection
      badgeText="Explore Tours"
      title="Discover India's Hidden Gems"
      description="Browse curated experiences led by verified local guides and uncover the heart of every destination."
      backgroundImage="/3.jpg"
      />

        <section className="sticky top-0 z-20 py-6 bg-background/80 backdrop-blur-lg border-b">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full md:w-56 h-12 text-base">
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location} className="capitalize">
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4">
            {filteredTours.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredTours.map((tour, index) => (
                   <div
                     key={tour._id}
                     className="animate-fade-in-up"
                     style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                   >
                     <TourCard tour={tour} />
                   </div>
                 ))}
               </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold mb-2">No Tours Found</h2>
                    <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}