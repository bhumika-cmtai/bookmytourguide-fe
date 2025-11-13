"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

export const supportedLanguages = ["en", "es", "fr", "ru", "de"] as const;

export type LanguageCode = (typeof supportedLanguages)[number];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (
        savedLanguage &&
        (supportedLanguages as readonly string[]).includes(savedLanguage)
      ) {
        setLanguageState(savedLanguage as LanguageCode);
      }
    }
  }, []);

  const setLanguage = useCallback((newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  }, []);

  const t = useCallback(
    (
      key: string,
      replacements?: { [key: string]: string | number }
    ): string => {
      const translations: Record<LanguageCode, Record<string, string>> = {
        en: {
          nav_home: "Home",
          nav_about: "About",
          nav_tours: "Tours",
          nav_find_guides: "Book a Certified Guide",
          nav_become_guide: "Become a Guide",
          nav_how_it_works: "How it Works",
          nav_contact: "Contact",
          profile_welcome: "Welcome!",
          profile_signin_prompt: "Sign in to access your account",
          profile_login: "Login",
          profile_register: "Register",
          profile_dashboard: "Dashboard",
          profile_logout: "Logout",
          profile_logging_out: "Logging out...",
          mobile_language_label: "Language",
          hero_title_taj: "Discover the Taj Mahal",
          hero_subtitle_taj:
            "Experience the epitome of Mughal architecture with expert guides",
          hero_category_taj: "Heritage Tours",
          hero_title_rajasthan: "Explore Rajasthan's Golden City",
          hero_subtitle_rajasthan:
            "Wander through the majestic forts and palaces of Jaisalmer",
          hero_category_rajasthan: "Desert Adventures",
          hero_title_kerala: "Kerala's Backwater Paradise",
          hero_subtitle_kerala:
            "Cruise through serene waters and lush green landscapes",
          hero_category_kerala: "Nature & Wildlife",
          hero_title_varanasi: "Varanasi's Spiritual Journey",
          hero_subtitle_varanasi:
            "Witness ancient rituals along the sacred Ganges River",
          hero_category_varanasi: "Spiritual Tours",
          hero_title_himalayas: "Himalayan Mountain Treks",
          hero_subtitle_himalayas:
            "Adventure through breathtaking mountain landscapes",
          hero_category_himalayas: "Adventure Tours",
          hero_title_goa: "Goa's Coastal Charm",
          hero_subtitle_goa:
            "Discover pristine beaches and vibrant Portuguese heritage",
          hero_category_goa: "Beach & Culture",
          tours_available: "Tours Available",
          expert_guides: "Expert Guides",
          average_rating: "Average Rating",
          book_your_tour_now: "Book Your Tour Now",
          become_a_guide: "Become a Guide",
          verified_guides: "Verified Guides",
          secure_payments: "Secure Payments",
          support_24_7: "24/7 Support",
          explore_tour_categories: "Explore Our Tour Categories",
          explore_tour_categories_desc:
            "Choose from our carefully curated selection of authentic experiences, each led by certified local experts who know their craft inside out.",
          available_in_languages: "Available in 10+ Languages",
          per_person: "per person",
          add_to_cart: "Add to Cart",
          view_tours: "View Tours",
          looking_for_something_specific: "Looking for Something Specific?",
          custom_tour_prompt:
            "Can't find the perfect tour? Our guides can create custom experiences tailored to your interests.",
          request_custom_tour: "Request Custom Tour",
          join_our_network: "Join Our Network",
          become_certified_guide: "Become a Certified Guide",
          guide_reg_desc:
            "Join our exclusive network of professional guides and share your passion for your local culture while earning a sustainable income.",
          benefit_title_1: "Earn Premium Income",
          benefit_desc_1: "Top guides earn $200-500 per day with our platform",
          benefit_title_2: "Verified & Trusted",
          benefit_desc_2: "Complete verification process builds client trust",
          benefit_title_3: "Global Reach",
          benefit_desc_3: "Connect with travelers from around the world",
          benefit_title_4: "Professional Growth",
          benefit_desc_4: "Access training and certification programs",
          start_application: "Start Application",
          guide_requirements_title: "Guide Requirements",
          req_1: "Valid government ID and local residence proof",
          req_2: "Minimum 2 years of guiding experience",
          req_3: "Fluency in English + local language",
          req_4: "First aid certification (we can help arrange)",
          req_5: "Clean background check",
          req_6: "Professional references from previous clients",
          app_process_title: "Application Process",
          app_step_1: "1. Submit online application (5 minutes)",
          app_step_2: "2. Document verification (2-3 days)",
          app_step_3: "3. Video interview with our team",
          app_step_4: "4. Background check completion",
          app_step_5: "5. Welcome to WanderGuide family!",
          booking_proc_title: "Simple Booking Process",
          booking_proc_desc:
            "Book your perfect tour experience in just a few clicks. Our streamlined process ensures you get the best guide for your needs.",
          step_1_title: "Choose Your Experience",
          step_1_desc:
            "Browse our curated selection of tours and select your preferred guide",
          step_1_details: "Filter by location, language, price, and tour type",
          step_2_title: "Select Date & Time",
          step_2_desc:
            "Pick your preferred date and check real-time availability",
          step_2_details: "Flexible scheduling with instant confirmation",
          step_3_title: "Secure Payment",
          step_3_desc: "Pay safely with our encrypted payment system",
          step_3_details: "Only 20-30% advance payment required",
          step_4_title: "Confirmation & Meet",
          step_4_desc: "Receive confirmation and meet your certified guide",
          step_4_details: "Get guide contact details and meeting point",
          feature_1_title: "4.9/5 Average Rating",
          feature_1_desc: "Based on 10,000+ verified reviews",
          feature_2_title: "Local Expertise",
          feature_2_desc: "All guides are locals with deep cultural knowledge",
          feature_3_title: "100% Verified",
          feature_3_desc: "Every guide passes our strict verification process",
          testimonials_title_community: "Hear From Our Community",
          testimonials_desc:
            "Real stories from travelers who explored India with our expert guides.",
          no_testimonials: "No testimonials available at the moment.",
          stat_happy_travelers: "Happy Travelers",
          stat_total_reviews: "Total Reviews",
          stat_expert_guides: "Expert Guides",
          stat_avg_rating: "Average Rating",
          video_unavailable: "Video unavailable",
          footer_company_subtitle: "Professional Tourism",
          footer_company_description:
            "Connecting travelers with certified local guides for authentic, safe, and memorable experiences worldwide. Your adventure starts here.",
          footer_available_languages: "Available in 15+ languages",
          footer_tour_types: "Tour Types",
          footer_destinations: "Popular Destinations",
          footer_support: "Support & Policies",
          footer_stay_updated: "Stay Updated",
          footer_newsletter_prompt: "Get the latest tours and exclusive offers",
          footer_email_placeholder: "Enter your email",
          footer_subscribe: "Subscribe",
          footer_copyright: "© 2024 WanderGuide. All rights reserved.",
          footer_legal_links:
            "Privacy Policy | Terms of Service | Cookie Policy",
          about_platform_title: "About",
          about_platform_p1:
            "IndiaTourManager.com is a unified digital platform that connects certified linguistic tour guides from across India with international travellers and inbound tour groups.",
          about_platform_p2:
            "Our mission is to empower India's tour guides, enhance the visitor experience, and promote authentic, responsible, and transparent tourism.",
          about_platform_p3:
            "We bring together a network of qualified guides who have passed government certification programs and hold state or pan-India licenses. Through our platform, Foreign travellers can directly choose and connect with guides who match their language, expertise, and itinerary needs.",
          about_stat_guides: "Certified Guides",
          about_stat_cities: "Cities Covered",
          about_card_gov: "Government",
          about_card_cert: "Certified",
          about_card_lic: "Licensed & Verified",
          aims_header: "Our Goals",
          aims_title: "Aims & Objectives",
          aims_p1:
            "Our strategic objectives guide every decision we make, ensuring we create meaningful impact for guides, travelers, and the tourism industry.",
          aims_obj_1:
            "To create a transparent and direct employment system for India's licensed tour guides",
          aims_obj_2:
            "To promote Indian tourism globally through professional and linguistic expertise",
          aims_obj_3:
            "To enhance visitor satisfaction through authentic and well-guided experiences",
          aims_obj_4:
            "To ensure that guides receive fair and timely payments, without intermediaries",
          aims_obj_5:
            "To contribute to India's tourism economy by empowering certified professionals",
          gt_header: "Special Focus",
          gt_title: "Our Special Focus — The Golden Triangle",
          gt_p1:
            "The Golden Triangle — Delhi, Agra, and Jaipur — represents the heart of India's tourism experience, covering some of the nation's most iconic World Heritage Sites such as the Taj Mahal, Qutub Minar, Amber Fort, and Red Fort in Agra.",
          gt_p2:
            "At IndiaTourManager.com, we specialize in offering the best professional guides for this region. Whether you're exploring Delhi's Mughal architecture, Agra's timeless love story, or Jaipur's royal heritage — our guides ensure you experience these wonders with comfort, clarity, and cultural depth.",
          gt_stat_cities: "Iconic Cities",
          gt_stat_exp: "Experiences",
          gt_overlay_title: "The Golden Triangle",
          gt_overlay_feat1: "Heritage Sites",
          gt_overlay_feat2: "Photo Spots",
          mission_vision_header: "Our Purpose",
          mission_vision_title: "Mission & Vision Statement",
          mission_title: "Mission",
          mission_p:
            "To connect travellers from around the world with certified, multilingual Indian tour guides — ensuring every journey through India is safe, insightful, and unforgettable.",
          vision_title: "Vision",
          vision_p:
            "To become India's most trusted online platform for professional tour guide bookings, uplifting the status of licensed guides while redefining the global travel experience through authenticity and transparency.",
          why_choose_header: "Why Choose Us",
          why_choose_title: "Why Choose or Sign Up on IndiaTourManager.com",
          reason_1_title: "Direct Access",
          reason_1_desc:
            "Connect directly with licensed guides — no agencies or brokers involved.",
          reason_2_title: "Fair Pricing",
          reason_2_desc:
            "Pay directly to the guide as per government-approved standards.",
          reason_3_title: "Linguistic Expertise",
          reason_3_desc:
            "Choose from guides who speak your language — English, French, German, Japanese, Spanish, Italian, Chinese, and more.",
          reason_4_title: "All-in-One Travel Support",
          reason_4_desc:
            "Customize your entire trip — guides, hotels, taxis, and tour assistants — on one platform.",
          reason_5_title: "Free YouTube Memory Video",
          reason_5_desc:
            "Get a complimentary travel video as part of your tour.",
          reason_6_title: "Verified Professionals",
          reason_6_desc:
            "Every guide is government-approved and background-verified for your peace of mind.",
          reason_7_title: "Authentic Experience",
          reason_7_desc:
            "Travel with confidence and enjoy India the way it's meant to be — real, cultural, and unforgettable.",
          reason_8_title: "Expert Knowledge",
          reason_8_desc:
            "Benefit from guides with deep expertise in their regions and cultural heritage.",
          why_guide_header: "Certified Excellence",
          why_guide_title: "Why Hiring a Registered Guide Is Necessary",
          why_guide_p:
            "Discover why choosing certified, government-approved guides ensures the highest quality travel experience across India.",
          why_guide_reason_1_title: "Government Authorization",
          why_guide_reason_1_desc:
            "Every guide registered on our platform is licensed by the Government of India and has successfully cleared the official examinations to become a certified linguistic tour guide.",
          why_guide_reason_2_title: "Language Expertise",
          why_guide_reason_2_desc:
            "Our guides speak multiple foreign languages fluently, ensuring smooth communication for visitors from all parts of the world.",
          why_guide_reason_3_title: "Safety & Trust",
          why_guide_reason_3_desc:
            "Authorized guides ensure that tourists are protected from fraud, misinformation, or unsafe travel arrangements.",
          why_guide_reason_4_title: "Cultural Accuracy",
          why_guide_reason_4_desc:
            "Licensed guides provide genuine historical and cultural insights, giving travellers the true story behind every monument and tradition.",
          why_guide_reason_5_title: "Transparency",
          why_guide_reason_5_desc:
            "Payments go directly from client to guide — no middlemen, no hidden costs.",
          yt_header: "Memory Feature",
          yt_title: "Our YouTube Memory Feature",
          yt_p1:
            "To make your journey unforgettable, we offer a complimentary video memory service.",
          yt_p2:
            "During your tour, your guide can capture short clips and highlights of your travel experience, which will later be edited and uploaded as a YouTube link — allowing you to:",
          yt_feat_1: "Relive your trip anytime, anywhere",
          yt_feat_2: "Share it easily with your loved ones",
          yt_feat_3: "Preserve your travel story forever",
          yt_p3:
            "This service is our way of adding a personal touch to your incredible Indian journey.",
          yt_overlay_title: "Complimentary Video Service",
        },
        es: {
          nav_home: "Inicio",
          nav_about: "Sobre Nosotros",
          nav_tours: "Tours",
          nav_find_guides: "Reservar un Guía",
          nav_become_guide: "Ser Guía",
          nav_how_it_works: "Cómo Funciona",
          nav_contact: "Contacto",
          profile_welcome: "¡Bienvenido!",
          profile_signin_prompt: "Inicia sesión",
          profile_login: "Iniciar Sesión",
          profile_register: "Registrarse",
          profile_dashboard: "Panel",
          profile_logout: "Cerrar Sesión",
          hero_title_taj: "Descubre el Taj Mahal",
          hero_subtitle_taj:
            "Experimenta la arquitectura mogol con guías expertos",
          hero_category_taj: "Tours de Patrimonio",
          tours_available: "Tours Disponibles",
          expert_guides: "Guías Expertos",
          average_rating: "Calificación Media",
          book_your_tour_now: "Reserva tu Tour",
          become_a_guide: "Conviértete en Guía",
          explore_tour_categories: "Explora Nuestras Categorías de Tours",
          explore_tour_categories_desc:
            "Elige entre nuestras experiencias auténticas, dirigidas por expertos locales certificados.",
          join_our_network: "Únete a Nuestra Red",
          become_certified_guide: "Conviértete en Guía Certificado",
          guide_reg_desc:
            "Únete a nuestra red de guías profesionales y comparte tu pasión por la cultura local.",
          booking_proc_title: "Proceso de Reserva Simple",
          booking_proc_desc: "Reserva tu tour perfecto en pocos clics.",
          testimonials_title_community: "Testimonios de Nuestra Comunidad",
          testimonials_desc:
            "Historias reales de viajeros que exploraron la India con nuestros guías.",
          about_platform_title: "Sobre",
          about_platform_p1:
            "IndiaTourManager.com es una plataforma digital que conecta guías turísticos lingüísticos certificados de toda la India con viajeros internacionales.",
          about_platform_p2:
            "Nuestra misión es empoderar a los guías turísticos de la India, mejorar la experiencia del visitante y promover un turismo auténtico y transparente.",
          about_platform_p3:
            "Reunimos una red de guías calificados que han superado los programas de certificación del gobierno. Los viajeros extranjeros pueden elegir y conectarse directamente con guías que coincidan con sus necesidades.",
          about_stat_guides: "Guías Certificados",
          about_stat_cities: "Ciudades Cubiertas",
          about_card_gov: "Gobierno",
          about_card_cert: "Certificado",
          about_card_lic: "Licenciado y Verificado",
          aims_header: "Nuestras Metas",
          aims_title: "Metas y Objetivos",
          aims_p1:
            "Nuestros objetivos estratégicos guían cada decisión, asegurando un impacto significativo para guías y viajeros.",
          aims_obj_1:
            "Crear un sistema de empleo transparente y directo para los guías turísticos con licencia de la India",
          aims_obj_2:
            "Promover el turismo indio a nivel mundial a través de la experiencia profesional y lingüística",
          aims_obj_3:
            "Mejorar la satisfacción del visitante a través de experiencias auténticas y bien guiadas",
          aims_obj_4:
            "Asegurar que los guías reciban pagos justos y puntuales, sin intermediarios",
          aims_obj_5:
            "Contribuir a la economía turística de la India empoderando a profesionales certificados",
          mission_vision_header: "Nuestro Propósito",
          mission_vision_title: "Declaración de Misión y Visión",
          mission_title: "Misión",
          mission_p:
            "Conectar a viajeros de todo el mundo con guías turísticos indios certificados y multilingües, asegurando que cada viaje por la India sea seguro, perspicaz e inolvidable.",
          vision_title: "Visión",
          vision_p:
            "Convertirnos en la plataforma en línea más confiable de la India para reservas de guías turísticos profesionales, elevando el estatus de los guías con licencia mientras redefinimos la experiencia de viaje global a través de la autenticidad y la transparencia.",
          why_choose_header: "Por Qué Elegirnos",
          why_choose_title:
            "Por Qué Elegir o Registrarse en IndiaTourManager.com",
          reason_1_title: "Acceso Directo",
          reason_1_desc:
            "Conéctate directamente con guías licenciados, sin agencias ni intermediarios.",
          footer_company_subtitle: "Turismo Profesional",
          footer_company_description:
            "Conectando viajeros con guías locales certificados para experiencias auténticas, seguras y memorables.",
          footer_available_languages: "Disponible en +15 idiomas",
        },
        fr: {
          nav_home: "Accueil",
          nav_about: "À Propos",
          nav_tours: "Circuits",
          nav_find_guides: "Réserver un Guide",
          nav_become_guide: "Devenir Guide",
          nav_how_it_works: "Comment Ça Marche",
          nav_contact: "Contact",
          profile_welcome: "Bienvenue !",
          profile_signin_prompt: "Connectez-vous",
          profile_login: "Connexion",
          profile_register: "S'inscrire",
          profile_dashboard: "Tableau de Bord",
          profile_logout: "Déconnexion",
          hero_title_taj: "Découvrez le Taj Mahal",
          hero_subtitle_taj:
            "Découvrez l'architecture moghole avec des guides experts",
          hero_category_taj: "Circuits du Patrimoine",
          tours_available: "Circuits Disponibles",
          expert_guides: "Guides Experts",
          average_rating: "Note Moyenne",
          book_your_tour_now: "Réservez Votre Circuit",
          become_a_guide: "Devenir Guide",
          explore_tour_categories: "Découvrez Nos Catégories de Circuits",
          explore_tour_categories_desc:
            "Choisissez parmi nos expériences authentiques, dirigées par des experts locaux certifiés.",
          join_our_network: "Rejoignez Notre Réseau",
          become_certified_guide: "Devenez Guide Certifié",
          guide_reg_desc:
            "Rejoignez notre réseau de guides professionnels et partagez votre passion pour la culture locale.",
          booking_proc_title: "Processus de Réservation Simple",
          booking_proc_desc:
            "Réservez votre circuit parfait en quelques clics.",
          testimonials_title_community: "Témoignages de Notre Communauté",
          testimonials_desc:
            "Histoires vraies de voyageurs ayant exploré l'Inde avec nos guides.",
          about_platform_title: "À Propos de",
          about_platform_p1:
            "IndiaTourManager.com est une plateforme numérique qui met en relation des guides touristiques linguistiques certifiés de toute l'Inde avec des voyageurs internationaux.",
          about_platform_p2:
            "Notre mission est de responsabiliser les guides touristiques indiens, d'améliorer l'expérience des visiteurs et de promouvoir un tourisme authentique et transparent.",
          about_platform_p3:
            "Nous rassemblons un réseau de guides qualifiés ayant réussi les programmes de certification gouvernementaux. Les voyageurs étrangers peuvent choisir et se connecter directement avec des guides correspondant à leurs besoins.",
          about_stat_guides: "Guides Certifiés",
          about_stat_cities: "Villes Couvertes",
          about_card_gov: "Gouvernement",
          about_card_cert: "Certifié",
          about_card_lic: "Licencié et Vérifié",
          aims_header: "Nos Buts",
          aims_title: "Buts et Objectifs",
          aims_p1:
            "Nos objectifs stratégiques guident chaque décision, garantissant un impact significatif pour les guides et les voyageurs.",
          aims_obj_1:
            "Créer un système d'emploi transparent et direct pour les guides touristiques licenciés en Inde",
          aims_obj_2:
            "Promouvoir le tourisme indien dans le monde grâce à une expertise professionnelle et linguistique",
          aims_obj_3:
            "Améliorer la satisfaction des visiteurs grâce à des expériences authentiques et bien guidées",
          aims_obj_4:
            "Garantir que les guides reçoivent des paiements équitables et ponctuels, sans intermédiaires",
          aims_obj_5:
            "Contribuer à l'économie touristique de l'Inde en responsabilisant les professionnels certifiés",
          mission_vision_header: "Notre Objectif",
          mission_vision_title: "Déclaration de Mission et Vision",
          mission_title: "Mission",
          mission_p:
            "Connecter les voyageurs du monde entier avec des guides touristiques indiens certifiés et multilingues, en veillant à ce que chaque voyage en Inde soit sûr, instructif et inoubliable.",
          vision_p:
            "Devenir la plateforme en ligne la plus fiable de l'Inde pour les réservations de guides touristiques professionnels, en rehaussant le statut des guides licenciés tout en redéfinissant l'expérience de voyage mondiale par l'authenticité et la transparence.",
          why_choose_header: "Pourquoi Nous Choisir",
          why_choose_title:
            "Pourquoi Choisir ou S'inscrire sur IndiaTourManager.com",
          reason_1_title: "Accès Direct",
          reason_1_desc:
            "Connectez-vous directement avec des guides agréés - sans agences ni courtiers.",
          footer_company_subtitle: "Tourisme Professionnel",
          footer_company_description:
            "Mettre en relation les voyageurs avec des guides locaux certifiés pour des expériences authentiques et sûres.",
          footer_available_languages: "Disponible en +15 langues",
        },
        ru: {
          nav_home: "Главная",
          nav_about: "О нас",
          nav_tours: "Туры",
          nav_find_guides: "Найти Гида",
          nav_become_guide: "Стать Гидом",
          nav_how_it_works: "Как это работает",
          nav_contact: "Контакты",
          profile_welcome: "Добро пожаловать!",
          profile_signin_prompt: "Войдите в аккаунт",
          profile_login: "Войти",
          profile_register: "Регистрация",
          profile_dashboard: "Панель",
          profile_logout: "Выйти",
          hero_title_taj: "Откройте Тадж-Махал",
          hero_subtitle_taj:
            "Познакомьтесь с архитектурой моголов с гидами-экспертами",
          hero_category_taj: "Туры по наследию",
          tours_available: "Доступно Туров",
          expert_guides: "Эксперты-гиды",
          average_rating: "Средний Рейтинг",
          book_your_tour_now: "Забронировать Тур",
          become_a_guide: "Стать Гидом",
          explore_tour_categories: "Наши Категории Туров",
          explore_tour_categories_desc:
            "Выберите из наших аутентичных впечатлений, проводимых сертифицированными местными экспертами.",
          join_our_network: "Присоединяйтесь к Нашей Сети",
          become_certified_guide: "Станьте Сертифицированным Гидом",
          guide_reg_desc:
            "Присоединяйтесь к нашей сети профессиональных гидов и делитесь своей страстью к местной культуре.",
          booking_proc_title: "Простой Процесс Бронирования",
          booking_proc_desc:
            "Забронируйте свой идеальный тур в несколько кликов.",
          testimonials_title_community: "Отзывы Нашего Сообщества",
          testimonials_desc:
            "Реальные истории путешественников, исследовавших Индию с нашими гидами.",
          about_platform_title: "О",
          about_platform_p1:
            "IndiaTourManager.com - это единая цифровая платформа, которая связывает сертифицированных лингвистических гидов со всей Индии с международными путешественниками.",
          about_platform_p2:
            "Наша миссия - расширить возможности гидов Индии, улучшить впечатления посетителей и продвигать аутентичный и прозрачный туризм.",
          about_platform_p3:
            "Мы объединяем сеть квалифицированных гидов, прошедших государственную сертификацию. Иностранные путешественники могут напрямую выбирать и связываться с гидами, соответствующими их потребностям.",
          about_stat_guides: "Сертифицированных Гидов",
          about_stat_cities: "Охвачено Городов",
          about_card_gov: "Правительство",
          about_card_cert: "Сертифицировано",
          about_card_lic: "Лицензировано и Проверено",
          aims_header: "Наши Цели",
          aims_title: "Цели и Задачи",
          aims_p1:
            "Наши стратегические цели определяют каждое наше решение, обеспечивая значимое влияние для гидов и путешественников.",
          aims_obj_1:
            "Создать прозрачную и прямую систему трудоустройства для лицензированных гидов Индии",
          aims_obj_2:
            "Продвигать индийский туризм на мировом уровне через профессиональную и языковую экспертизу",
          aims_obj_3:
            "Повысить удовлетворенность посетителей за счет аутентичных и хорошо организованных впечатлений",
          aims_obj_4:
            "Гарантировать, что гиды получают справедливую и своевременную оплату без посредников",
          aims_obj_5:
            "Вносить вклад в экономику туризма Индии, расширяя возможности сертифицированных профессионалов",
          mission_vision_header: "Наша Цель",
          mission_vision_title: "Заявление о Миссии и Видении",
          mission_title: "Миссия",
          mission_p:
            "Связать путешественников со всего мира с сертифицированными, многоязычными индийскими гидами, чтобы каждое путешествие по Индии было безопасным, познавательным и незабываемым.",
          vision_p:
            "Стать самой надежной онлайн-платформой в Индии для бронирования профессиональных гидов, повышая статус лицензированных гидов и переосмысливая мировой опыт путешествий через подлинность и прозрачность.",
          why_choose_header: "Почему Мы",
          why_choose_title:
            "Почему стоит выбрать или зарегистрироваться на IndiaTourManager.com",
          reason_1_title: "Прямой Доступ",
          reason_1_desc:
            "Связывайтесь напрямую с лицензированными гидами — без агентств и посредников.",
          footer_company_subtitle: "Профессиональный Туризм",
          footer_company_description:
            "Связываем путешественников с сертифицированными местными гидами для аутентичных и безопасных впечатлений.",
          footer_available_languages: "Доступно на 15+ языках",
        },
        de: {
          nav_home: "Start",
          nav_about: "Über Uns",
          nav_tours: "Touren",
          nav_find_guides: "Guide Buchen",
          nav_become_guide: "Guide Werden",
          nav_how_it_works: "So Geht's",
          nav_contact: "Kontakt",
          profile_welcome: "Willkommen!",
          profile_signin_prompt: "Einloggen",
          profile_login: "Anmelden",
          profile_register: "Registrieren",
          profile_dashboard: "Dashboard",
          profile_logout: "Abmelden",
          hero_title_taj: "Entdecken Sie das Taj Mahal",
          hero_subtitle_taj:
            "Erleben Sie Mogul-Architektur mit Expertenführern",
          hero_category_taj: "Kulturerbe-Touren",
          tours_available: "Verfügbare Touren",
          expert_guides: "Experten-Guides",
          average_rating: "Ø-Bewertung",
          book_your_tour_now: "Tour Buchen",
          become_a_guide: "Guide Werden",
          explore_tour_categories: "Unsere Tour-Kategorien",
          explore_tour_categories_desc:
            "Wählen Sie aus authentischen Erlebnissen, geleitet von zertifizierten lokalen Experten.",
          join_our_network: "Treten Sie unserem Netzwerk bei",
          become_certified_guide: "Werden Sie zertifizierter Guide",
          guide_reg_desc:
            "Treten Sie unserem Netzwerk professioneller Guides bei und teilen Sie Ihre Leidenschaft für die lokale Kultur.",
          booking_proc_title: "Einfacher Buchungsprozess",
          booking_proc_desc: "Buchen Sie Ihre perfekte Tour in wenigen Klicks.",
          testimonials_title_community: "Stimmen aus unserer Community",
          testimonials_desc:
            "Echte Geschichten von Reisenden, die Indien mit unseren Guides erkundet haben.",
          about_platform_title: "Über",
          about_platform_p1:
            "IndiaTourManager.com ist eine digitale Plattform, die zertifizierte sprachkundige Reiseführer aus ganz Indien mit internationalen Reisenden verbindet.",
          about_platform_p2:
            "Unsere Mission ist es, Indiens Reiseführer zu stärken, das Besuchererlebnis zu verbessern und authentischen, verantwortungsvollen Tourismus zu fördern.",
          about_platform_p3:
            "Wir vereinen ein Netzwerk qualifizierter Führer, die staatliche Zertifizierungsprogramme bestanden haben. Ausländische Reisende können direkt Führer auswählen und kontaktieren, die ihren Bedürfnissen entsprechen.",
          about_stat_guides: "Zertifizierte Guides",
          about_stat_cities: "Abgedeckte Städte",
          about_card_gov: "Regierung",
          about_card_cert: "Zertifiziert",
          about_card_lic: "Lizenziert & Verifiziert",
          aims_header: "Unsere Ziele",
          aims_title: "Ziele & Absichten",
          aims_p1:
            "Unsere strategischen Ziele leiten jede Entscheidung und gewährleisten eine bedeutende Wirkung für Guides und Reisende.",
          aims_obj_1:
            "Ein transparentes und direktes Beschäftigungssystem für lizenzierte Reiseführer in Indien zu schaffen",
          aims_obj_2:
            "Den indischen Tourismus weltweit durch professionelle und sprachliche Expertise zu fördern",
          aims_obj_3:
            "Die Zufriedenheit der Besucher durch authentische und gut geführte Erlebnisse zu steigern",
          aims_obj_4:
            "Sicherzustellen, dass Führer faire und pünktliche Zahlungen ohne Zwischenhändler erhalten",
          aims_obj_5:
            "Zur indischen Tourismuswirtschaft beizutragen, indem zertifizierte Fachkräfte gestärkt werden",
          mission_vision_header: "Unser Zweck",
          mission_vision_title: "Leitbild & Vision",
          mission_title: "Mission",
          mission_p:
            "Reisende aus aller Welt mit zertifizierten, mehrsprachigen indischen Reiseführern zu verbinden — um sicherzustellen, dass jede Reise durch Indien sicher, aufschlussreich und unvergesslich ist.",
          vision_p:
            "Indiens vertrauenswürdigste Online-Plattform für die Buchung professioneller Reiseführer zu werden, den Status lizenzierter Führer zu verbessern und das globale Reiseerlebnis durch Authentizität und Transparenz neu zu definieren.",
          why_choose_header: "Warum Uns Wählen",
          why_choose_title:
            "Warum Sie sich bei IndiaTourManager.com entscheiden oder anmelden sollten",
          reason_1_title: "Direkter Zugang",
          reason_1_desc:
            "Verbinden Sie sich direkt mit lizenzierten Guides – keine Agenturen oder Vermittler.",
          footer_company_subtitle: "Professioneller Tourismus",
          footer_company_description:
            "Verbindet Reisende mit zertifizierten lokalen Guides für authentische und sichere Erlebnisse.",
          footer_available_languages: "Verfügbar in 15+ Sprachen",
        },
      };
      let translation = translations[language]?.[key] || key;
      if (replacements) {
        Object.keys(replacements).forEach((placeholder) => {
          translation = translation.replace(
            `{${placeholder}}`,
            String(replacements[placeholder])
          );
        });
      }
      return translation;
    },
    [language]
  );

  const value: LanguageContextType = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
