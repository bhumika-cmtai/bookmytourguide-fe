"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  slideInRight,
} from "@/lib/motion-variants";
import Image from "next/image";

export default function AboutPlatformSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Subtle background animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 3 }}
        className="absolute top-10 right-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch" // Changed to items-stretch for equal height
        >
          {/* Content Column */}
          <motion.div
            variants={slideInLeft}
            className="flex flex-col space-y-8"
          >
            {" "}
            {/* Added flex flex-col for proper alignment */}
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight"
            >
              About{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                IndiaTourManager.com
              </span>
            </motion.h2>
            <div className="space-y-6 flex-grow">
              {" "}
              {/* Added flex-grow to take available space */}
              <motion.p
                variants={fadeInUp}
                custom={1}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                IndiaTourManager.com is a unified digital platform that connects
                certified linguistic tour guides from across India with
                international travellers and inbound tour groups.
              </motion.p>
              <motion.p
                variants={fadeInUp}
                custom={2}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                Our mission is to empower India's tour guides, enhance the
                visitor experience, and promote authentic, responsible, and
                transparent tourism.
              </motion.p>
              <motion.p
                variants={fadeInUp}
                custom={3}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                We bring together a network of qualified guides who have passed
                government certification programs and hold state or pan-India
                licenses. Through our platform, Foreign travellers can directly
                choose and connect with guides who match their language,
                expertise, and itinerary needs.
              </motion.p>
            </div>
            {/* Interactive highlight cards - These will align to bottom */}
            <motion.div
              variants={fadeInUp}
              custom={4}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto" // Added mt-auto to push to bottom
            >
              <motion.div
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="p-4 rounded-xl bg-background/60 backdrop-blur-sm border shadow-sm"
              >
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">
                  Certified Guides
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="p-4 rounded-xl bg-background/60 backdrop-blur-sm border shadow-sm"
              >
                <div className="text-2xl font-bold text-primary mb-1">150+</div>
                <div className="text-sm text-muted-foreground">
                  Cities Covered
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image Column - Now matching the height of content column */}
          <motion.div
            variants={slideInRight}
            className="relative flex flex-col" // Added flex flex-col for proper height distribution
          >
            {/* Main image container - This will grow to fill available space */}
            <div className="relative group flex-grow flex flex-col">
              {" "}
              {/* Added flex-grow and flex flex-col */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-grow rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-blue-500/10 shadow-2xl relative" // Changed from aspect-[4/3] to flex-grow
              >
                <Image
                  src="/images/logo.jpg"
                  alt="Tour guide with international travelers exploring India"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>
              {/* Floating accent card - Now positioned relative to the flex container */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                className="absolute -bottom-6 -left-6 bg-background border rounded-xl p-4 shadow-xl backdrop-blur-sm max-w-[180px]"
              >
                <div className="text-center">
                  <div className="text-base font-bold text-foreground mb-1">
                    Government
                  </div>
                  <div className="text-sm text-primary font-semibold mb-1">
                    Certified
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Licensed & Verified
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
              className="absolute -top-4 -right-4 w-8 h-8 border-2 border-primary/30 rounded-full"
            />

            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute top-1/4 -right-6 w-4 h-4 bg-blue-500/20 rounded-full blur-sm"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
