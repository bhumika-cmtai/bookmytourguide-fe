"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  slideInRight,
  scaleIn,
} from "@/lib/motion-variants";
import { Video, Share, Download, Heart, Play, Film } from "lucide-react";
import Image from "next/image";

const features = [
  {
    text: "Relive your trip anytime, anywhere",
    icon: Play,
    color: "from-red-500 to-pink-500",
  },
  {
    text: "Share it easily with your loved ones",
    icon: Share,
    color: "from-blue-500 to-cyan-500",
  },
  {
    text: "Preserve your travel story forever",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
  },
];

export default function YouTubeMemorySection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 0.05, y: 0 }}
        transition={{ duration: 3 }}
        className="absolute top-10 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6"
            >
              <Film className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">
                Memory Feature
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
              Our YouTube{" "}
              <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                Memory Feature
              </span>{" "}
              🎥
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Visual Column */}
            <motion.div
              variants={slideInLeft}
              className="relative flex flex-col order-2 lg:order-1"
            >
              {/* Main video container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-grow rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/20 to-pink-500/10 shadow-2xl relative group"
              >
                <Image
                  src="/1.jpg"
                  alt="Travel video creation process"
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Play button overlay */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                    <Play className="w-8 h-8 text-red-500 ml-1 fill-current" />
                  </div>
                </motion.div>

                {/* Bottom info card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-background/90 backdrop-blur-sm rounded-xl p-4 border">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-foreground">
                        Complimentary Video Service
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -left-4 w-8 h-8 border-2 border-red-500/30 rounded-full"
              />
            </motion.div>

            {/* Content Column */}
            <motion.div
              variants={slideInRight}
              className="flex flex-col space-y-8 order-1 lg:order-2"
            >
              <div className="space-y-6 flex-grow">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To make your journey unforgettable, we offer a complimentary
                  video memory service.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  During your tour, your guide can capture short clips and
                  highlights of your travel experience, which will later be
                  edited and uploaded as a YouTube link — allowing you to:
                </p>

                {/* Enhanced features list */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      custom={3 + index}
                      whileHover={{
                        x: 10,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                      className="group"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/60 backdrop-blur-sm border hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                        <motion.div
                          variants={scaleIn}
                          className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-foreground group-hover:text-red-500 transition-colors" />
                          </div>
                        </motion.div>

                        <p className="text-muted-foreground leading-relaxed pt-2 group-hover:text-foreground transition-colors">
                          {feature.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/5 border border-red-500/20">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    This service is our way of adding a personal touch to your
                    incredible Indian journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
