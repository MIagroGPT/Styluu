import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  es: {
    // Nav
    nav_home: 'Inicio',
    nav_explore: 'Explorar',
    nav_business: 'Para Negocios (SaaS)',
    nav_for_business_sub: 'Styluu for Business',
    nav_my_bookings: 'Mis Citas',
    nav_login: 'Iniciar Sesión',
    nav_register: 'Registrarse',
    nav_switch_to_client: 'Vista Cliente',
    nav_switch_to_business: 'Panel de Salón / Barbero',
    nav_search_placeholder: 'Buscar servicios, salones o barberías...',
    nav_location: 'Ubicación',

    // Hero
    hero_badge: '✨ La plataforma n.° 1 en USA & Internacional',
    hero_title_1: 'Reserva tu estilo.',
    hero_title_2: 'Eleva tu negocio.',
    hero_subtitle: 'Descubre los mejores salones de belleza, barberías y spas cerca de ti. Reserva en segundos y disfruta de una experiencia de clase mundial.',
    hero_search_service: '¿Qué servicio buscas?',
    hero_search_service_hint: 'Corte, Barba, Uñas, Spa...',
    hero_search_location: '¿Dónde?',
    hero_search_location_hint: 'Miami, Nueva York, Los Ángeles...',
    hero_search_date: '¿Cuándo?',
    hero_search_date_any: 'Cualquier fecha',
    hero_search_btn: 'Buscar',
    hero_stats_salons: '+5,000 Salones & Spas',
    hero_stats_bookings: '1.2M+ Citas Reservadas',
    hero_stats_rating: '4.9 ★ Valoración Promedio',

    // Categories
    cat_title: 'Una plataforma, infinitas posibilidades',
    cat_subtitle: 'Encuentra el servicio perfecto adaptado a tu estilo de vida',
    cat_hair: 'Salón de Belleza',
    cat_barber: 'Barbería',
    cat_nails: 'Salones de Uñas',
    cat_spa: 'Spa & Sauna',
    cat_aesthetics: 'Medicina Estética',
    cat_massage: 'Masajes Terapéuticos',
    cat_fitness: 'Fitness & Recuperación',
    cat_physio: 'Fisioterapia & Salud',
    cat_tattoo: 'Tatuaje & Piercing',
    cat_pet: 'Peluquería de Mascotas',
    cat_tanning: 'Bronceado & Solarium',

    // Featured Salons
    featured_title: 'Salones y Barberías Destacados',
    featured_subtitle: 'Espacios verificados con las mejores calificaciones y disponibilidad inmediata',
    featured_filter_all: 'Todos',
    featured_filter_barbershop: 'Barberías',
    featured_filter_salon: 'Salones de Belleza',
    featured_filter_spa: 'Spas & Wellness',
    featured_filter_nails: 'Nails & Skincare',
    book_now: 'Reservar ahora',
    from_price: 'Desde',
    distance: 'a',

    // Business pitch (Fresha style)
    biz_pitch_badge: 'STYLUU FOR BUSINESS',
    biz_pitch_title: 'El software de gestión todo-en-uno que revoluciona tu salón',
    biz_pitch_subtitle: 'Todo lo que necesitas para crecer y triunfar. Styluu incluye las herramientas clave para multiplicar tus reservas, gestionar tu equipo y fidelizar clientes.',
    biz_feat_1_title: 'Calendario Inteligente Multi-Staff',
    biz_feat_1_desc: 'Controla citas en tiempo real, bloquea horarios y asigna clientes con vista diaria, semanal y por especialista.',
    biz_feat_2_title: 'Punto de Venta (POS) & Pagos',
    biz_feat_2_desc: 'Acepta pagos con tarjeta, propinas automáticas, divide cuentas y vende productos de tienda física.',
    biz_feat_3_title: 'Recordatorios Automatizados',
    biz_feat_3_desc: 'Reduce inasistencias hasta en un 89% con avisos automáticos por WhatsApp y SMS.',
    biz_feat_4_title: 'CRM de Clientes & Analítica',
    biz_feat_4_desc: 'Historial completo de servicios, fotos de antes/después, preferencias y reportes financieros.',
    biz_cta_btn: 'Comenzar Gratis',
    biz_cta_demo: 'Ver Demostración en Vivo',

    // Booking Modal
    booking_title: 'Reserva tu cita',
    booking_step_services: '1. Servicios',
    booking_step_staff: '2. Especialista',
    booking_step_time: '3. Fecha y Hora',
    booking_step_confirm: '4. Confirmación',
    booking_select_service: 'Elige tus servicios',
    booking_service_duration: 'duración',
    booking_select_specialist: 'Selecciona tu especialista',
    booking_any_specialist: 'Cualquier profesional disponible (Más rápido)',
    booking_specialist_recommended: 'Recomendado',
    booking_select_date_time: 'Selecciona fecha y hora',
    booking_available_slots: 'Horas disponibles',
    booking_customer_info: 'Datos del cliente',
    booking_name: 'Nombre completo',
    booking_phone: 'Teléfono (para recordatorio WhatsApp)',
    booking_email: 'Correo electrónico',
    booking_payment_method: 'Método de pago',
    booking_pay_venue: 'Pagar en el local (Efectivo / Tarjeta)',
    booking_pay_online: 'Pagar ahora con Tarjeta / Apple Pay',
    booking_btn_continue: 'Continuar',
    booking_btn_back: 'Atrás',
    booking_btn_confirm: 'Confirmar Reserva',
    booking_summary_total: 'Total Estimado',
    booking_success_title: '¡Cita confirmada!',
    booking_success_subtitle: 'Todo listo, te estamos esperando.',
    booking_success_sms: 'Te hemos enviado los detalles de tu cita a tu correo y WhatsApp.',
    booking_view_my_bookings: 'Ver mis citas',
    booking_new_booking: 'Hacer otra reserva',

    // Styluu Business OS
    bos_dashboard: 'Dashboard',
    bos_calendar: 'Calendario',
    bos_appointments: 'Citas',
    bos_clients: 'Clientes CRM',
    bos_services: 'Servicios',
    bos_team: 'Equipo',
    bos_pos: 'Punto de Venta (POS)',
    bos_analytics: 'Analítica',
    bos_settings: 'Configuración',
    bos_new_appointment: 'Nueva Cita',
    bos_today: 'Hoy',
    bos_day_view: 'Día',
    bos_week_view: 'Semana',
    bos_revenue_today: 'Ingresos de Hoy',
    bos_active_appointments: 'Citas Hoy',
    bos_occupancy_rate: 'Tasa de Ocupación',
    bos_new_clients: 'Nuevos Clientes',
    bos_status_confirmed: 'Confirmada',
    bos_status_in_progress: 'En Servicio',
    bos_status_completed: 'Completada',
    bos_status_cancelled: 'Cancelada',
    bos_status_no_show: 'No Asistió',

    // POS
    pos_title: 'Punto de Venta Styluu POS',
    pos_client: 'Cliente',
    pos_services_performed: 'Servicios Realizados',
    pos_add_product: 'Añadir Producto',
    pos_tip: 'Propina',
    pos_subtotal: 'Subtotal',
    pos_tax: 'Impuestos (Tax)',
    pos_total: 'Total a Cobrar',
    pos_charge_btn: 'Procesar Cobro',
    pos_receipt_sent: 'Recibo digital emitido',

    // Footer
    footer_tagline: 'La plataforma definitiva de reservas de belleza y software para profesionales.',
    footer_rights: 'Todos los derechos reservados. Styluu Inc. www.styluu.com',
    footer_company: 'Empresa',
    footer_for_business: 'Para Negocios',
    footer_legal: 'Legal',
    footer_privacy: 'Privacidad',
    footer_terms: 'Términos de Servicio',
    footer_cookies: 'Cookies'
  },
  en: {
    // Nav
    nav_home: 'Home',
    nav_explore: 'Explore',
    nav_business: 'For Business (SaaS)',
    nav_for_business_sub: 'Styluu for Business',
    nav_my_bookings: 'My Appointments',
    nav_login: 'Log In',
    nav_register: 'Sign Up',
    nav_switch_to_client: 'Client Mode',
    nav_switch_to_business: 'Salon / Barber OS',
    nav_search_placeholder: 'Search services, salons or barbershops...',
    nav_location: 'Location',

    // Hero
    hero_badge: '✨ The #1 Platform in USA & International',
    hero_title_1: 'Book your style.',
    hero_title_2: 'Elevate your business.',
    hero_subtitle: 'Discover top-rated beauty salons, barbershops, and luxury spas near you. Book in seconds and experience seamless wellness.',
    hero_search_service: 'What service?',
    hero_search_service_hint: 'Haircut, Beard, Nails, Massage...',
    hero_search_location: 'Where?',
    hero_search_location_hint: 'Miami, New York, Los Angeles...',
    hero_search_date: 'When?',
    hero_search_date_any: 'Any date',
    hero_search_btn: 'Search',
    hero_stats_salons: '5,000+ Salons & Spas',
    hero_stats_bookings: '1.2M+ Bookings Made',
    hero_stats_rating: '4.9 ★ Average Rating',

    // Categories
    cat_title: 'One platform, infinite possibilities',
    cat_subtitle: 'Find the perfect self-care experience tailored to your lifestyle',
    cat_hair: 'Hair Salon',
    cat_barber: 'Barbershop',
    cat_nails: 'Nail Salons',
    cat_spa: 'Spa & Sauna',
    cat_aesthetics: 'Aesthetics & MedSpa',
    cat_massage: 'Massage Therapy',
    cat_fitness: 'Fitness & Recovery',
    cat_physio: 'Physiotherapy & Clinic',
    cat_tattoo: 'Tattoo & Piercing',
    cat_pet: 'Pet Grooming',
    cat_tanning: 'Tanning Salon',

    // Featured Salons
    featured_title: 'Featured Salons & Barbershops',
    featured_subtitle: 'Verified partner venues with top ratings and instant booking slots',
    featured_filter_all: 'All',
    featured_filter_barbershop: 'Barbershops',
    featured_filter_salon: 'Hair Salons',
    featured_filter_spa: 'Spas & Wellness',
    featured_filter_nails: 'Nails & Skincare',
    book_now: 'Book Now',
    from_price: 'From',
    distance: 'away',

    // Business pitch (Fresha style)
    biz_pitch_badge: 'STYLUU FOR BUSINESS',
    biz_pitch_title: 'The all-in-one management software powering the modern salon',
    biz_pitch_subtitle: 'Everything you need to thrive. Styluu includes key tools to boost sales, manage multi-staff schedules, and retain clients seamlessly.',
    biz_feat_1_title: 'Smart Multi-Staff Calendar',
    biz_feat_1_desc: 'Real-time booking matrix, block time slots, and assign clients with daily, weekly, and specialist columns.',
    biz_feat_2_title: 'Point of Sale (POS) & Payments',
    biz_feat_2_desc: 'Accept cards, Apple Pay, automated tips, split bills, and sell retail products on the spot.',
    biz_feat_3_title: 'Automated Reminders',
    biz_feat_3_desc: 'Reduce no-shows by up to 89% with automatic WhatsApp & SMS confirmations and reminders.',
    biz_feat_4_title: 'Client CRM & Analytics',
    biz_feat_4_desc: 'Complete service history, before/after photos, formulas, notes, and revenue performance analytics.',
    biz_cta_btn: 'Get Started Free',
    biz_cta_demo: 'Live Interactive Demo',

    // Booking Modal
    booking_title: 'Book Appointment',
    booking_step_services: '1. Services',
    booking_step_staff: '2. Specialist',
    booking_step_time: '3. Date & Time',
    booking_step_confirm: '4. Confirmation',
    booking_select_service: 'Choose your services',
    booking_service_duration: 'duration',
    booking_select_specialist: 'Select your specialist',
    booking_any_specialist: 'Any available professional (Fastest)',
    booking_specialist_recommended: 'Recommended',
    booking_select_date_time: 'Select date & time',
    booking_available_slots: 'Available time slots',
    booking_customer_info: 'Customer details',
    booking_name: 'Full Name',
    booking_phone: 'Phone number (for SMS/WhatsApp)',
    booking_email: 'Email address',
    booking_payment_method: 'Payment method',
    booking_pay_venue: 'Pay at venue (Cash / Card)',
    booking_pay_online: 'Pay now with Card / Apple Pay',
    booking_btn_continue: 'Continue',
    booking_btn_back: 'Back',
    booking_btn_confirm: 'Confirm Booking',
    booking_summary_total: 'Estimated Total',
    booking_success_title: 'Booking Confirmed!',
    booking_success_subtitle: 'All set, we are looking forward to seeing you.',
    booking_success_sms: 'We have sent your booking details via Email & WhatsApp.',
    booking_view_my_bookings: 'View my bookings',
    booking_new_booking: 'Book another service',

    // Styluu Business OS
    bos_dashboard: 'Dashboard',
    bos_calendar: 'Calendar',
    bos_appointments: 'Appointments',
    bos_clients: 'Clients CRM',
    bos_services: 'Services',
    bos_team: 'Team',
    bos_pos: 'Point of Sale (POS)',
    bos_analytics: 'Analytics',
    bos_settings: 'Settings',
    bos_new_appointment: 'New Appointment',
    bos_today: 'Today',
    bos_day_view: 'Day',
    bos_week_view: 'Week',
    bos_revenue_today: "Today's Revenue",
    bos_active_appointments: "Today's Bookings",
    bos_occupancy_rate: 'Occupancy Rate',
    bos_new_clients: 'New Clients',
    bos_status_confirmed: 'Confirmed',
    bos_status_in_progress: 'In Service',
    bos_status_completed: 'Completed',
    bos_status_cancelled: 'Cancelled',
    bos_status_no_show: 'No Show',

    // POS
    pos_title: 'Styluu POS Register',
    pos_client: 'Client',
    pos_services_performed: 'Services Rendered',
    pos_add_product: 'Add Retail Product',
    pos_tip: 'Tip',
    pos_subtotal: 'Subtotal',
    pos_tax: 'Tax',
    pos_total: 'Total Due',
    pos_charge_btn: 'Process Payment',
    pos_receipt_sent: 'Digital receipt sent',

    // Footer
    footer_tagline: 'The premier beauty & wellness marketplace and salon operating system.',
    footer_rights: 'All rights reserved. Styluu Inc. www.styluu.com',
    footer_company: 'Company',
    footer_for_business: 'For Business',
    footer_legal: 'Legal',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_cookies: 'Cookie Preferences'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('styluu_lang') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('styluu_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['es']?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
