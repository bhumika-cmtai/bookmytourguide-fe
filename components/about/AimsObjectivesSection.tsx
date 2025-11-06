"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  scaleIn,
} from "@/lib/motion-variants";
import {
  CheckCircle,
  Users,
  Globe,
  Heart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

const objectives = [
  {
    text: "To create a transparent and direct employment system for India's licensed tour guides",
    icon: Users,
    color: "text-blue-500",
  },
  {
    text: "To promote Indian tourism globally through professional and linguistic expertise",
    icon: Globe,
    color: "text-green-500",
  },
  {
    text: "To enhance visitor satisfaction through authentic and well-guided experiences",
    icon: Heart,
    color: "text-red-500",
  },
  {
    text: "To ensure that guides receive fair and timely payments, without intermediaries",
    icon: DollarSign,
    color: "text-yellow-500",
  },
  {
    text: "To contribute to India's tourism economy by empowering certified professionals",
    icon: TrendingUp,
    color: "text-purple-500",
  },
];

export default function AimsObjectivesSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 0.03, x: 0 }}
        transition={{ duration: 2 }}
        className="absolute right-0 top-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start lg:items-stretch">
          {" "}
          {/* Changed to items-stretch for equal height */}
          {/* Content Column */}
          <div className="lg:col-span-5 flex flex-col">
            {" "}
            {/* Added flex flex-col */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col h-full" // Added flex flex-col h-full for full height
            >
              <div className="flex-grow">
                {" "}
                {/* Wrapper for growing content */}
                <motion.div variants={fadeInUp} custom={0}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Our Goals
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
                    Aims &{" "}
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      Objectives
                    </span>
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-full mb-6" />

                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {" "}
                    {/* Added mb-8 for consistent spacing */}
                    Our strategic objectives guide every decision we make,
                    ensuring we create meaningful impact for guides, travelers,
                    and the tourism industry.
                  </p>
                </motion.div>
              </div>

              {/* Image placeholder for visual appeal - moved outside sticky wrapper */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-blue-500/10 hidden lg:block mt-auto" // Added mt-auto to push to bottom
              >
                <Image
                  src="/2.jpg"
                  alt="Tour guides and objectives visualization"
                  className="w-full h-full object-cover"
                  fill
                />
              </motion.div>
            </motion.div>
          </div>
          {/* Objectives Column */}
          <div className="lg:col-span-7 flex flex-col">
            {" "}
            {/* Added flex flex-col */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-6 h-full flex flex-col" // Added h-full flex flex-col
            >
              <div className="flex-grow space-y-6">
                {" "}
                {/* Wrapper for objectives with flex-grow */}
                {objectives.map((objective, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    custom={index + 1}
                    whileHover={{
                      x: 10,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    className="group"
                  >
                    <div className="flex gap-4 items-start bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative">
                      <motion.div
                        variants={scaleIn}
                        className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      >
                        <objective.icon
                          className={`w-6 h-6 ${objective.color} group-hover:scale-110 transition-transform`}
                        />
                      </motion.div>

                      <div className="flex-1 pt-2">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm mt-1">
                            {index + 1}
                          </span>
                          <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                            {objective.text}
                          </p>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ delay: (index + 1) * 0.2, duration: 0.8 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
