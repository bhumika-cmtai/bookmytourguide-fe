"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
  CreditCard,
  MapPin,
  Star,
  Shield,
  CheckCircle,
  Phone,
  Users,
  Award,
} from "lucide-react";
import Image from "next/image";
import HeroSection from "@/components/all/CommonHeroSection";

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      icon: <Search className="w-8 h-8" />,
      title: "Search & Browse",
      description:
        "Browse our curated selection of tours and guides based on your interests, location, and dates.",
      details: [
        "Filter by tour type, location, and price",
        "Read guide profiles and reviews",
        "View detailed itineraries",
        "Check availability in real-time",
      ],
    },
    {
      step: 2,
      icon: <UserCheck className="w-8 h-8" />,
      title: "Choose Your Guide",
      description:
        "Select from our verified local guides who match your preferences and tour requirements.",
      details: [
        "All guides are background verified",
        "View ratings and authentic reviews",
        "Check language preferences",
        "See specialization areas",
      ],
    },
    {
      step: 3,
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Booking",
      description:
        "Book your tour with a small advance payment. Pay the remaining amount after tour completion.",
      details: [
        "Pay only 20-30% advance",
        "Secure payment gateway",
        "Instant booking confirmation",
        "Free cancellation up to 24 hours",
      ],
    },
    {
      step: 4,
      icon: <MapPin className="w-8 h-8" />,
      title: "Enjoy Your Tour",
      description:
        "Meet your guide at the designated location and embark on your authentic Indian adventure.",
      details: [
        "GPS tracking for safety",
        "24/7 emergency support",
        "Flexible tour customization",
        "Professional guide service",
      ],
    },
  ];

  const safetyFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Verified Guides",
      description:
        "Background checks, ID verification, and professional training",
    },
    {
      icon: <Phone className="w-6 h-6 text-secondary" />,
      title: "24/7 Support",
      description: "Emergency helpline available throughout your tour",
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "GPS Tracking",
      description: "Real-time location sharing for added security",
    },
    {
      icon: <Star className="w-6 h-6 text-green-600" />,
      title: "Quality Assurance",
      description: "Regular monitoring and feedback system",
    },
  ];

  const paymentProcess = [
    {
      step: "1",
      title: "Advance Payment",
      description: "Pay 20-30% to confirm booking",
      amount: "₹500-1000",
      timing: "At booking",
    },
    {
      step: "2",
      title: "Tour Completion",
      description: "Enjoy your tour experience",
      amount: "Experience",
      timing: "During tour",
    },
    {
      step: "3",
      title: "Final Payment",
      description: "Pay remaining amount to guide",
      amount: "₹1500-3000",
      timing: "After tour",
    },
    {
      step: "4",
      title: "Review & Rate",
      description: "Share your experience",
      amount: "Feedback",
      timing: "Post tour",
    },
  ];

  const guideProcess = [
    {
      step: "1",
      title: "Application",
      description: "Submit your profile and documents for verification",
    },
    {
      step: "2",
      title: "Verification",
      description: "Background check, interview, and document validation",
    },
    {
      step: "3",
      title: "Training",
      description: "Complete our guide certification program",
    },
    {
      step: "4",
      title: "Go Live",
      description: "Start receiving bookings and earning money",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection
          badgeText="How It Works"
          title="Simple Steps to Plan Your Perfect Trip"
          description="From choosing a guide to booking your next adventure — discover how easy it is to travel with BookMyTourGuide."
          backgroundImage="/3.jpg"
        />

        {/* Main Process Steps */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Book Your Perfect Tour in 4 Easy Steps
            </h2>
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className="flex-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                      <Image
                        src={`/${
                          step.step
                        }.jpg`}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div
                    className="flex-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2 + 0.1}s` }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        {step.step}
                      </div>
                      <div className="text-primary">{step.icon}</div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Process */}
        <section className="py-16 bg-card">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Transparent Payment Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {paymentProcess.map((payment, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {payment.step}
                    </div>
                    <CardTitle className="text-lg">{payment.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      {payment.description}
                    </p>
                    <Badge variant="outline" className="mb-2">
                      {payment.amount}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {payment.timing}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-lg text-muted-foreground">
                <Shield className="w-5 h-5 inline mr-2" />
                Secure payments • No hidden charges • Full refund on
                cancellation
              </p>
            </div>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Your Safety is Our Priority
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {safetyFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For Guides Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Want to Become a Guide?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {guideProcess.map((process, index) => (
                  <div
                    key={index}
                    className="text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {process.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {process.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {process.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90"
                >
                  Apply to Become a Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    For Travelers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">
                        Can I cancel my booking?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, free cancellation up to 24 hours before the tour.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Are guides verified?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        All guides undergo background checks and certification.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        What if I need help during the tour?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        24/7 emergency support is available via phone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up animate-delay-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-secondary" />
                    For Guides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">
                        How much can I earn?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        ₹500-2000 per hour based on experience and tour type.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        When do I get paid?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Payment is received directly from travelers after tour
                        completion.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Can I set my own schedule?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, you have full control over your availability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 heritage-gradient text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered authentic India
              through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-gray-100"
              >
                Book Your First Tour
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary bg-transparent"
              >
                Explore All Tours
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
