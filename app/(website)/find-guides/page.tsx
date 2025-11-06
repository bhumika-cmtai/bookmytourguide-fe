// app/find-guides/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { guides, formLocations, formLanguages } from '@/lib/data';
import { GuideCard } from '@/components/GuideCard';
import HeroSection from '@/components/all/CommonHeroSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Search, X, XCircle } from 'lucide-react';

export default function FindGuidesPage() {
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');

  const filteredGuides = useMemo(() => {
    if (!location && !language) {
      return guides; // Show all guides initially
    }
    return guides.filter(guide => {
      const locationMatch = location ? guide.state.toLowerCase() === location.toLowerCase() : true;
      const languageMatch = language ? guide.languages.map(l => l.toLowerCase()).includes(language.toLowerCase()) : true;
      return locationMatch && languageMatch;
    });
  }, [location, language]);

  const resetFilters = () => {
    setLocation('');
    setLanguage('');
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        badgeText="Explore with Experts"
        title="Find Your Perfect Local Guide"
        description="Search for guides by their location and language expertise to create your ideal, personalized tour."
        backgroundImage="/3.jpg" // A relevant, high-quality background image
      />

      {/* --- Filter Section --- */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50 border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="bg-background p-6 rounded-xl shadow-lg border flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center text-lg font-semibold mr-4 whitespace-nowrap">
                <Search className="h-6 w-6 mr-2 text-primary" />
                <span>Filter Guides By:</span>
            </div>
            <div className="w-full md:w-1/3">
              <Select onValueChange={setLocation} value={location}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select a Location (State)" />
                </SelectTrigger>
                <SelectContent>
                  {formLocations.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Select onValueChange={setLanguage} value={language}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select a Language" />
                </SelectTrigger>
                <SelectContent>
                  {formLanguages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={resetFilters}
              variant="destructive"
              className="w-full md:w-auto h-11 px-6"
            >
              <X className="h-5 w-5 mr-2"/>
              Reset
            </Button>
          </div>
        </div>
      </section>

      {/* --- Guides List Section --- */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide, index) => {
                // Corrected path to match the new file structure
                const bookHref = `/find-guides/${guide.guideProfileId}/book`;
                return (
                  <div
                    key={guide._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                  >
                    <GuideCard guide={guide} checkoutHref={bookHref} buttonText="View & Book" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 max-w-lg mx-auto bg-background border rounded-lg p-8">
                <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                <h2 className="text-3xl font-bold mb-2">No Guides Found</h2>
                <p className="text-muted-foreground text-lg">
                    No guides match your current filter criteria. Please adjust your search or reset the filters.
                </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}