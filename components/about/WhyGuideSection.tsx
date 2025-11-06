"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  slideInRight,
  scaleIn,
} from "@/lib/motion-variants";
import {
  CheckCircle,
  Globe,
  Shield,
  MessageSquare,
  CreditCard,
  Award,
} from "lucide-react";
import Image from "next/image";

const reasons = [
  {
    icon: CheckCircle,
    emoji: "✅",
    title: "Government Authorization",
    description:
      "Every guide registered on our platform is licensed by the Government of India and has successfully cleared the official examinations to become a certified linguistic tour guide.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Globe,
    emoji: "🌍",
    title: "Language Expertise",
    description:
      "Our guides speak multiple foreign languages fluently, ensuring smooth communication for visitors from all parts of the world.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Shield,
    emoji: "🛡️",
    title: "Safety & Trust",
    description:
      "Authorized guides ensure that tourists are protected from fraud, misinformation, or unsafe travel arrangements.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: MessageSquare,
    emoji: "💬",
    title: "Cultural Accuracy",
    description:
      "Licensed guides provide genuine historical and cultural insights, giving travellers the true story behind every monument and tradition.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: CreditCard,
    emoji: "💰",
    title: "Transparency",
    description:
      "Payments go directly from client to guide — no middlemen, no hidden costs.",
    color: "from-indigo-500 to-blue-600",
  },
];

export default function WhyGuideSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.05, x: 0 }}
        transition={{ duration: 3 }}
        className="absolute top-10 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Content Column */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col h-full"
            >
              <div className="flex-grow">
                <motion.div variants={fadeInUp} custom={0}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Certified Excellence
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
                    Why Hiring a{" "}
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      Registered Guide
                    </span>{" "}
                    Is Necessary
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-full mb-8" />

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Discover why choosing certified, government-approved guides
                    ensures the highest quality travel experience across India.
                  </p>
                </motion.div>
              </div>

              {/* Image placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-blue-500/10 hidden lg:block mt-auto"
              >
                <Image
                  src="/4.jpg"
                  alt="Certified tour guide credentials"
                  fill
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Cards Column */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 h-full content-start"
            >
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{
                    x: 10,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className="group relative"
                >
                  {/* Background gradient blur */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-all duration-500`}
                  />

                  <div className="relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                    <div className="flex gap-4 items-start">
                      {/* Icon */}
                      <motion.div
                        variants={scaleIn}
                        className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${reason.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                          <reason.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {reason.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          {reason.description}
                        </p>
                      </div>

                      {/* Floating emoji */}
                      <div className="text-2xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        {reason.emoji}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                      className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${reason.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
