// Styluu Platform Mock Data

export const CATEGORIES = [
  {
    id: 'barber',
    name: 'Barbería',
    nameEn: 'Barbershop',
    icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    count: '1,420 locales',
    tag: 'Popular'
  },
  {
    id: 'hair-salon',
    name: 'Salón de Belleza',
    nameEn: 'Hair Salon',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    count: '2,850 locales',
    tag: 'Trending'
  },
  {
    id: 'nails',
    name: 'Salones de Uñas',
    nameEn: 'Nail Salon',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    count: '980 locales',
    tag: 'High Demand'
  },
  {
    id: 'spa',
    name: 'Spa & Sauna',
    nameEn: 'Spa & Sauna',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    count: '640 locales',
    tag: 'Relax'
  },
  {
    id: 'aesthetics',
    name: 'Medicina Estética',
    nameEn: 'Aesthetics Clinic',
    icon: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1512290900672-1f4a974cc9ef?auto=format&fit=crop&w=800&q=80',
    count: '420 locales',
    tag: 'Premium'
  },
  {
    id: 'massage',
    name: 'Masajes Terapéuticos',
    nameEn: 'Massage Therapy',
    icon: 'Sun',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    count: '730 locales',
    tag: 'Wellness'
  },
  {
    id: 'physio',
    name: 'Fisioterapia & Clínica',
    nameEn: 'Physio & Clinic',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    count: '310 locales',
    tag: 'Health'
  },
  {
    id: 'tattoo',
    name: 'Tatuaje & Piercing',
    nameEn: 'Tattoo & Piercing',
    icon: 'Feather',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
    count: '510 locales',
    tag: 'Art'
  },
  {
    id: 'pet-grooming',
    name: 'Peluquería de Mascotas',
    nameEn: 'Pet Grooming',
    icon: 'Smile',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    count: '380 locales',
    tag: 'Pet Care'
  },
  {
    id: 'tanning',
    name: 'Centro de Bronceado',
    nameEn: 'Tanning Salon',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    count: '240 locales',
    tag: 'Glow'
  }
];

export const STAFF_MEMBERS = [
  {
    id: 'staff-1',
    name: 'John Templeton',
    role: 'Master Barber & Stylist',
    rating: 4.9,
    reviewsCount: 312,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    color: '#6045F4',
    commissionRate: 50,
    specialties: ['Fade Cuts', 'Beard Sculpting', 'Hot Towel Shave']
  },
  {
    id: 'staff-2',
    name: 'Maria Santos',
    role: 'Senior Hair Colorist',
    rating: 5.0,
    reviewsCount: 480,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    color: '#53E6D4',
    commissionRate: 45,
    specialties: ['Balayage', 'Hair Botox', 'Luxury Blowout']
  },
  {
    id: 'staff-3',
    name: 'Wendy Lin',
    role: 'Aesthetician & Spa Director',
    rating: 4.9,
    reviewsCount: 220,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    color: '#F472B6',
    commissionRate: 55,
    specialties: ['Hydrafacial', 'Deep Cleansing', 'Relaxation Massage']
  },
  {
    id: 'staff-4',
    name: 'Amy Jones',
    role: 'Nail Artist & Brow Expert',
    rating: 4.8,
    reviewsCount: 195,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    color: '#FB923C',
    commissionRate: 40,
    specialties: ['Gel-X Nails', 'Russian Manicure', 'Brow Lamination']
  },
  {
    id: 'staff-5',
    name: 'Michael Vance',
    role: 'Barber & Grooming Specialist',
    rating: 4.9,
    reviewsCount: 160,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    color: '#38BDF8',
    commissionRate: 60,
    specialties: ['Skin Fade', 'Razor Design', 'Scalp Treatment']
  }
];

