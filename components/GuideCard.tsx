// components/GuideCard.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Languages } from "lucide-react";
import type { Guide } from "@/lib/data";
import { Button } from "./ui/button";

// Add checkoutHref to the props
interface GuideCardProps {
    guide: Guide;
    checkoutHref: string;
}

export function GuideCard({ guide, checkoutHref }: GuideCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-border/60">
      <CardHeader className="flex-row gap-4 items-center p-4">
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={guide.photo}
            alt={guide.name}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{guide.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-foreground">{guide.averageRating}</span>
            <span className="text-sm text-muted-foreground">({guide.numReviews} reviews)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{guide.state}, {guide.country}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Languages className="w-4 h-4 text-primary" />
          <span>{guide.languages.join(", ")}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
            {guide.specializations.slice(0, 3).map(spec => (
                <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        {/* The button now uses the dynamic href */}
        <Button asChild className="w-full font-bold">
          <Link href={checkoutHref}>Select & Continue</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}