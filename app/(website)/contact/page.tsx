"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "@/lib/store"; // Adjust the path to your store file if needed
import { createLead, resetLeadState } from "@/lib/redux/contactSlice"; // Adjust the path to your slice file if needed

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import HeroSection from "@/components/all/CommonHeroSection";

// Icons
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
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });

  const dispatch: AppDispatch = useDispatch();
  const { loading, error, success } = useSelector((state: RootState) => state.contacts);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      });

      timer = setTimeout(() => {
        dispatch(resetLeadState());
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser form submission

    // The formData state already has the correct structure.
    // Dispatch it directly to the createLead action.
    dispatch(createLead(formData));
  };

  const contactInfo = [
    { icon: <Phone className="w-6 h-6 text-primary" />, title: "Phone Support", details: ["+91 9876543210", "+91 9876543211"], description: "Available 24/7 for emergencies" },
    { icon: <Mail className="w-6 h-6 text-secondary" />, title: "Email Support", details: ["support@bookmytourguide.in", "guides@bookmytourguide.in"], description: "Response within 2-4 hours" },
    { icon: <MapPin className="w-6 h-6 text-accent" />, title: "Head Office", details: ["123 Tourism Hub", "Connaught Place, New Delhi - 110001"], description: "Visit us Mon-Fri, 9 AM - 6 PM" },
    { icon: <Clock className="w-6 h-6 text-green-600" />, title: "Business Hours", details: ["Mon-Sun: 6 AM - 11 PM", "Emergency: 24/7"], description: "India Standard Time (IST)" },
  ];

  const faqCategories = [
    { icon: <Users className="w-6 h-6 text-primary" />, title: "For Travelers", questions: ["How do I book a tour?", "What's included in the tour price?", "Can I cancel or reschedule?", "How are guides verified?"] },
    { icon: <Shield className="w-6 h-6 text-secondary" />, title: "For Guides", questions: ["How do I become a guide?", "What are the requirements?", "How do I get paid?", "How do I update my profile?"] },
    { icon: <HelpCircle className="w-6 h-6 text-accent" />, title: "General Support", questions: ["Technical issues with website", "Payment problems", "Account management", "Safety concerns"] },
  ];

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
                <Card key={index} className="text-center hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex justify-center mb-4">{info.icon}</div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (<p key={idx} className="font-medium">{detail}</p>))}
                      <CardDescription className="text-center">{info.description}</CardDescription>
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
                    <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {success ? (
                      <div className="text-center py-8 transition-opacity duration-500">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">Thank you for contacting us. We'll respond shortly.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Your full name" required />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+91 9876543210" required />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" required />
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                            <SelectTrigger><SelectValue placeholder="Select inquiry type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="booking">Tour Booking</SelectItem>
                              <SelectItem value="guide">Become a Guide</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input id="subject" value={formData.subject} onChange={(e) => handleInputChange("subject", e.target.value)} placeholder="Brief subject of your inquiry" required />
                        </div>

                        <div>
                          <Label htmlFor="message">Message *</Label>
                          <Textarea id="message" value={formData.message} onChange={(e) => handleInputChange("message", e.target.value)} placeholder="Please provide details about your inquiry..." rows={5} required />
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                          {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                          ) : (
                            <><Send className="w-4 h-4 mr-2" /> Send Message</>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqCategories.map((category, index) => (
                    <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardHeader>
                        <div className="flex items-center gap-3">{category.icon}<CardTitle className="text-lg">{category.title}</CardTitle></div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.questions.map((question, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" /><span>{question}</span>
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" size="sm" className="mt-4 bg-transparent">View All FAQs</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Visit Our Office</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">BookMyTourGuide Head Office</h3>
                  <p className="text-muted-foreground">123 Tourism Hub, Connaught Place<br />New Delhi - 110001, India</p>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">Get Directions</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}