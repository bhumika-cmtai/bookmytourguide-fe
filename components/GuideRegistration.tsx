"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, CreditCard, MapPin, CheckCircle, Star } from "lucide-react"

export function BookingProcess() {  
  const steps = [
    {
      icon: Search,
      title: "Choose Your Experience",
      description: "Browse our curated selection of tours and select your preferred guide",
      details: "Filter by location, language, price, and tour type",
    },
    {
      icon: Calendar,
      title: "Select Date & Time",
      description: "Pick your preferred date and check real-time availability",
      details: "Flexible scheduling with instant confirmation",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay safely with our encrypted payment system",
      details: "Only 20-30% advance payment required",
    },
    {
      icon: CheckCircle,
      title: "Confirmation & Meet",
      description: "Receive confirmation and meet your certified guide",
      details: "Get guide contact details and meeting point",
    },
  ]

  const features = [
    {
      icon: Star,
      title: "4.9/5 Average Rating",
      description: "Based on 10,000+ verified reviews",
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description: "All guides are locals with deep cultural knowledge",
    },
    {
      icon: CheckCircle,
      title: "100% Verified",
      description: "Every guide passes our strict verification process",
    },
  ]

  return (
    <section className="py-20 bg-card">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Simple Booking Process</h2>
          <p className="text-xl text-seconday max-w-3xl mx-auto text-balance">
            Book your perfect tour experience in just a few clicks. Our streamlined process ensures you get the best
            guide for your needs.
          </p>
        </div>

        {/* Booking Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={step.title}
                className="relative group hover:shadow-lg transition-all duration-300 border-0 bg-white animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-secondary text-sm mb-3 text-balance">{step.description}</p>
                  <p className="text-xs text-secondary font-medium">{step.details}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-secondary text-balance">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
