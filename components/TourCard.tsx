// components/TourCard.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
// --- CHANGE #1: Import the correct type for the tour data ---
import type { AdminPackage } from "@/types/admin";

// --- CHANGE #2: Update the prop type from Tour to AdminPackage ---
export function TourCard({ tour }: { tour: AdminPackage }) {
  // A check to prevent division by zero and only show savings if it's a real discount
  const showSavings = tour.basePrice && tour.basePrice > tour.price;

  return (
    <Link href={`/tours/${tour._id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border-border/60">
        <div className="relative h-56 w-full">
          <Image
            src={tour.images[0] || "/placeholder.svg"} // Added a fallback image
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <CardHeader>
          <h3 className="text-xl font-bold text-foreground line-clamp-2">
            {tour.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{tour.locations.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{tour.duration}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-auto pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">From</p>
            {/* --- CHANGE #3: Use 'price' instead of 'pricePerPerson' --- */}
            <p className="text-2xl font-extrabold text-primary">
              ₹{tour.price.toLocaleString()}
            </p>
          </div>

          {/* Conditionally render the savings block */}
          {showSavings && (
            <div className="text-right">
              {/* --- CHANGE #4: Use 'basePrice' instead of 'basePricePerPerson' --- */}
              <p className="text-sm text-muted-foreground line-through">
                ₹{tour.basePrice.toLocaleString()}
              </p>
              <p className="text-sm font-bold text-destructive">
                {/* --- CHANGE #5: Update calculation with correct property names --- */}
                Save{" "}
                {Math.round(
                  ((tour.basePrice - tour.price) / tour.basePrice) * 100
                )}
                %
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}