export const VENUES = [
  {
    id: 'venue-1',
    name: 'The Hustle Barber & Lounge',
    tagline: 'Barbería Moderna de Alta Gama y Cuidado Masculino',
    category: 'barber',
    rating: 4.9,
    reviewsCount: 428,
    city: 'Miami, FL',
    address: '840 Brickell Ave, Miami, FL 33131',
    distance: '0.8 miles',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80'
    ],
    priceRange: '$$',
    featured: true,
    badges: ['Top Rated 2026', 'Instant Booking', 'Styluu Verified'],
    startingPrice: 35,
    hours: '9:00 AM - 8:00 PM',
    services: [
      {
        id: 'srv-1',
        name: 'Corte de Cabello Signature',
        nameEn: 'Signature Haircut',
        description: 'Corte personalizado con tijera y máquina, lavado premium, toalla caliente y peinado.',
        price: 45,
        duration: 40,
        category: 'Cabello'
      },
      {
        id: 'srv-2',
        name: 'Diseño y Perfilado de Barba',
        nameEn: 'Beard Trim & Sculpt',
        description: 'Perfilado con navaja japonesa, aceites esenciales aromáticos y toalla caliente.',
        price: 30,
        duration: 30,
        category: 'Barba'
      },
      {
        id: 'srv-3',
        name: 'Combo Completo: Corte + Barba VIP',
        nameEn: 'VIP Combo: Haircut & Beard Grooming',
        description: 'La experiencia completa: corte, barba, exfoliación facial exprés y bebida de cortesía.',
        price: 70,
        duration: 65,
        popular: true,
        category: 'Combos'
      },
      {
        id: 'srv-4',
        name: 'Limpieza Facial & Mascarilla de Carbón',
        nameEn: 'Black Mask Facial & Scrub',
        description: 'Exfoliación profunda para eliminar impurezas y revitalizar la piel.',
        price: 35,
        duration: 25,
        category: 'Tratamientos'
      },
      {
        id: 'srv-5',
        name: 'Perfilado de Cejas con Navaja',
        nameEn: 'Eyebrow Clean & Shape',
        description: 'Limpieza rápida y definición simétrica de cejas masculinas.',
        price: 15,
        duration: 15,
        category: 'Detalles'
      }
    ]
  },
  {
    id: 'venue-2',
    name: 'Luxe Botanicals Hair & Color Lab',
    tagline: 'Alta Peluquería, Balayage Orgánico y Tratamientos Capilares',
    category: 'hair-salon',
    rating: 5.0,
    reviewsCount: 610,
    city: 'New York, NY',
    address: '420 W Broadway, SoHo, New York, NY 10012',
    distance: '1.2 miles',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80'
    ],
    priceRange: '$$$',
    featured: true,
    badges: ['Celebrity Choice', 'Eco-Friendly', '5.0 Stars'],
    startingPrice: 65,
    hours: '8:30 AM - 7:30 PM',
    services: [
      {
        id: 'srv-201',
        name: 'Corte de Dama & Blowout Estilo NYC',
        nameEn: 'Women Cut & Luxury NYC Blowout',
        description: 'Diagnóstico capilar, corte de precisión, hidratación profunda y peinado duradero.',
        price: 85,
        duration: 60,
        popular: true,
        category: 'Corte & Estilo'
      },
      {
        id: 'srv-202',
        name: 'Balayage & Iluminación Personalizada',
        nameEn: 'Full Balayage & Gloss Treatment',
        description: 'Técnica a mano alzada para un degradado natural, incluye matiz y tratamiento Olaplex.',
        price: 220,
        duration: 150,
        popular: true,
        category: 'Color'
      },
      {
        id: 'srv-203',
        name: 'Tratamiento Botox Capilar / Keratina',
        nameEn: 'Hair Botox & Anti-Frizz Ritual',
        description: 'Nutrición intensiva con aminoácidos y brillo espejo sin formol.',
        price: 160,
        duration: 90,
        category: 'Tratamientos'
      }
    ]
  },
  {
    id: 'venue-3',
    name: 'Aura Sanctuary & Wellness Spa',
    tagline: 'Masajes Holísticos, Hidroterapia y Circuitos Termales',
    category: 'spa',
    rating: 4.9,
    reviewsCount: 389,
    city: 'Los Angeles, CA',
    address: '9250 Wilshire Blvd, Beverly Hills, CA 90212',
    distance: '2.5 miles',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80'
    ],
    priceRange: '$$$$',
    featured: true,
    badges: ['Luxury Wellness', 'Private Suites'],
    startingPrice: 95,
    hours: '10:00 AM - 9:00 PM',
    services: [
      {
        id: 'srv-301',
        name: 'Masaje Sueco con Aromaterapia (60 min)',
        nameEn: 'Swedish Aromatherapy Massage (60 min)',
        description: 'Alivia tensiones con aceites esenciales botánicos y música binaural.',
        price: 110,
        duration: 60,
        popular: true,
        category: 'Masajes'
      },
      {
        id: 'srv-302',
        name: 'Facial Iluminador Hydrafacial Platinum',
        nameEn: 'Hydrafacial Platinum Ritual',
        description: 'Drenaje linfático, extracción suave y fusión de antioxidantes con ácido hialurónico.',
        price: 195,
        duration: 60,
        category: 'Faciales'
      }
    ]
  },
  {
    id: 'venue-4',
    name: 'Velvet Nails & Brow Studio',
    tagline: 'Manicura Rusa, Gel-X de Larga Duración y Diseño de Mirada',
    category: 'nails',
    rating: 4.8,
    reviewsCount: 512,
    city: 'Miami, FL',
    address: '250 NW 24th St, Wynwood, Miami, FL 33127',
    distance: '1.7 miles',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80'
    ],
    priceRange: '$$',
    featured: false,
    badges: ['Trendy Nail Art', 'Fast Booking'],
    startingPrice: 40,
    hours: '9:00 AM - 7:00 PM',
    services: [
      {
        id: 'srv-401',
        name: 'Manicura Rusa con Esmaltado Semipermanente',
        nameEn: 'Russian Manicure + Gel Polish',
        description: 'Limpieza milimétrica de cutícula y nivelación con base de goma estructurada.',
        price: 60,
        duration: 60,
        popular: true,
        category: 'Manicura'
      },
      {
        id: 'srv-402',
        name: 'Extensiones Gel-X con Nail Art Personalizado',
        nameEn: 'Gel-X Extensions + Custom Nail Art',
        description: 'Extensiones 100% gel suaves y resistentes con diseño a mano alzada.',
        price: 95,
        duration: 90,
        category: 'Uñas Esculpidas'
      }
    ]
  }
];

