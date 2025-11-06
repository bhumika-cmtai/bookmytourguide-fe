"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Building,
  ChefHat,
  ShoppingBag,
  Clock,
  Star,
  Users,
  MapPin,
} from "lucide-react";
import { useCart } from "@/contexts/CardContext";
import Link from "next/link";

export function TourCategories() {
  const { dispatch } = useCart();
  const categories = [
    {
      icon: Leaf,
      title: "Eco Tours",
      description:
        "Sustainable nature experiences with environmental awareness and wildlife spotting",
      image: "/1.jpg",
      tours: 120,
      duration: "3-8 hours",
      price: "₹1,200",
      rating: 4.8,
      guides: 25,
      popular: true,
    },
    {
      icon: Building,
      title: "Heritage Tours",
      description:
        "Explore historical monuments, ancient architecture and cultural landmarks",
      image: "/2.jpg",
      tours: 85,
      duration: "2-6 hours",
      price: "₹900",
      rating: 4.9,
      guides: 40,
      popular: true,
    },
    {
      icon: ChefHat,
      title: "Cooking Classes",
      description:
        "Learn authentic local recipes and traditional cooking techniques from expert chefs",
      image: "/3.jpg",
      tours: 60,
      duration: "2-4 hours",
      price: "₹1,500",
      rating: 4.7,
      guides: 15,
      popular: false,
    },
    {
      icon: ShoppingBag,
      title: "Spice Market Tours",
      description:
        "Discover exotic spices, local market culture and traditional trading practices",
      image: "/4.jpg",
      tours: 45,
      duration: "2-3 hours",
      price: "₹600",
      rating: 4.6,
      guides: 20,
      popular: false,
    },
    {
      icon: Building,
      title: "One-Day Tours",
      description:
        "Complete city exploration covering multiple attractions in a single day",
      image: "/5.jpg",
      tours: 95,
      duration: "8-10 hours",
      price: "₹2,500",
      rating: 4.8,
      guides: 35,
      popular: true,
    },
    {
      icon: ShoppingBag,
      title: "Handcraft Tours",
      description:
        "Visit local artisans, learn traditional crafts and support local communities",
      image: "/1.jpg",
      tours: 30,
      duration: "3-5 hours",
      price: "₹800",
      rating: 4.5,
      guides: 12,
      popular: false,
    },
  ];

  return (
    <section
      id="tours"
      className="py-20 bg-gradient-to-b from-background to-card/50"
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Explore Our Tour Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Choose from our carefully curated selection of authentic
            experiences, each led by certified local experts who know their
            craft inside out.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Available in 10+ Languages
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.title}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in border-0 bg-white overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {category.popular && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white">Popular</Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {category.tours} Tours
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {category.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {category.guides} Guides
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary">
                        {category.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">
                          {category.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-balance text-sm leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {category.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per person
                    </div>
                  </div>
                  <button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-semibold mb-2 transition-all"
                    onClick={() => {
                      // Convert price string to number
                      const numericPrice = Number(
                        String(category.price).replace(/[^\d]/g, "")
                      );
                      dispatch({
                        type: "ADD_ITEM",
                        payload: {
                          id: category.title,
                          name: category.title + " Sample Package",
                          price: numericPrice,
                          image: category.image,
                        },
                      });
                    }}
                  >
                    Add to Cart
                  </button>
                  <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground">
                    View Tours
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-secondary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Looking for Something Specific?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find the perfect tour? Our guides can create custom
              experiences tailored to your interests.
            </p>
            <Link href="/dashboard/user/custom-tour">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                >
                Request Custom Tour
                </Button>
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
