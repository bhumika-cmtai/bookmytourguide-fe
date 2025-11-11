"use client";
import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
// Redux imports (adjust path if needed)
import { AppDispatch, RootState } from "@/lib/store";
import { fetchTestimonials } from "@/lib/redux/testimonialSlice";
// UI and Animation imports
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, User, Play, Pause, ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion-variants";
// --- Main Testimonials Component ---
export function Testimonials() {
  const dispatch: AppDispatch = useDispatch();
  const { testimonials, loading, error, total } = useSelector((state: RootState) => state.testimonials);
  // --- Embla Carousel Hook ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    skipSnaps: false,
    dragFree: false
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  // Navigation callback functions
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  // Update button states when a new slide is selected
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);
  // Effect to fetch data and initialize carousel
  useEffect(() => {
    // Fetch testimonials on component mount
    dispatch(fetchTestimonials({ limit: 10, visible: true }));
  }, [dispatch]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / testimonials.length).toFixed(1) 
    : "0.0";
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Hear From Our <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Community</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from travelers who explored India with our expert guides.
            </p>
          </motion.div>
          {/* --- SLIDER SECTION --- */}
          <motion.div variants={fadeInUp} className="relative">
            {loading && (
              <div className="flex justify-center items-center h-96">
                <Loader className="w-12 h-12 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <div className="text-center h-96 flex items-center justify-center text-red-500">
                <p>Error: {error}</p>
              </div>
            )}
            {!loading && !error && testimonials.length === 0 && (
              <div className="text-center h-96 flex items-center justify-center text-muted-foreground">
                <p>No testimonials available at the moment.</p>
              </div>
            )}
            
            {!loading && !error && testimonials.length > 0 && (
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                  {testimonials.map((testimonial) => (
                    <div className="flex-[0_0_95%] md:flex-[0_0_50%] pl-4" key={testimonial._id}>
                      {testimonial.video ? (
                        <VideoSlide testimonial={testimonial} />
                      ) : (
                        <TextSlide testimonial={testimonial} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Navigation Buttons */}
            {!loading && testimonials.length > 2 && (
              <>
                <Button 
                  onClick={scrollPrev} 
                  disabled={!prevBtnEnabled} 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg z-10"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <Button 
                  onClick={scrollNext} 
                  disabled={!nextBtnEnabled} 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg z-10"
                >
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </motion.div>
          {/* Statistics Section */}
          <motion.div variants={fadeInUp} className="mt-20 pt-16 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Happy Travelers" },
                { number: `${total}`, label: "Total Reviews" },
                { number: "200+", label: "Expert Guides" },
                { number: averageRating, label: "Average Rating" },
              ].map((stat) => (
                <motion.div 
                  key={stat.label} 
                  variants={fadeInUp} 
                  whileHover={{ y: -5 }} 
                  className="text-center group cursor-default"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
// --- FIXED: Video Slide Component (Memoized to prevent re-renders) ---
const VideoSlide = memo(function VideoSlide({ testimonial }: { testimonial: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => {
        console.error("Video play failed:", err);
        setHasError(true);
      });
    } else {
      video.pause();
    }
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = (e: Event) => {
      console.error("Video error:", e);
      setHasError(true);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
    };
  }, []);
  if (hasError) {
    return (
      <Card className="w-full aspect-video rounded-2xl overflow-hidden relative bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">Video unavailable</p>
          <p className="text-sm text-muted-foreground">{testimonial.name}</p>
        </div>
      </Card>
    );
  }
  return (
    <Card className="w-full aspect-video rounded-2xl overflow-hidden relative group">
      <video
        ref={videoRef}
        src={testimonial.video}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onClick={togglePlay}
      /> 
      {/* Play/Pause Button Overlay */}
      <div 
        className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
        onClick={togglePlay}
      >
        {!isPlaying && <Play className="w-16 h-16 text-white drop-shadow-lg" />}
      </div>
      
      {/* User Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white pointer-events-none">
        <h4 className="font-bold text-lg">{testimonial.name}</h4>
        {testimonial.position && <p className="text-sm opacity-80">{testimonial.position}</p>}
      </div>
    </Card>
  );
});


// --- Text Slide Component (for testimonials without video) ---
const TextSlide = memo(function TextSlide({ testimonial }: { testimonial: any }) {
  return (
    <Card className="w-full h-full aspect-video rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm p-8 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <Quote className="w-10 h-10 text-primary/50" />
          <div className="flex items-center gap-1">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
        <p className="mt-4 text-lg text-foreground leading-relaxed line-clamp-6">
          "{testimonial.message}"
        </p>
      </div>
      <div className="flex items-center gap-4 mt-6">
        {testimonial.image ? (
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/50" 
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <div>
          <h4 className="font-bold text-foreground">{testimonial.name}</h4>
          {testimonial.position && <p className="text-sm text-muted-foreground">{testimonial.position}</p>}
        </div>
      </div>
    </Card>
  );
});