// Initial bookings for the Styluu Business OS Multi-Staff Calendar (Fresha style)
export const INITIAL_CALENDAR_APPOINTMENTS = [
  {
    id: 'apt-101',
    staffId: 'staff-1', // John Templeton
    clientName: 'Derrick Johnson',
    clientPhone: '+1 (305) 555-0192',
    clientEmail: 'derrick.j@gmail.com',
    serviceName: 'Corte + Barba VIP',
    serviceCategory: 'Combos',
    price: 70,
    startTime: '09:00',
    endTime: '10:05',
    date: '2026-09-03',
    status: 'confirmed',
    color: '#6045F4',
    notes: 'Prefiere toalla con eucalipto. Cliente frecuente.'
  },
  {
    id: 'apt-102',
    staffId: 'staff-1',
    clientName: 'Alex Rodriguez',
    clientPhone: '+1 (305) 555-4821',
    clientEmail: 'alex.rod@gmail.com',
    serviceName: 'Corte Fade Master',
    serviceCategory: 'Cabello',
    price: 45,
    startTime: '10:30',
    endTime: '11:10',
    date: '2026-09-03',
    status: 'in_progress',
    color: '#6045F4',
    notes: 'Skin fade medio, navaja en contornos.'
  },
  {
    id: 'apt-103',
    staffId: 'staff-2', // Maria Santos
    clientName: 'Brenda Massey',
    clientPhone: '+1 (212) 555-7734',
    clientEmail: 'brenda.m@outlook.com',
    serviceName: 'Blowout NYC & Tratamiento',
    serviceCategory: 'Corte & Estilo',
    price: 85,
    startTime: '09:00',
    endTime: '10:00',
    date: '2026-09-03',
    status: 'confirmed',
    color: '#53E6D4',
    notes: 'Cabello ondulado, usar protector térmico.'
  },
  {
    id: 'apt-104',
    staffId: 'staff-2',
    clientName: 'Alena Geidt',
    clientPhone: '+1 (212) 555-9011',
    clientEmail: 'alena.g@yahoo.com',
    serviceName: 'Balayage & Matiz Glow',
    serviceCategory: 'Color',
    price: 220,
    startTime: '10:15',
    endTime: '12:45',
    date: '2026-09-03',
    status: 'confirmed',
    color: '#53E6D4',
    notes: 'Retoque de rubio cenizo.'
  },
  {
    id: 'apt-105',
    staffId: 'staff-3', // Wendy Lin
    clientName: 'James Horwitz',
    clientPhone: '+1 (310) 555-6612',
    clientEmail: 'james.h@gmail.com',
    serviceName: 'Masaje Relajante & Sauna',
    serviceCategory: 'Masajes',
    price: 110,
    startTime: '09:30',
    endTime: '10:30',
    date: '2026-09-03',
    status: 'completed',
    color: '#F472B6',
    notes: 'Dolor en zona lumbar. Presión media.'
  },
  {
    id: 'apt-106',
    staffId: 'staff-4', // Amy Jones
    clientName: 'Megan White',
    clientPhone: '+1 (305) 555-3344',
    clientEmail: 'megan.w@gmail.com',
    serviceName: 'Russian Manicure + Gel',
    serviceCategory: 'Manicura',
    price: 60,
    startTime: '09:00',
    endTime: '10:00',
    date: '2026-09-03',
    status: 'confirmed',
    color: '#FB923C',
    notes: 'Diseño minimalista francés en puntas.'
  },
  {
    id: 'apt-107',
    staffId: 'staff-4',
    clientName: 'Lucy Evans',
    clientPhone: '+1 (305) 555-8822',
    clientEmail: 'lucy.e@gmail.com',
    serviceName: 'Gel-X Extensions',
    serviceCategory: 'Uñas Esculpidas',
    price: 95,
    startTime: '10:15',
    endTime: '11:45',
    date: '2026-09-03',
    status: 'in_progress',
    color: '#FB923C',
    notes: 'Largo medio almendrado.'
  },
  {
    id: 'apt-108',
    staffId: 'staff-5', // Michael Vance
    clientName: 'Zain Dias',
    clientPhone: '+1 (305) 555-1100',
    clientEmail: 'zain.d@gmail.com',
    serviceName: 'Corte + Barba Express',
    serviceCategory: 'Combos',
    price: 55,
    startTime: '11:00',
    endTime: '11:50',
    date: '2026-09-03',
    status: 'confirmed',
    color: '#38BDF8',
    notes: 'Cliente nuevo.'
  }
];

