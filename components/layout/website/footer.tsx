"use client";

import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();

  const tourTypeKeys = [
    "eco_tours",
    "heritage_tours",
    "cooking_classes",
    "spice_market_tours",
    "adventure_tours",
    "photography_tours",
    "cultural_walks",
    "food_tours",
  ];
  const destinationKeys = [
    "india_tours",
    "thailand_tours",
    "vietnam_tours",
    "nepal_tours",
    "sri_lanka_tours",
    "indonesia_tours",
    "malaysia_tours",
    "cambodia_tours",
  ];
  const supportKeys = [
    "help_center",
    "safety_guidelines",
    "booking_policy",
    "cancellation_policy",
    "payment_security",
    "travel_insurance",
    "guide_verification",
    "customer_support",
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">WanderGuide</h3>
                <p className="text-sm opacity-80">
                  {t("footer_company_subtitle")}
                </p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-6 text-balance leading-relaxed">
              {t("footer_company_description")}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 opacity-80" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 opacity-80" />
                <span>hello@wanderguide.com</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 opacity-80" />
                <span>{t("footer_available_languages")}</span>
              </div>
            </div>
          </div>

          {/* Tour Types */}
          <div className="animate-fade-in-up animate-delay-200">
            <h4 className="text-lg font-semibold mb-6">
              {t("footer_tour_types")}
            </h4>
            <ul className="space-y-2 text-sm">
              {tourTypeKeys.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="animate-fade-in-up animate-delay-400">
            <h4 className="text-lg font-semibold mb-6">
              {t("footer_destinations")}
            </h4>
            <ul className="space-y-2 text-sm">
              {destinationKeys.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="animate-fade-in-up animate-delay-600">
            <h4 className="text-lg font-semibold mb-6">
              {t("footer_support")}
            </h4>
            <ul className="space-y-2 text-sm">
              {supportKeys.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-2">
                {t("footer_stay_updated")}
              </h4>
              <p className="text-sm opacity-80">
                {t("footer_newsletter_prompt")}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={t("footer_email_placeholder")}
                className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {t("footer_subscribe")}
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm opacity-80 text-center md:text-right">
            <p>{t("footer_copyright")}</p>
            <p className="mt-1">{t("footer_legal_links")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
