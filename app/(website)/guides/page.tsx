"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Clock, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import HeroSection from "@/components/all/CommonHeroSection";
import Link from "next/link"; // Import the Link component

export default function BecomeAGuidePage() {
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Earn ₹500-2000/hour",
      description: "Set your own rates and earn competitive income.",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Flexible Schedule",
      description: "Work when you want, and choose your own tours.",
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Professional Growth",
      description: "Build your reputation and expand your network.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Verified Platform",
      description: "Join our trusted community of certified guides.",
    },
  ];

  const requirements = [
    "Valid government-issued ID proof",
    "Minimum 2 years of guiding experience",
    "Fluency in English and at least one local language",
    "Deep knowledge of local history and culture",
    "A professional and friendly attitude",
    "A smartphone with internet access",
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <HeroSection
          badgeText="Join Our Network"
          title="Become a BookMyTourGuide Partner"
          description="Empower travelers with your local knowledge and earn while sharing your city’s unique stories."
          backgroundImage="/1.jpg"
        />

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Join BookMyTourGuide?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50 border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Our Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">
                    What We Look For
                  </h3>
                  <ul className="space-y-4">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6">
                    Our Verification Process
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <p className="text-muted-foreground">Submit an online application with your documents.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <p className="text-muted-foreground">Our team conducts a background check and a brief online interview.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <p className="text-muted-foreground">Complete our platform training and get certified.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                      <p className="text-muted-foreground">Activate your profile and start receiving tour bookings!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-28 text-center">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Guide Your Next Adventure?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Start your journey as a professional guide today. Click the button below to begin the registration process and join a passionate community.
                </p>
                <Link href="/register" passHref>
                    <Button size="lg" className="text-lg h-14 px-8">
                        Become a Verified Certified Tour Guide
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>

      </main>
    </div>
  );
}