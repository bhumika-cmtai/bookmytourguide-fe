"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Globe,
  Menu,
  X,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Home,
  Info,
  MapPin,
  Users,
  HelpCircle,
  Mail,
  ShoppingCart,
  Settings,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Cart } from "@/components/cart/Cart";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  useLanguage,
  supportedLanguages,
  LanguageCode,
} from "@/contexts/LanguageContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, loading, logout, fetchCurrentUser } =
    useAuth();

  const navigationItems = [
    { href: "/", labelKey: "nav_home", icon: Home },
    { href: "/about", labelKey: "nav_about", icon: Info },
    { href: "/tours", labelKey: "nav_tours", icon: MapPin },
    { href: "/find-guides", labelKey: "nav_find_guides", icon: Users2 },
    { href: "/guides", labelKey: "nav_become_guide", icon: Users },
    { href: "/how-it-works", labelKey: "nav_how_it_works", icon: HelpCircle },
    { href: "/contact", labelKey: "nav_contact", icon: Mail },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, fetchCurrentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      const dashboardPath =
        user.role === "guide"
          ? "/dashboard/guide"
          : user.role === "admin" || user.role === "manager"
            ? "/dashboard/admin"
            : "/dashboard/user";
      router.push(dashboardPath);
      setIsProfileOpen(false);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-primary/10 p-0.5 transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                <Image
                  src="/images/logo.jpg"
                  alt="Book My Tour Guide"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">
                BookMyTourGuide
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                bookmytourguide.in
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0 mx-4">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center px-2.5 py-2.5 rounded-lg font-medium transition-all duration-300 group whitespace-nowrap ${
                    active
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-semibold">
                    {t(item.labelKey)}
                  </span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Cart />
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-w-[90px] cursor-pointer"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 group"
                disabled={loading}
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${isAuthenticated ? "bg-primary" : "bg-gray-100"}`}
                  >
                    <User
                      className={`w-4 h-4 ${isAuthenticated ? "text-primary-foreground" : "text-gray-600"}`}
                    />
                  </div>
                  {isAuthenticated && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-gray-700 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {!isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {t("profile_welcome")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("profile_signin_prompt")}
                        </p>
                      </div>
                      <button onClick={handleLogin} className="w-full ...">
                        <LogIn className="..." />
                        <span className="font-medium">
                          {t("profile_login")}
                        </span>
                      </button>
                      <button onClick={handleRegister} className="w-full ...">
                        <UserPlus className="..." />
                        <span className="font-medium">
                          {t("profile_register")}
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* User Info */}
                      <button
                        onClick={handleProfileClick}
                        className="w-full ..."
                      >
                        <Settings className="..." />
                        <span className="font-medium">
                          {t("profile_dashboard")}
                        </span>
                      </button>
                      <div className="mx-4 my-2 h-px bg-gray-200" />
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full ..."
                      >
                        <LogOut className="..." />
                        <span className="font-medium">
                          {loading
                            ? t("profile_logging_out")
                            : t("profile_logout")}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden ..."
          >
            {isMenuOpen ? <X className="..." /> : <Menu className="..." />}
          </button>
        </div>
        {isMenuOpen && <div className="lg:hidden ...">{/* Mobile Menu */}</div>}
      </div>
    </header>
  );
}