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
import type { Tour } from "@/lib/data";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link href={`/tours/${tour._id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border-border/60">
        <div className="relative h-56 w-full">
          <Image
            src={tour.images[0]}
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
          {/* --- FIX #1: Price section adjusted --- */}
          <div>
            <p className="text-sm text-muted-foreground">From</p>
            <p className="text-2xl font-extrabold text-primary">
              ₹{tour.pricePerPerson.toLocaleString()}
            </p>
          </div>

           {/* --- FIX #2: Original price shown for comparison --- */}
          <div className="text-right">
             <p className="text-sm text-muted-foreground line-through">
                ₹{tour.basePricePerPerson.toLocaleString()}
             </p>
             <p className="text-sm font-bold text-destructive">
                Save {Math.round(((tour.basePricePerPerson - tour.pricePerPerson) / tour.basePricePerPerson) * 100)}%
             </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}