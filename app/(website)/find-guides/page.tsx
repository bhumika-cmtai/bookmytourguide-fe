"use client";

import { useState, useEffect, useCallback, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { getAllGuides } from '@/lib/redux/thunks/guide/guideThunk';
import { fetchAdminLocations } from '@/lib/redux/thunks/admin/locationThunks';
import { fetchLanguages } from '@/lib/redux/thunks/admin/languageThunks';
import { clearGuides } from '@/lib/redux/guideSlice';

import { GuideCard } from '@/components/GuideCard';
import HeroSection from '@/components/all/CommonHeroSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Compass, Languages, XCircle, Frown } from 'lucide-react';
import { GuideProfile, AdminLocation, LanguageOption } from '@/lib/data';

// --- Main Page Component ---
export default function FindGuidesPage() {
  const dispatch: AppDispatch = useDispatch();

  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { guides, loading: guidesLoading, error } = useSelector((state: RootState) => state.guide);
  const { locations, loading: locationsLoading } = useSelector((state: RootState) => state.admin);
  const { languages, loading: languagesLoading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminLocations());
    dispatch(fetchLanguages());
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    if (!location || !language) return;
    
    setSearchPerformed(true);
    dispatch(clearGuides());
    dispatch(getAllGuides({
      location: location,
      language: language,
      page: 1,
      limit: 20,
    }));
  }, [dispatch, location, language]);

  const handleReset = useCallback(() => {
    setLocation('');
    setLanguage('');
    setSearchPerformed(false);
    dispatch(clearGuides());
  }, [dispatch]);

  // --- Render Logic ---
  const renderResults = () => {
    if (!searchPerformed) {
      return null;
    }

    if (guidesLoading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <div className="text-center py-16 max-w-lg mx-auto bg-card border rounded-lg p-8">
          <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h2 className="text-3xl font-bold mb-2">Error Loading Guides</h2>
          <p className="text-muted-foreground text-lg mb-6">{error}</p>
          <Button onClick={handleReset} size="lg">Try Again</Button>
        </div>
      );
    }
    
    if (Array.isArray(guides) && guides.length > 0) {
      return <GuideGrid guides={guides} location={location} language={language} />;
    }

    return <NoResultsFound onReset={handleReset} />;
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        badgeText="Explore with Experts"
        title="Find Your Perfect Local Guide"
        description="Select a location and language to connect with our certified, professional tour guides."
        backgroundImage="/3.jpg"
      />

      <section id="search-section" className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Discover Your Guide</CardTitle>
              <CardDescription className="text-lg">
                Start by selecting your desired destination and language.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-muted-foreground">
                  <Compass className="h-4 w-4 mr-2"/> Destination
                </label>
                <Select onValueChange={setLocation} value={location} disabled={locationsLoading}>
                  <SelectTrigger className="w-full h-12 text-base"><SelectValue placeholder="Select a location" /></SelectTrigger>
                  <SelectContent>
                    {locations.map((loc: AdminLocation) => (
                      <SelectItem key={loc._id} value={loc.placeName}>{loc.placeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-muted-foreground">
                  <Languages className="h-4 w-4 mr-2"/> Language
                </label>
                <Select onValueChange={setLanguage} value={language} disabled={languagesLoading}>
                  <SelectTrigger className="w-full h-12 text-base"><SelectValue placeholder="Select a language" /></SelectTrigger>
                  <SelectContent>
                    {languages.map((lang: LanguageOption) => (
                      <SelectItem key={lang._id} value={lang.languageName}>{lang.languageName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSearch} disabled={!location || !language || guidesLoading} className="w-full h-12 text-lg font-bold">
                    <Search className="h-5 w-5 mr-2"/> Find Guides
                </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">{renderResults()}</div>
      </section>
    </main>
  );
}

// --- Sub-Component for Displaying Guide Grid ---
interface GuideGridProps {
  guides: GuideProfile[];
  location: string;
  language: string;
}
const GuideGrid: FC<GuideGridProps> = ({ guides, location, language }) => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-12">Meet Your Expert Guides</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {guides.map((guide, index) => {
        const bookHref = `/find-guides/${guide._id}/book?location=${encodeURIComponent(location)}&language=${encodeURIComponent(language)}`;
        return (
          <div key={guide._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}>
            <GuideCard guide={guide} checkoutHref={bookHref} buttonText="View & Book" />
          </div>
        );
      })}
    </div>
  </div>
);

// --- Sub-Component for Loading State ---
const LoadingSkeleton: FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <Skeleton className="h-52 w-full" />
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-4" /><Skeleton className="h-4 w-5/6 mt-2" /><Skeleton className="h-12 w-full mt-6" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// --- Sub-Component for No Results State ---
interface NoResultsFoundProps { onReset: () => void; }
const NoResultsFound: FC<NoResultsFoundProps> = ({ onReset }) => (
    <div className="text-center py-16 max-w-lg mx-auto bg-card border rounded-lg p-8">
        <Frown className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-3xl font-bold mb-2">No Guides Found</h2>
        <p className="text-muted-foreground text-lg mb-6">Unfortunately, no guides match your selected criteria. Please try a different combination.</p>
        <Button onClick={onReset} size="lg"><XCircle className="h-5 w-5 mr-2"/> Start a New Search</Button>
    </div>
);