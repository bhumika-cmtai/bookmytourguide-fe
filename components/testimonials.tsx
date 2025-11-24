"use client";

import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchTestimonials } from "@/lib/redux/testimonialSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  User,
  Play,
  ArrowLeft,
  ArrowRight,
  Loader,
  VolumeX, // Mute icon
  Volume2, // Unmute icon
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion-variants";
import { useLanguage } from "@/contexts/LanguageContext";

export function Testimonials() {
  const { t } = useLanguage();
  const dispatch: AppDispatch = useDispatch();
  const { testimonials, loading, error, total } = useSelector(
    (state: RootState) => state.testimonials
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
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

  const averageRating =
    testimonials.length > 0
      ? (
        testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) /
        testimonials.length
      ).toFixed(1)
      : "0.0";

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("testimonials_title_community")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("testimonials_desc")}
            </p>
          </motion.div>
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
                <p>{t("no_testimonials")}</p>
              </div>
            )}

            {!loading && !error && testimonials.length > 0 && (
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                  {testimonials.map((testimonial) => (
                    <div
                      className="flex-[0_0_95%] md:flex-[0_0_50%] pl-4"
                      key={testimonial._id}
                    >
                      {testimonial.video ? (
                        <VideoSlide testimonial={testimonial} t={t} />
                      ) : (
                        <TextSlide testimonial={testimonial} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <motion.div
            variants={fadeInUp}
            className="mt-20 pt-16 border-t border-border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem number="10,000+" label={t("stat_happy_travelers")} />
              <StatItem number={`${total}`} label={t("stat_total_reviews")} />
              <StatItem number="200+" label={t("stat_expert_guides")} />
              <StatItem number={averageRating} label={t("stat_avg_rating")} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -5 }}
    className="text-center group cursor-default"
  >
    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="text-muted-foreground font-medium">{label}</div>
  </motion.div>
);

const VideoSlide = memo(function VideoSlide({
  testimonial,
  t,
}: {
  testimonial: any;
  t: (key: string) => string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // New state for volume
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((err) => {
        console.error("Video play failed:", err);
        setHasError(true);
      });
    } else {
      video.pause();
    }
  }, []);

  // New function to toggle mute/unmute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling play when clicking volume
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
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
    const onLoadedData = () => {
      setIsLoaded(true);
      video.play().catch((err) => {
        console.error("Autoplay failed:", err);
      });
    };
    // New listener for volume changes
    const onVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("volumechange", onVolumeChange);


    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("volumechange", onVolumeChange);

    };
  }, []);

  if (hasError) {
    return (
      <Card className="w-full aspect-video rounded-2xl overflow-hidden relative bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">{t("video_unavailable")}</p>
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
        autoPlay
        loop
        muted // Initial state is muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <Loader className="w-12 h-12 animate-spin text-white" />
        </div>
      )}

      {/* Play/Pause overlay */}
      <div
        className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        onClick={togglePlay}
      >
        {!isPlaying && <Play className="w-16 h-16 text-white drop-shadow-lg" />}
      </div>

      {/* New Volume Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10"
        onClick={toggleMute}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>

      {/* Bottom info panel */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white pointer-events-none">
        <h4 className="font-bold text-lg">{testimonial.name}</h4>
        {testimonial.position && (
          <p className="text-sm opacity-80">{testimonial.position}</p>
        )}
      </div>
    </Card>
  );
});

const TextSlide = memo(function TextSlide({
  testimonial,
}: {
  testimonial: any;
}) {
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
          {testimonial.position && (
            <p className="text-sm text-muted-foreground">
              {testimonial.position}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});