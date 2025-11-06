"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, User, Calendar } from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  slideInRight,
} from "@/lib/motion-variants";

// Dummy data matching your MongoDB schema
const dummyTestimonials = [
  {
    _id: "1",
    name: "Sarah Johnson",
    message:
      "The heritage tour with Rajesh was absolutely incredible! His knowledge of local history and culture made every monument come alive. Highly recommend this authentic experience!",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Travel Blogger",
    isVisible: true,
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "Marco Rodriguez",
    message:
      "Amazing cooking class experience! Priya taught us authentic recipes that we still make at home. The spice market visit was a bonus!",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Food Enthusiast",
    isVisible: true,
    createdAt: "2024-02-20T14:45:00Z",
    updatedAt: "2024-02-20T14:45:00Z",
  },
  {
    _id: "3",
    name: "Emma Thompson",
    message:
      "The eco tour exceeded all expectations. Our guide was passionate about conservation and showed us hidden natural gems. Unforgettable experience!",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Environmental Activist",
    isVisible: true,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
  {
    _id: "4",
    name: "David Chen",
    message:
      "Professional service from start to finish. The booking was seamless, and our guide was punctual, knowledgeable, and friendly. Will book again!",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Photographer",
    isVisible: true,
    createdAt: "2024-04-05T16:20:00Z",
    updatedAt: "2024-04-05T16:20:00Z",
  },
  {
    _id: "5",
    name: "Lisa Anderson",
    message:
      "The spice market tour was a sensory adventure! Our guide helped us understand the cultural significance of each spice. Bought so many treasures!",
    rating: 4,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Chef",
    isVisible: true,
    createdAt: "2024-05-12T11:30:00Z",
    updatedAt: "2024-05-12T11:30:00Z",
  },
  {
    _id: "6",
    name: "James Wilson",
    message:
      "Outstanding adventure tour! Safety was the top priority, and our guide made sure everyone felt comfortable while pushing our limits. Thrilling!",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Adventure Seeker",
    isVisible: true,
    createdAt: "2024-03-28T13:45:00Z",
    updatedAt: "2024-03-28T13:45:00Z",
  },
  {
    _id: "7",
    name: "Priya Patel",
    message:
      "What an incredible cultural immersion! The guide's storytelling brought ancient history to life. Every temple visit was educational and spiritual.",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Cultural Researcher",
    isVisible: true,
    createdAt: "2024-02-14T08:20:00Z",
    updatedAt: "2024-02-14T08:20:00Z",
  },
  {
    _id: "8",
    name: "Michael Brown",
    message:
      "The street food tour was amazing! Tried dishes I never would have found on my own. The guide knew all the best local spots and ensured everything was safe to eat.",
    rating: 4,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Food Critic",
    isVisible: true,
    createdAt: "2024-01-25T19:10:00Z",
    updatedAt: "2024-01-25T19:10:00Z",
  },
  {
    _id: "9",
    name: "Anna Schmidt",
    message:
      "Perfect family tour! Our guide was patient with the kids and made sure everyone had fun. The activities were engaging for all ages. Highly recommend for families!",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Travel Family",
    isVisible: true,
    createdAt: "2024-04-18T12:00:00Z",
    updatedAt: "2024-04-18T12:00:00Z",
  },
  {
    _id: "10",
    name: "Robert Kim",
    message:
      "The sunset photography tour was breathtaking! Got some incredible shots and learned new techniques. The locations were stunning and off the beaten path.",
    rating: 5,
    image: "/indian-businessman-founder-ceo.jpg",
    position: "Professional Photographer",
    isVisible: true,
    createdAt: "2024-03-02T17:30:00Z",
    updatedAt: "2024-03-02T17:30:00Z",
  },
];

// Gradient color options for visual variety
const gradientOptions = [
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-green-500",
];

export function Testimonials() {
  // Filter only visible testimonials (matching your DB logic)
  const visibleTestimonials = dummyTestimonials.filter((t) => t.isVisible);

  // Add gradient colors to testimonials
  const testimonialsWithGradients = visibleTestimonials.map(
    (testimonial, index) => ({
      ...testimonial,
      gradient: gradientOptions[index % gradientOptions.length],
    })
  );

  // Duplicate testimonials for seamless marquee loop
  const duplicatedTestimonials = [
    ...testimonialsWithGradients,
    ...testimonialsWithGradients,
  ];

  // Calculate stats from dummy data
  const totalTestimonials = visibleTestimonials.length;
  const averageRating =
    visibleTestimonials.length > 0
      ? (
          visibleTestimonials.reduce((acc, t) => acc + (t.rating || 0), 0) /
          visibleTestimonials.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 3 }}
        className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 3, delay: 1 }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
      />

      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Quote className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Traveler Reviews
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Travelers Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Don't just take our word for it. Here's what our satisfied
              travelers have to say about their IndiaTourManager experiences.
            </p>
          </motion.div>

          {/* Marquee Container */}
          <motion.div
            variants={fadeInUp}
            custom={1}
            className="relative space-y-8"
          >
            {/* Top Row - Left to Right */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, (-100 * duplicatedTestimonials.length) / 2],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duplicatedTestimonials.length * 3,
                    ease: "linear",
                  },
                }}
                style={{
                  width: `${(320 + 24) * duplicatedTestimonials.length}px`,
                }}
              >
                {duplicatedTestimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={`top-${testimonial._id}-${index}`}
                    testimonial={testimonial}
                  />
                ))}
              </motion.div>
            </div>

            {/* Bottom Row - Right to Left */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <motion.div
                className="flex gap-6"
                animate={{
                  x: [(-100 * duplicatedTestimonials.length) / 2, 0],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duplicatedTestimonials.length * 3.5,
                    ease: "linear",
                  },
                }}
                style={{
                  width: `${(320 + 24) * duplicatedTestimonials.length}px`,
                }}
              >
                {duplicatedTestimonials
                  .slice()
                  .reverse()
                  .map((testimonial, index) => (
                    <TestimonialCard
                      key={`bottom-${testimonial._id}-${index}`}
                      testimonial={testimonial}
                    />
                  ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={fadeInUp}
            custom={2}
            className="mt-20 pt-16 border-t border-border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Happy Travelers" },
                { number: `${totalTestimonials}`, label: "Reviews" },
                { number: "200+", label: "Expert Guides" },
                { number: averageRating, label: "Average Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  custom={index + 3}
                  whileHover={{
                    y: -5,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  className="text-center group cursor-default"
                >
                  <motion.div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </motion.div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Testimonial Card Component with consistent sizing
function TestimonialCard({ testimonial }: { testimonial: any }) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Truncate message to ensure consistent length
  const truncateMessage = (message: string, maxLength: number = 120) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + "...";
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm w-80 h-80 flex-shrink-0 relative overflow-hidden">
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      <CardContent className="p-6 h-full flex flex-col">
        {/* Header - Fixed height */}
        <div className="flex items-start justify-between mb-4 h-12">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
          >
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Quote className="w-5 h-5 text-foreground" />
            </div>
          </div>
          {testimonial.rating && (
            <div className="flex items-center gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
          )}
        </div>

        {/* Content - Fixed height with overflow handling */}
        <div className="mb-4 h-24 overflow-hidden">
          <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
            "{truncateMessage(testimonial.message)}"
          </p>
        </div>

        {/* Position badge - Fixed height */}
        <div className="mb-2 h-4 flex items-center">
          {testimonial.position && (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${testimonial.gradient} bg-opacity-10 text-foreground`}
            >
              <Calendar className="w-3 h-3" />
              <span className="truncate max-w-[120px]">
                {testimonial.position}
              </span>
            </span>
          )}
        </div>

        {/* Spacer to push user info to bottom */}
        <div className="flex-grow"></div>

        {/* User info - Fixed at bottom */}
        <div className="flex items-center gap-3 h-16">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative flex-shrink-0"
          >
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-lg"
                onError={(e) => {
                  // Fallback to user icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove("hidden");
                  }
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                testimonial.gradient
              } p-0.5 flex items-center justify-center ${
                testimonial.image ? "hidden" : ""
              }`}
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <User className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${testimonial.gradient} border-2 border-background`}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors duration-300 mb-1">
              {testimonial.name}
            </h4>
            <div className="text-xs text-muted-foreground truncate">
              {formatDate(testimonial.createdAt)}
            </div>
          </div>
        </div>

        {/* Hover effect border */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      </CardContent>
    </Card>
  );
}