export const INITIAL_CLIENTS_CRM = [
  {
    id: 'cli-1',
    name: 'Derrick Johnson',
    phone: '+1 (305) 555-0192',
    email: 'derrick.j@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    totalVisits: 14,
    totalRescheduled: 1,
    totalCancelled: 0,
    totalSpent: 840,
    lastVisit: '2026-08-20',
    favoriteStaff: 'John Templeton',
    tags: ['VIP', 'Puntual', 'Propina Generosa'],
    notes: 'Le gusta café expreso doble al llegar. Corte fade #1 en laterales.'
  },
  {
    id: 'cli-2',
    name: 'Alena Geidt',
    phone: '+1 (212) 555-9011',
    email: 'alena.g@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    totalVisits: 8,
    totalRescheduled: 2,
    totalCancelled: 1,
    totalSpent: 1680,
    lastVisit: '2026-07-15',
    favoriteStaff: 'Maria Santos',
    tags: ['Coloración', 'Tratamientos'],
    notes: 'Sensible al cuero cabelludo, usar decolorante sin amoníaco.'
  },
  {
    id: 'cli-3',
    name: 'Brenda Massey',
    phone: '+1 (212) 555-7734',
    email: 'brenda.m@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    totalVisits: 19,
    totalRescheduled: 0,
    totalCancelled: 0,
    totalSpent: 1450,
    lastVisit: '2026-08-28',
    favoriteStaff: 'Maria Santos',
    tags: ['Semanal', 'Blowout'],
    notes: 'Cita fija los viernes por la mañana.'
  },
  {
    id: 'cli-4',
    name: 'Diego Ramirez',
    phone: '+1 (786) 555-4422',
    email: 'diego.ramirez@mail.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    totalVisits: 12,
    totalRescheduled: 2,
    totalCancelled: 1,
    totalSpent: 590,
    lastVisit: '2026-08-14',
    favoriteStaff: 'John Templeton',
    tags: ['Fiel', 'App User'],
    notes: 'Reserva siempre mediante Styluu App móvil.'
  }
];

export const BUSINESS_STATS = {
  todayRevenue: 1845,
  yesterdayRevenue: 1620,
  growthPercentage: 13.8,
  todayAppointments: 16,
  completedAppointments: 7,
  occupancyRate: 88,
  newClientsThisWeek: 24,
  averageTicket: 68.50,
  topService: 'Corte + Barba VIP (42%)'
};

