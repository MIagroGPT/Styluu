import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  VENUES, 
  STAFF_MEMBERS, 
  INITIAL_CALENDAR_APPOINTMENTS, 
  INITIAL_CLIENTS_CRM, 
  BUSINESS_STATS, 
  INITIAL_RETAIL_PRODUCTS,
  SUPPORTED_COUNTRIES_CURRENCIES
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current View: 'landing' | 'explore' | 'venue-detail' | 'my-bookings' | 'business-os'
  const [currentView, setCurrentView] = useState(() => {
    try {
      return localStorage.getItem('styluu_view') || 'landing';
    } catch {
      return 'landing';
    }
  });

  // Country & Multi-Currency Settings (US: USD, MX: MXN, CO: COP, ES: EUR, etc.)
  const [selectedCountry, setSelectedCountry] = useState(() => {
    try {
      return localStorage.getItem('styluu_country') || 'US';
    } catch {
      return 'US';
    }
  });

  const currentCurrency = (SUPPORTED_COUNTRIES_CURRENCIES && SUPPORTED_COUNTRIES_CURRENCIES[selectedCountry]) 
    || (SUPPORTED_COUNTRIES_CURRENCIES && SUPPORTED_COUNTRIES_CURRENCIES.US)
    || {
      countryId: 'US',
      countryName: 'Estados Unidos',
      currencyCode: 'USD',
      currencySymbol: '$',
      flag: '🇺🇸',
      currencyName: 'Dólar Estadounidense (USD)',
      rateMultiplier: 1,
      displayFormat: '$',
      locale: 'en-US'
    };

  // Business OS Subtab: 'calendar' | 'appointments' | 'clients' | 'services' | 'team' | 'pos' | 'analytics'
  const [businessTab, setBusinessTab] = useState('calendar');

  // Selected Venue for Detail or Booking
  const [selectedVenue, setSelectedVenue] = useState(VENUES[0]);

  // Search Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Retail Products Inventory State
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_retail_products');
      return saved ? JSON.parse(saved) : INITIAL_RETAIL_PRODUCTS;
    } catch {
      return INITIAL_RETAIL_PRODUCTS;
    }
  });

  // Client Shopping Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calendar Appointments State
  const [calendarAppointments, setCalendarAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_cal_appointments');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_CALENDAR_APPOINTMENTS;
    } catch {
      return INITIAL_CALENDAR_APPOINTMENTS;
    }
  });

  // Client's Bookings (Consumer side)
  const [clientBookings, setClientBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_client_bookings');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [
        {
          id: 'book-sample-1',
          venueId: 'venue-1',
          venueName: 'The Hustle Barber & Lounge',
          venueAddress: '840 Brickell Ave, Miami, FL',
          serviceName: 'Corte + Barba VIP',
          staffName: 'John Templeton',
          staffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          date: '2026-09-05',
          time: '10:00 AM',
          price: 70,
          status: 'confirmed',
          bookingCode: 'STY-8492-VIP'
        }
      ];
    } catch {
      return [
        {
          id: 'book-sample-1',
          venueId: 'venue-1',
          venueName: 'The Hustle Barber & Lounge',
          venueAddress: '840 Brickell Ave, Miami, FL',
          serviceName: 'Corte + Barba VIP',
          staffName: 'John Templeton',
          staffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          date: '2026-09-05',
          time: '10:00 AM',
          price: 70,
          status: 'confirmed',
          bookingCode: 'STY-8492-VIP'
        }
      ];
    }
  });

  // CRM Clients
  const [clientsCRM, setClientsCRM] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_crm_clients');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_CLIENTS_CRM;
    } catch {
      return INITIAL_CLIENTS_CRM;
    }
  });

  // Staff & Venues
  const [venues, setVenues] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_venues');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : VENUES;
    } catch {
      return VENUES;
    }
  });

  const [staffMembers, setStaffMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_staff_members');
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(s => ({
          ...s,
          commissionRate: typeof s.commissionRate === 'number' ? s.commissionRate : 50
        }));
      }
      return STAFF_MEMBERS;
    } catch {
      return STAFF_MEMBERS;
    }
  });

  // Booking Modal Flow State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingVenue, setBookingVenue] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('styluu_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('styluu_venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem('styluu_staff_members', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('styluu_cal_appointments', JSON.stringify(calendarAppointments));
  }, [calendarAppointments]);

  useEffect(() => {
    localStorage.setItem('styluu_client_bookings', JSON.stringify(clientBookings));
  }, [clientBookings]);

  useEffect(() => {
    localStorage.setItem('styluu_crm_clients', JSON.stringify(clientsCRM));
  }, [clientsCRM]);

  const updateStaffCommission = (staffId, newRate) => {
    const rateNum = Math.min(100, Math.max(0, Math.round(Number(newRate) || 0)));
    setStaffMembers(prev => prev.map(s => s.id === staffId ? { ...s, commissionRate: rateNum } : s));
    showToast(`Comisión actualizada a ${rateNum}% para el especialista`, 'success');
  };

  const addStaffMember = (staffData) => {
    const newStaff = {
      id: `staff-${Date.now()}`,
      name: staffData.name || 'Nuevo Especialista',
      role: staffData.role || 'Master Barber & Stylist',
      rating: 5.0,
      reviewsCount: 0,
      avatar: staffData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      color: staffData.color || '#6045F4',
      commissionRate: typeof staffData.commissionRate === 'number' ? staffData.commissionRate : 50,
      specialties: Array.isArray(staffData.specialties) ? staffData.specialties : ['Corte Clásico', 'Diseño de Barba'],
      schedule: staffData.schedule || {
        startHour: staffData.startHour || '09:00',
        endHour: staffData.endHour || '19:00',
        workDays: staffData.workDays || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      }
    };
    setStaffMembers(prev => [...prev, newStaff]);
    showToast(`¡Especialista ${newStaff.name} añadido exitosamente al equipo!`, 'success');
    return newStaff;
  };

  const updateStaffSchedule = (staffId, scheduleData) => {
    setStaffMembers(prev => prev.map(s => {
      if (s.id === staffId) {
        const updatedSchedule = {
          ...(s.schedule || {
            startHour: '09:00',
            endHour: '19:00',
            workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
          }),
          ...scheduleData
        };
        return { ...s, schedule: updatedSchedule };
      }
      return s;
    }));
    showToast('Horario de trabajo actualizado correctamente', 'success');
  };

  const deleteStaffMember = (staffId) => {
    setStaffMembers(prev => prev.filter(s => s.id !== staffId));
    showToast('Especialista eliminado del equipo', 'info');
  };

  // Get active venue's master operating hours (with full per-day schedule support)
  const activeVenue = (venues && venues[0]) || VENUES[0];

  const getVenueOperatingHours = (v = activeVenue, specificDayOrDate = null) => {
    const rawDaily = v?.dailySchedule || {};
    
    // Standard 7-day schedule map with smart defaults
    const dailySchedule = {
      'Lunes':     rawDaily['Lunes']     || { isOpen: true,  openingHour: v?.openingHour || '09:00', closingHour: v?.closingHour || '20:00' },
      'Martes':    rawDaily['Martes']    || { isOpen: true,  openingHour: v?.openingHour || '09:00', closingHour: v?.closingHour || '20:00' },
      'Miércoles': rawDaily['Miércoles'] || { isOpen: true,  openingHour: v?.openingHour || '09:00', closingHour: v?.closingHour || '20:00' },
      'Jueves':    rawDaily['Jueves']    || { isOpen: true,  openingHour: v?.openingHour || '09:00', closingHour: v?.closingHour || '20:00' },
      'Viernes':   rawDaily['Viernes']   || { isOpen: true,  openingHour: v?.openingHour || '09:00', closingHour: v?.closingHour || '20:00' },
      'Sábado':    rawDaily['Sábado']    || { isOpen: true,  openingHour: '10:00', closingHour: '18:00' },
      'Domingo':   rawDaily['Domingo']   || { isOpen: false, openingHour: '10:00', closingHour: '14:00' }
    };

    const openDaysList = Object.keys(dailySchedule).filter(day => dailySchedule[day]?.isOpen);

    // If a specific day of the week or date string YYYY-MM-DD is requested
    if (specificDayOrDate) {
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      let targetDay = specificDayOrDate;
      if (typeof specificDayOrDate === 'string' && specificDayOrDate.includes('-')) {
        const parts = specificDayOrDate.split('-').map(Number);
        if (parts.length >= 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          targetDay = dayNames[d.getDay()];
        }
      } else if (specificDayOrDate instanceof Date) {
        targetDay = dayNames[specificDayOrDate.getDay()];
      }

      const dayConfig = dailySchedule[targetDay] || { isOpen: false, openingHour: '09:00', closingHour: '20:00' };

      return {
        targetDay,
        isOpen: Boolean(dayConfig.isOpen),
        openingHour: dayConfig.openingHour || '09:00',
        closingHour: dayConfig.closingHour || '20:00',
        openDays: openDaysList,
        dailySchedule,
        formatted: dayConfig.isOpen ? `${dayConfig.openingHour} - ${dayConfig.closingHour}` : 'Cerrado'
      };
    }

    // Overall summary across open days
    const openConfigs = Object.values(dailySchedule).filter(d => d.isOpen);
    const minOpening = openConfigs.length > 0 
      ? openConfigs.reduce((min, d) => d.openingHour < min ? d.openingHour : min, '23:59')
      : '09:00';
    const maxClosing = openConfigs.length > 0
      ? openConfigs.reduce((max, d) => d.closingHour > max ? d.closingHour : max, '00:00')
      : '20:00';

    return {
      openingHour: minOpening,
      closingHour: maxClosing,
      openDays: openDaysList,
      dailySchedule,
      formatted: `${minOpening} - ${maxClosing}`
    };
  };

  const storeOperatingHours = getVenueOperatingHours();

  // Helper to generate time slots dynamically for a specific day or default day
  const getStoreTimeSlots = (stepMinutes = 30, specificDayOrDate = null) => {
    const dayHours = getVenueOperatingHours(activeVenue, specificDayOrDate);
    
    // If querying a specific date/day and the salon is closed that day, return empty
    if (specificDayOrDate && !dayHours.isOpen) {
      return [];
    }

    const [startH, startM] = (dayHours.openingHour || '09:00').split(':').map(Number);
    const [endH, endM] = (dayHours.closingHour || '20:00').split(':').map(Number);
    const slots = [];
    
    let curMin = startH * 60 + (startM || 0);
    const endMin = endH * 60 + (endM || 0);
    
    while (curMin < endMin) {
      const h = Math.floor(curMin / 60);
      const m = curMin % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      curMin += stepMinutes;
    }
    return slots.length > 0 ? slots : ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
  };

  // Update Master Venue Operating Hours & Cascade clamp to Staff
  const updateVenueOperatingHours = (venueId, dailyScheduleOrOpenH, closingHour, openDays, formattedHoursString) => {
    const targetVenueId = venueId || activeVenue.id;
    let newDailySchedule = {};
    let newOpenDays = [];
    let overallOpening = '09:00';
    let overallClosing = '20:00';

    if (typeof dailyScheduleOrOpenH === 'object' && dailyScheduleOrOpenH !== null) {
      newDailySchedule = dailyScheduleOrOpenH;
      newOpenDays = Object.keys(newDailySchedule).filter(d => newDailySchedule[d]?.isOpen);
      const openConfigs = Object.values(newDailySchedule).filter(d => d?.isOpen);
      overallOpening = openConfigs.length > 0 ? openConfigs.reduce((min, d) => d.openingHour < min ? d.openingHour : min, '23:59') : '09:00';
      overallClosing = openConfigs.length > 0 ? openConfigs.reduce((max, d) => d.closingHour > max ? d.closingHour : max, '00:00') : '20:00';
    } else {
      overallOpening = dailyScheduleOrOpenH || '09:00';
      overallClosing = closingHour || '20:00';
      newOpenDays = openDays || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].forEach(day => {
        newDailySchedule[day] = {
          isOpen: newOpenDays.includes(day),
          openingHour: overallOpening,
          closingHour: day === 'Sábado' ? '18:00' : (day === 'Domingo' ? '14:00' : overallClosing)
        };
      });
    }

    // 1. Update Venue in State & LocalStorage
    const updatedVenues = venues.map(v => {
      if (v.id === targetVenueId) {
        return {
          ...v,
          dailySchedule: newDailySchedule,
          openingHour: overallOpening,
          closingHour: overallClosing,
          openDays: newOpenDays,
          hours: formattedHoursString || `${overallOpening} - ${overallClosing}`
        };
      }
      return v;
    });

    setVenues(updatedVenues);
    localStorage.setItem('styluu_venues', JSON.stringify(updatedVenues));

    // 2. Cascade clamp to staff members whose hours fall outside the new store hours
    setStaffMembers(prevStaff => {
      const updated = prevStaff.map(staff => {
        const staffSch = staff.schedule || { 
          startHour: '09:00', 
          endHour: '19:00', 
          workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] 
        };
        
        let startH = staffSch.startHour || '09:00';
        let endH = staffSch.endHour || '19:00';

        // Clamp start to not be before store opening
        if (startH < overallOpening) startH = overallOpening;
        if (startH >= overallClosing) startH = overallOpening;

        // Clamp end to not be after store closing
        if (endH > overallClosing) endH = overallClosing;
        if (endH <= startH) endH = overallClosing;

        // Filter work days to only those the store is open
        const validStaffDays = (staffSch.workDays || []).filter(d => newOpenDays.includes(d));

        return {
          ...staff,
          schedule: {
            startHour: startH,
            endHour: endH,
            workDays: validStaffDays.length > 0 ? validStaffDays : newOpenDays
          }
        };
      });
      localStorage.setItem('styluu_staff_members', JSON.stringify(updated));
      return updated;
    });

    showToast('¡Horarios configurados día a día y sincronizados con el equipo con éxito!', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const openBookingModal = (venue) => {
    setBookingVenue(venue || selectedVenue || VENUES[0]);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setConfirmedBookingData(null);
  };

  // Add new customer appointment (syncs with both client bookings and business calendar)
  const addAppointment = (newBooking) => {
    // 1. Add to client's bookings
    const clientEntry = {
      id: `book-${Date.now()}`,
      venueId: newBooking.venue.id,
      venueName: newBooking.venue.name,
      venueAddress: newBooking.venue.address,
      serviceName: newBooking.services.map(s => s.name).join(', '),
      staffName: newBooking.staff ? newBooking.staff.name : 'Cualquier Especialista',
      staffAvatar: newBooking.staff ? newBooking.staff.avatar : null,
      date: newBooking.date,
      time: newBooking.timeSlot,
      price: newBooking.totalPrice,
      status: 'confirmed',
      bookingCode: `STY-${Math.floor(1000 + Math.random() * 9000)}-${newBooking.venue.category.toUpperCase().slice(0, 3)}`,
      clientName: newBooking.clientName,
      clientPhone: newBooking.clientPhone,
      clientEmail: newBooking.clientEmail
    };

    setClientBookings(prev => [clientEntry, ...prev]);

    // 2. Add to Business OS multi-staff calendar
    const assignedStaffId = newBooking.staff ? newBooking.staff.id : 'staff-1';
    
    // Normalize time to HH:mm (e.g., '10:00 AM' -> '10:00', '02:00 PM' -> '14:00')
    let startTimeFormatted = newBooking.timeSlot || '09:00';
    if (startTimeFormatted.includes('PM') && !startTimeFormatted.startsWith('12')) {
      const parts = startTimeFormatted.split(':');
      const hour = parseInt(parts[0], 10) + 12;
      const minute = parts[1].slice(0, 2);
      startTimeFormatted = `${String(hour).padStart(2, '0')}:${minute}`;
    } else if (startTimeFormatted.includes('AM') && startTimeFormatted.startsWith('12')) {
      const minute = startTimeFormatted.split(':')[1].slice(0, 2);
      startTimeFormatted = `00:${minute}`;
    } else if (startTimeFormatted.includes('AM') || startTimeFormatted.includes('PM')) {
      startTimeFormatted = startTimeFormatted.slice(0, 5).trim();
    }

    const calEntry = {
      id: `apt-${Date.now()}`,
      bookingId: clientEntry.id,
      staffId: assignedStaffId,
      clientName: newBooking.clientName,
      clientPhone: newBooking.clientPhone,
      clientEmail: newBooking.clientEmail,
      serviceName: newBooking.services.map(s => s.name).join(' + '),
      serviceCategory: newBooking.services[0]?.category || 'General',
      price: newBooking.totalPrice,
      startTime: startTimeFormatted,
      endTime: '11:00',
      date: newBooking.date,
      status: 'confirmed',
      color: newBooking.staff?.color || '#6045F4',
      notes: 'Reserva web confirmada automáticamente.'
    };

    setCalendarAppointments(prev => [...prev, calEntry]);

    // 3. Upsert into CRM
    setClientsCRM(prev => {
      const exists = prev.find(c => c.email.toLowerCase() === newBooking.clientEmail.toLowerCase());
      if (exists) {
        return prev.map(c => c.id === exists.id ? {
          ...c,
          totalVisits: c.totalVisits + 1,
          totalSpent: c.totalSpent + newBooking.totalPrice,
          lastVisit: newBooking.date
        } : c);
      } else {
        return [
          {
            id: `cli-${Date.now()}`,
            name: newBooking.clientName,
            phone: newBooking.clientPhone,
            email: newBooking.clientEmail,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            totalVisits: 1,
            totalSpent: newBooking.totalPrice,
            lastVisit: newBooking.date,
            favoriteStaff: newBooking.staff?.name || 'Staff Styluu',
            tags: ['Nuevo Cliente', 'Web Booking'],
            notes: 'Primera reserva a través de Styluu.'
          },
          ...prev
        ];
      }
    });

    setConfirmedBookingData(clientEntry);
    showToast('¡Cita confirmada con éxito!', 'success');
  };

  const updateAppointmentStatus = (aptId, newStatus) => {
    setCalendarAppointments(prev => prev.map(apt => apt.id === aptId ? { ...apt, status: newStatus } : apt));
    showToast(`Estado de cita actualizado a: ${newStatus}`, 'info');
  };

  const clearCalendarAppointments = () => {
    setCalendarAppointments([]);
    showToast('Agenda limpiada: 0 citas activas', 'info');
  };

  const resetCalendarAppointments = () => {
    setCalendarAppointments(INITIAL_CALENDAR_APPOINTMENTS);
    showToast('Citas demo restablecidas correctamente', 'success');
  };

  const deleteAppointment = (aptId) => {
    setCalendarAppointments(prev => prev.filter(apt => apt.id !== aptId));
    showToast('Cita eliminada de la agenda', 'info');
  };

  const cancelClientBookingWithReason = (bookingId, reason = 'Cancelada por el cliente') => {
    let clientEmail = null;
    let clientName = null;

    setClientBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        clientEmail = b.clientEmail;
        clientName = b.clientName;
        return { 
          ...b, 
          status: 'cancelled', 
          cancellationReason: reason,
          cancelledAt: new Date().toISOString()
        };
      }
      return b;
    }));

    setCalendarAppointments(prev => prev.map(apt => {
      if (apt.bookingId === bookingId || apt.id === bookingId) {
        clientEmail = clientEmail || apt.clientEmail;
        clientName = clientName || apt.clientName;
        return { 
          ...apt, 
          status: 'cancelled', 
          cancellationReason: reason,
          notes: apt.notes ? `${apt.notes} | Cancelación: ${reason}` : `Cancelación: ${reason}`
        };
      }
      return apt;
    }));

    // Increment CRM totalCancelled
    setClientsCRM(prev => prev.map(c => {
      if ((clientEmail && c.email?.toLowerCase() === clientEmail?.toLowerCase()) || 
          (clientName && c.name?.toLowerCase() === clientName?.toLowerCase())) {
        return {
          ...c,
          totalCancelled: (c.totalCancelled || 0) + 1
        };
      }
      return c;
    }));

    showToast('Cita cancelada con éxito. Motivo registrado en el sistema.', 'warning');
  };

  const cancelClientBooking = (bookingId) => {
    cancelClientBookingWithReason(bookingId, 'Cancelación solicitada por el cliente');
  };

  const rescheduleClientBooking = (bookingId, newDate, newTime, reason = 'Reagendamiento solicitado') => {
    let clientEmail = null;
    let clientName = null;

    // Normalize time format to HH:mm
    let formattedTime = newTime || '10:00';
    if (formattedTime.includes('PM') && !formattedTime.startsWith('12')) {
      const parts = formattedTime.split(':');
      const hour = parseInt(parts[0], 10) + 12;
      const minute = parts[1].slice(0, 2);
      formattedTime = `${String(hour).padStart(2, '0')}:${minute}`;
    } else if (formattedTime.includes('AM') && formattedTime.startsWith('12')) {
      const minute = formattedTime.split(':')[1].slice(0, 2);
      formattedTime = `00:${minute}`;
    } else if (formattedTime.includes('AM') || formattedTime.includes('PM')) {
      formattedTime = formattedTime.slice(0, 5).trim();
    }

    setClientBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        clientEmail = b.clientEmail;
        clientName = b.clientName;
        return {
          ...b,
          date: newDate,
          time: newTime,
          rescheduleReason: reason,
          status: 'confirmed',
          rescheduledAt: new Date().toISOString()
        };
      }
      return b;
    }));

    setCalendarAppointments(prev => prev.map(apt => {
      if (apt.bookingId === bookingId || apt.id === bookingId) {
        clientEmail = clientEmail || apt.clientEmail;
        clientName = clientName || apt.clientName;
        return {
          ...apt,
          date: newDate,
          startTime: formattedTime,
          status: 'confirmed',
          rescheduleReason: reason,
          notes: apt.notes ? `${apt.notes} | Reagendada: ${reason}` : `Reagendada: ${reason}`
        };
      }
      return apt;
    }));

    // Increment CRM totalRescheduled
    setClientsCRM(prev => prev.map(c => {
      if ((clientEmail && c.email?.toLowerCase() === clientEmail?.toLowerCase()) || 
          (clientName && c.name?.toLowerCase() === clientName?.toLowerCase())) {
        return {
          ...c,
          totalRescheduled: (c.totalRescheduled || 0) + 1
        };
      }
      return c;
    }));

    showToast(`¡Cita reagendada con éxito para el ${newDate} a las ${newTime}!`, 'success');
  };

  // Real Sales & POS Transactions (Starts at 0 for real simulation)
  const [salesTransactions, setSalesTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_sales_transactions');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Payroll Settlements History
  const [payrollSettlements, setPayrollSettlements] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_payroll_settlements');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('styluu_sales_transactions', JSON.stringify(salesTransactions));
  }, [salesTransactions]);

  useEffect(() => {
    localStorage.setItem('styluu_payroll_settlements', JSON.stringify(payrollSettlements));
  }, [payrollSettlements]);

  const recordSaleTransaction = (saleData) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      timestamp: Date.now(),
      date: saleData.date || new Date().toISOString().split('T')[0],
      time: saleData.time || '10:00',
      staffId: saleData.staffId || 'staff-1',
      staffName: saleData.staffName || 'John Templeton',
      clientName: saleData.clientName || 'Cliente Walk-in',
      serviceName: saleData.serviceName || 'Servicio',
      servicePrice: Number(saleData.servicePrice) || 0,
      productsTotal: Number(saleData.productsTotal) || 0,
      tipAmount: Number(saleData.tipAmount) || 0,
      taxAmount: Number(saleData.taxAmount) || 0,
      totalAmount: Number(saleData.totalAmount) || 0,
      paymentMethod: saleData.paymentMethod || 'card',
      items: saleData.items || [],
      settled: Boolean(saleData.settled),
      payoutStatus: saleData.settled ? 'paid' : 'pending'
    };

    setSalesTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const settlePayrollPeriod = (settlementData) => {
    const settlementId = `settle-${Date.now()}`;
    const newSettlement = {
      id: settlementId,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...settlementData,
      status: 'paid'
    };

    const targetTxIds = new Set(settlementData.transactionIds || []);

    // Mark sales transactions as paid/settled
    setSalesTransactions(prev => prev.map(tx => {
      if (targetTxIds.has(tx.id)) {
        return {
          ...tx,
          settled: true,
          settledAt: new Date().toISOString(),
          payoutStatus: 'paid',
          settlementId
        };
      }
      return tx;
    }));

    // Update matching calendar appointments
    setCalendarAppointments(prev => prev.map(apt => {
      if (targetTxIds.has(apt.id) || (apt.staffId === settlementData.staffId && apt.date >= (settlementData.startDate || '1970') && apt.date <= (settlementData.endDate || '2099'))) {
        return {
          ...apt,
          commissionSettled: true,
          commissionSettledAt: new Date().toISOString()
        };
      }
      return apt;
    }));

    setPayrollSettlements(prev => [newSettlement, ...prev]);
    showToast(`Período liquidado con éxito. Estado: PAGADA (${settlementData.periodLabel || 'Período'})`, 'success');
  };

  const toggleTicketSettled = (txId) => {
    let newStatus = 'paid';
    setSalesTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        const nextSettled = !tx.settled;
        newStatus = nextSettled ? 'paid' : 'pending';
        return {
          ...tx,
          settled: nextSettled,
          settledAt: nextSettled ? new Date().toISOString() : null,
          payoutStatus: nextSettled ? 'paid' : 'pending'
        };
      }
      return tx;
    }));
    showToast(`Ticket marcado como ${newStatus === 'paid' ? 'PAGADA' : 'PENDIENTE'}`, 'info');
  };

  const clearSalesTransactions = () => {
    setSalesTransactions([]);
    setPayrollSettlements([]);
    showToast('Historial de ventas y liquidaciones reseteadas a $0', 'info');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`"${product.name}" añadido a tu bolsa de compra`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  useEffect(() => {
    localStorage.setItem('styluu_retail_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('styluu_country', selectedCountry);
  }, [selectedCountry]);

  const setBusinessCountry = (countryCode) => {
    if (SUPPORTED_COUNTRIES_CURRENCIES[countryCode]) {
      setSelectedCountry(countryCode);
      const curr = SUPPORTED_COUNTRIES_CURRENCIES[countryCode];
      showToast(`Moneda configurada: ${curr.currencyName} (${curr.flag})`, 'success');
    }
  };

  const formatMoney = (amountInUSD, showCode = true) => {
    if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) return '$0';
    
    const rate = currentCurrency.rateMultiplier || 1;
    const converted = Number(amountInUSD) * rate;
    
    let formattedNumber;
    if (currentCurrency.currencyCode === 'COP' || currentCurrency.currencyCode === 'CLP' || currentCurrency.currencyCode === 'ARS') {
      formattedNumber = Math.round(converted).toLocaleString('es-CO');
    } else if (currentCurrency.currencyCode === 'EUR') {
      formattedNumber = converted % 1 === 0 ? Math.round(converted).toLocaleString('es-ES') : converted.toFixed(2);
    } else {
      formattedNumber = converted % 1 === 0 ? Math.round(converted).toLocaleString('en-US') : converted.toFixed(2);
    }

    const symbol = currentCurrency.currencySymbol || '$';
    const code = showCode ? ` ${currentCurrency.currencyCode}` : '';
    
    if (currentCurrency.currencyCode === 'EUR') {
      return `${formattedNumber} ${symbol}${code ? ` (${currentCurrency.currencyCode})` : ''}`;
    }
    
    return `${symbol}${formattedNumber}${code}`;
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      businessTab,
      setBusinessTab,
      selectedCountry,
      setSelectedCountry,
      setBusinessCountry,
      currentCurrency,
      currencies: SUPPORTED_COUNTRIES_CURRENCIES,
      formatMoney,
      selectedVenue,
      setSelectedVenue,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedLocation,
      setSelectedLocation,
      calendarAppointments,
      setCalendarAppointments,
      clientBookings,
      setClientBookings,
      clientsCRM,
      setClientsCRM,
      venues,
      setVenues,
      getVenueOperatingHours,
      getStoreTimeSlots,
      updateVenueOperatingHours,
      staffMembers,
      setStaffMembers,
      updateStaffCommission,
      addStaffMember,
      updateStaffSchedule,
      deleteStaffMember,
      products,
      setProducts,
      cart,
      addToCart,
      removeFromCart,
      isBookingModalOpen,
      openBookingModal,
      closeBookingModal,
      bookingVenue,
      confirmedBookingData,
      addAppointment,
      updateAppointmentStatus,
      clearCalendarAppointments,
      resetCalendarAppointments,
      deleteAppointment,
      cancelClientBooking,
      cancelClientBookingWithReason,
      rescheduleClientBooking,
      salesTransactions,
      recordSaleTransaction,
      clearSalesTransactions,
      payrollSettlements,
      settlePayrollPeriod,
      toggleTicketSettled,
      toast,
      showToast,
      businessStats: BUSINESS_STATS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
