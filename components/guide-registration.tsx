"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Shield, Globe, Award, Users } from "lucide-react"

export function GuideRegistration() {
  const benefits = [
    {
      icon: Star,
      title: "Earn Premium Income",
      description: "Top guides earn $200-500 per day with our platform",
    },
    {
      icon: Shield,
      title: "Verified & Trusted",
      description: "Complete verification process builds client trust",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with travelers from around the world",
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Access training and certification programs",
    },
  ]

  const requirements = [
    "Valid government ID and local residence proof",
    "Minimum 2 years of guiding experience",
    "Fluency in English + local language",
    "First aid certification (we can help arrange)",
    "Clean background check",
    "Professional references from previous clients",
  ]

  return (
    <section id="guides" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-in-left">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Join Our Network</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Become a Certified Guide</h2>
            <p className="text-xl text-secondary mb-8 text-balance">
              Join our exclusive network of professional guides and share your passion for your local culture while
              earning a sustainable income.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">{benefit.title}</h4>
                      <p className="text-sm text-secondary">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Start Application
            </Button>
          </div>

          {/* Right Content - Requirements Card */}
          <div className="animate-slide-in-right">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-secondary text-secondary-foreground rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <Users className="w-6 h-6 mr-2" />
                  Guide Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{requirement}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-card rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Application Process</h4>
                  <div className="text-sm text-secondary space-y-1">
                    <p>1. Submit online application (5 minutes)</p>
                    <p>2. Document verification (2-3 days)</p>
                    <p>3. Video interview with our team</p>
                    <p>4. Background check completion</p>
                    <p>5. Welcome to WanderGuide family!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