export const INITIAL_RETAIL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'After Shave Loción Refrescante Mentol & Eucalipto',
    brand: 'Styluu Lab USA',
    category: 'Afeitado',
    price: 24,
    costPrice: 9,
    stock: 28,
    sku: 'STY-AFT-01',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80',
    description: 'Cierra los poros, alivia la irritación tras el afeitado y proporciona una sensación glacial inmediata.'
  },
  {
    id: 'prod-2',
    name: 'Pomada Fijadora Mate Fuerte (Matte Clay Pomade)',
    brand: 'Styluu Barber Pro',
    category: 'Fijación & Geles',
    price: 22,
    costPrice: 8,
    stock: 45,
    sku: 'STY-POM-02',
    image: 'https://images.unsplash.com/photo-1597854710119-a5a843967337?auto=format&fit=crop&w=600&q=80',
    description: 'Fijación de alta duración todo el día sin brillo artificial ni residuos. Ideal para peinados modernos.'
  },
  {
    id: 'prod-3',
    name: 'Talco Barbero Clásico Micro-Filtrado Antiséptico',
    brand: 'Styluu Heritage',
    category: 'Talcos & Barber',
    price: 16,
    costPrice: 5,
    stock: 35,
    sku: 'STY-TALC-03',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'Absorbe la humedad al instante, calma la piel tras la máquina y deja el aroma tradicional de barbería.'
  },
  {
    id: 'prod-4',
    name: 'Shampoo Anticaída & Fortalecedor con Biotina y Cafeína',
    brand: 'Styluu Hair Care',
    category: 'Shampoo & Cuidado',
    price: 28,
    costPrice: 11,
    stock: 19,
    sku: 'STY-SHAMP-04',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    description: 'Estimula los folículos capilares, engrosa el cabello fino y limpia profundamente sin resecar.'
  },
  {
    id: 'prod-5',
    name: 'Aceite de Barba Premium con Sándalo y Aceite de Argán',
    brand: 'Styluu Gentleman',
    category: 'Shampoo & Cuidado',
    price: 20,
    costPrice: 7,
    stock: 40,
    sku: 'STY-OIL-05',
    image: 'https://images.unsplash.com/photo-1608248597358-1e43493d2cb2?auto=format&fit=crop&w=600&q=80',
    description: 'Hidrata el vello facial, elimina el picor y aporta brillo natural con aroma amaderado sofisticado.'
  },
  {
    id: 'prod-6',
    name: 'Mascarilla Reparadora Capilar Keratina & Botox Complex',
    brand: 'Styluu Salon Pro',
    category: 'Tratamientos',
    price: 36,
    costPrice: 14,
    stock: 14,
    sku: 'STY-MASK-06',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: 'Tratamiento intensivo para sellar cutículas, eliminar el frizz y restaurar cabellos procesados o teñidos.'
  }
];

export const SUPPORTED_COUNTRIES_CURRENCIES = {
  US: {
    countryId: 'US',
    countryName: 'Estados Unidos',
    currencyCode: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    currencyName: 'Dólar Estadounidense (USD)',
    rateMultiplier: 1,
    displayFormat: '$',
    locale: 'en-US'
  },
  MX: {
    countryId: 'MX',
    countryName: 'México',
    currencyCode: 'MXN',
    currencySymbol: '$',
    flag: '🇲🇽',
    currencyName: 'Peso Mexicano (MXN)',
    rateMultiplier: 18,
    displayFormat: '$',
    locale: 'es-MX'
  },
  CO: {
    countryId: 'CO',
    countryName: 'Colombia',
    currencyCode: 'COP',
    currencySymbol: '$',
    flag: '🇨🇴',
    currencyName: 'Peso Colombiano (COP)',
    rateMultiplier: 4200,
    displayFormat: '$',
    locale: 'es-CO'
  },
  ES: {
    countryId: 'ES',
    countryName: 'España / Europa',
    currencyCode: 'EUR',
    currencySymbol: '€',
    flag: '🇪🇸',
    currencyName: 'Euro (EUR)',
    rateMultiplier: 0.92,
    displayFormat: '€',
    locale: 'es-ES'
  },
  DO: {
    countryId: 'DO',
    countryName: 'República Dominicana',
    currencyCode: 'DOP',
    currencySymbol: 'RD$',
    flag: '🇩🇴',
    currencyName: 'Peso Dominicano (DOP)',
    rateMultiplier: 60,
    displayFormat: 'RD$',
    locale: 'es-DO'
  },
  CL: {
    countryId: 'CL',
    countryName: 'Chile',
    currencyCode: 'CLP',
    currencySymbol: '$',
    flag: '🇨🇱',
    currencyName: 'Peso Chileno (CLP)',
    rateMultiplier: 940,
    displayFormat: '$',
    locale: 'es-CL'
  },
  PE: {
    countryId: 'PE',
    countryName: 'Perú',
    currencyCode: 'PEN',
    currencySymbol: 'S/',
    flag: '🇵🇪',
    currencyName: 'Sol Peruano (PEN)',
    rateMultiplier: 3.75,
    displayFormat: 'S/',
    locale: 'es-PE'
  },
  AR: {
    countryId: 'AR',
    countryName: 'Argentina',
    currencyCode: 'ARS',
    currencySymbol: '$',
    flag: '🇦🇷',
    currencyName: 'Peso Argentino (ARS)',
    rateMultiplier: 960,
    displayFormat: '$',
    locale: 'es-AR'
  }
};

