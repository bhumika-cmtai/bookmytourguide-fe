"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  HelpCircle,
  Users,
  Shield,
} from "lucide-react";
import HeroSection from "@/components/all/CommonHeroSection";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Phone Support",
      details: ["+91 9876543210", "+91 9876543211"],
      description: "Available 24/7 for emergencies",
    },
    {
      icon: <Mail className="w-6 h-6 text-secondary" />,
      title: "Email Support",
      details: ["support@bookmytourguide.in", "guides@bookmytourguide.in"],
      description: "Response within 2-4 hours",
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Head Office",
      details: ["123 Tourism Hub", "Connaught Place, New Delhi - 110001"],
      description: "Visit us Mon-Fri, 9 AM - 6 PM",
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: "Business Hours",
      details: ["Mon-Sun: 6 AM - 11 PM", "Emergency: 24/7"],
      description: "India Standard Time (IST)",
    },
  ];

  const faqCategories = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "For Travelers",
      questions: [
        "How do I book a tour?",
        "What's included in the tour price?",
        "Can I cancel or reschedule?",
        "How are guides verified?",
      ],
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: "For Guides",
      questions: [
        "How do I become a guide?",
        "What are the requirements?",
        "How do I get paid?",
        "How do I update my profile?",
      ],
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-accent" />,
      title: "General Support",
      questions: [
        "Technical issues with website",
        "Payment problems",
        "Account management",
        "Safety concerns",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection
          badgeText="Contact Us"
          title="We’re Here to Help You Explore"
          description="Have questions or feedback? Reach out and let’s make your travel experience seamless."
          backgroundImage="/5.jpg"
        />

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">{info.icon}</div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="font-medium">
                          {detail}
                        </p>
                      ))}
                      <CardDescription className="text-center">
                        {info.description}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-16 bg-card">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within
                      24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-muted-foreground">
                          Thank you for contacting us. We'll respond within 24
                          hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              placeholder="+91 9876543210"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              handleInputChange("category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="booking">
                                Tour Booking
                              </SelectItem>
                              <SelectItem value="guide">
                                Become a Guide
                              </SelectItem>
                              <SelectItem value="support">
                                Technical Support
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnership
                              </SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            placeholder="Brief subject of your inquiry"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            placeholder="Please provide details about your inquiry..."
                            rows={5}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {faqCategories.map((category, index) => (
                    <Card
                      key={index}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {category.icon}
                          <CardTitle className="text-lg">
                            {category.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.questions.map((question, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 bg-transparent"
                        >
                          View All FAQs
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Emergency Contact */}
                <Card className="mt-6 border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Emergency Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600 mb-2">
                      For urgent matters during your tour:
                    </p>
                    <p className="font-bold text-red-700 text-lg">
                      +91 9876543210
                    </p>
                    <p className="text-sm text-red-600">
                      Available 24/7 for safety emergencies
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Visit Our Office
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    BookMyTourGuide Head Office
                  </h3>
                  <p className="text-muted-foreground">
                    123 Tourism Hub, Connaught Place
                    <br />
                    New Delhi - 110001, India
                  </p>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
