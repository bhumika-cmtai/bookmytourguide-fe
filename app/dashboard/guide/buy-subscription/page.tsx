// app/dashboard/guide/subscription/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ShieldCheck, BarChart, Zap, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility from ShadCN setup

// --- Subscription Plan Data ---
const plans = [
  {
    name: "Explorer",
    duration: "3 Months",
    price: 4500,
    pricePerMonth: 1500,
    features: [
      "Certified Guide Badge",
      "Listing on Certified Guides Page",
      "Receive Direct Booking Inquiries",
      "Standard Support",
    ],
    isMostPopular: false,
  },
  {
    name: "Pro",
    duration: "6 Months",
    price: 7200, // This is a 20% discount
    pricePerMonth: 1200,
    features: [
      "All features from Explorer",
      "Priority Listing in Search Results",
      "Access to Performance Analytics",
      "Featured in a Monthly Newsletter",
    ],
    isMostPopular: true,
  },
  {
    name: "Partner",
    duration: "1 Year",
    price: 10800, // This is a 40% discount
    pricePerMonth: 900,
    features: [
      "All features from Pro",
      "Dedicated Account Manager",
      "Premium 24/7 Support",
      "Early Access to New Features",
    ],
    isMostPopular: false,
  },
];

export default function GuideSubscriptionPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleChoosePlan = (planName: string) => {
    setIsLoading(planName);
    // Simulate API call for payment
    setTimeout(() => {
      console.log(`Redirecting to payment for ${planName} plan...`);
      // In a real app, you would redirect to a Stripe Checkout page here.
      setIsLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <main className="pt-10">
        {/* --- Header Section --- */}
        <section className="py-12 text-center">
          <div className="container max-w-4xl mx-auto px-4">
            <Badge variant="secondary" className="mb-4">For Professional Guides</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Become a Certified Guide</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Unlock exclusive features, gain more visibility, and attract more travelers by joining our certified guide program.
            </p>
          </div>
        </section>

        {/* --- Pricing Tiers Section --- */}
        <section className="pb-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={cn(
                    "flex flex-col h-full transition-all duration-300",
                    plan.isMostPopular ? "border-2 border-primary shadow-2xl scale-105" : "hover:shadow-xl hover:-translate-y-2"
                  )}
                >
                  <CardHeader className="text-center">
                    {plan.isMostPopular && (
                      <Badge className="w-fit mx-auto mb-2 red-gradient">Most Popular</Badge>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.duration} Plan</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="text-center">
                      <p className="text-5xl font-extrabold text-foreground">₹{plan.price.toLocaleString()}</p>
                      <p className="text-muted-foreground">₹{plan.pricePerMonth.toLocaleString()} / month</p>
                    </div>
                    <ul className="mt-8 space-y-4 text-muted-foreground">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      size="lg" 
                      className={cn(
                        "w-full text-lg",
                        plan.isMostPopular && "red-gradient"
                      )}
                      variant={plan.isMostPopular ? 'default' : 'outline'}
                      disabled={!!isLoading}
                      onClick={() => handleChoosePlan(plan.name)}
                    >
                      {isLoading === plan.name ? 'Processing...' : 'Choose Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* --- FAQ Section --- */}
        <section className="py-16 bg-background">
            <div className="container max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What does "Certified Guide" mean?</AccordionTrigger>
                        <AccordionContent>
                            A "Certified Guide" is a guide who has subscribed to our professional plan. This status unlocks a badge on your profile, gives you priority in search results, and signals to travelers that you are a committed and top-rated professional.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
                        <AccordionContent>
                            Yes, you can cancel your subscription at any time. Your certified status and benefits will remain active until the end of your current billing period.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What happens after I subscribe?</AccordionTrigger>
                        <AccordionContent>
                            Once your payment is successful, the Certified Guide badge will be automatically applied to your profile. You will immediately gain access to all the features included in your chosen plan, such as priority listing and analytics.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>What is "Priority Listing"?</AccordionTrigger>
                        <AccordionContent>
                            Priority Listing means your profile will appear higher in search results when travelers look for guides in your area of expertise and location, significantly increasing your visibility and booking potential.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
      </main>
    </div>
  );
}