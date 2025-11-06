"use client"

import { motion } from "framer-motion"
import { staggerContainer, fadeInUp, slideInLeft, slideInRight, scaleIn } from "@/lib/motion-variants"
import { Target, Eye, Sparkles } from "lucide-react"

export default function MissionVisionSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 3 }}
        className="absolute top-20 left-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Purpose</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Mission &{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Vision Statement
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto" />
          </motion.div>

          {/* Cards Grid - Using flexbox for equal height */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch"> {/* Added items-stretch for equal height */}
            {/* Mission Card */}
            <motion.div
              variants={slideInLeft}
              custom={1}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative group flex" // Added flex to enable flexbox
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-lg backdrop-blur-sm flex flex-col w-full"> {/* Added flex flex-col w-full */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg flex-grow"> {/* Added flex-grow to fill available space */}
                  To connect travellers from around the world with certified, multilingual Indian tour guides — ensuring
                  every journey through India is safe, insightful, and unforgettable.
                </p>
                
                {/* Decorative element */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-4 right-4 w-3 h-3 border border-primary/30 rounded-full"
                />
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={slideInRight}
              custom={2}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative group flex" // Added flex to enable flexbox
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-primary text-primary-foreground rounded-2xl p-8 border border-primary/20 shadow-lg flex flex-col w-full"> {/* Added flex flex-col w-full */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Vision</h3>
                </div>
                <p className="leading-relaxed text-lg opacity-95 flex-grow"> {/* Added flex-grow to fill available space */}
                  To become India's most trusted online platform for professional tour guide bookings, uplifting the
                  status of licensed guides while redefining the global travel experience through authenticity and
                  transparency.
                </p>

                {/* Floating dots */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 w-2 h-2 bg-white/30 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-10 right-8 w-1 h-1 bg-white/20 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
