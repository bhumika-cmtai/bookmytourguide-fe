"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Globe } from "lucide-react"

export function Footer() {
  const tourTypes = [
    "Eco Tours",
    "Heritage Tours",
    "Cooking Classes",
    "Spice Market Tours",
    "Adventure Tours",
    "Photography Tours",
    "Cultural Walks",
    "Food Tours",
  ]

  const destinations = [
    "India Tours",
    "Thailand Tours",
    "Vietnam Tours",
    "Nepal Tours",
    "Sri Lanka Tours",
    "Indonesia Tours",
    "Malaysia Tours",
    "Cambodia Tours",
  ]

  const support = [
    "Help Center",
    "Safety Guidelines",
    "Booking Policy",
    "Cancellation Policy",
    "Payment Security",
    "Travel Insurance",
    "Guide Verification",
    "Customer Support",
  ]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">WanderGuide</h3>
                <p className="text-sm opacity-80">Professional Tourism</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-6 text-balance leading-relaxed">
              Connecting travelers with certified local guides for authentic, safe, and memorable experiences worldwide.
              Your adventure starts here.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 opacity-80" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 opacity-80" />
                <span>hello@wanderguide.com</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 opacity-80" />
                <span>Available in 15+ languages</span>
              </div>
            </div>
          </div>

          {/* Tour Types */}
          <div className="animate-fade-in-up animate-delay-200">
            <h4 className="text-lg font-semibold mb-6">Tour Types</h4>
            <ul className="space-y-2 text-sm">
              {tourTypes.map((tour) => (
                <li key={tour}>
                  <a href="#" className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                    {tour}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="animate-fade-in-up animate-delay-400">
            <h4 className="text-lg font-semibold mb-6">Popular Destinations</h4>
            <ul className="space-y-2 text-sm">
              {destinations.map((destination) => (
                <li key={destination}>
                  <a href="#" className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="animate-fade-in-up animate-delay-600">
            <h4 className="text-lg font-semibold mb-6">Support & Policies</h4>
            <ul className="space-y-2 text-sm">
              {support.map((item) => (
                <li key={item}>
                  <a href="#" className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
              <p className="text-sm opacity-80">Get the latest tours and exclusive offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm opacity-80 text-center md:text-right">
            <p>&copy; 2024 WanderGuide. All rights reserved.</p>
            <p className="mt-1">Privacy Policy | Terms of Service | Cookie Policy</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
