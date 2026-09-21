import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  VENUES,
  STAFF_MEMBERS,
  INITIAL_CALENDAR_APPOINTMENTS,
  INITIAL_CLIENTS_CRM,
  BUSINESS_STATS,
  INITIAL_RETAIL_PRODUCTS,
  SUPPORTED_COUNTRIES_CURRENCIES
} from '../data/mockData';
import {
  venuesApi,
  staffApi,
  appointmentsApi,
  bookingsApi,
  clientsApi,
  transactionsApi,
  settlementsApi,
  productsApi,
} from '../lib/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── UI State (still local — no need to sync across devices) ─────────────
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('styluu_view');
      const valid = ['landing', 'explore', 'venue-detail', 'my-bookings', 'business-os'];
      return valid.includes(saved) ? saved : 'landing';
    } catch {
      return 'landing';
    }
  });
  const [businessTab, setBusinessTab] = useState(() => {
    try {
      const savedTab = localStorage.getItem('styluu_business_tab');
      const validTabs = ['calendar', 'venue-profile', 'products', 'pos', 'clients', 'services', 'team', 'commissions', 'analytics'];
      return validTabs.includes(savedTab) ? savedTab : 'calendar';
    } catch {
      return 'calendar';
    }
  });

  useEffect(() => {
    try { localStorage.setItem('styluu_business_tab', businessTab); } catch {}
  }, [businessTab]);

  const [selectedVenue, setSelectedVenue] = useState(VENUES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingVenue, setBookingVenue] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);

  // ── Country / Currency (local preference) ───────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState(() => {
    try { return localStorage.getItem('styluu_country') || 'CO'; } catch { return 'CO'; }
  });
  const currentCurrency = (SUPPORTED_COUNTRIES_CURRENCIES && SUPPORTED_COUNTRIES_CURRENCIES[selectedCountry])
    || (SUPPORTED_COUNTRIES_CURRENCIES && SUPPORTED_COUNTRIES_CURRENCIES.CO)
    || (SUPPORTED_COUNTRIES_CURRENCIES && SUPPORTED_COUNTRIES_CURRENCIES.US)
    || { countryId: 'CO', countryName: 'Colombia', currencyCode: 'COP', currencySymbol: '$', flag: '🇨🇴', currencyName: 'Peso Colombiano (COP)', rateMultiplier: 4200, displayFormat: '$', locale: 'es-CO' };

  // ── DB-synced data (initialized with mockData fallback to prevent undefined errors on first render) ──
  const [venues, setVenues] = useState(VENUES);
  const [staffMembers, setStaffMembers] = useState(STAFF_MEMBERS);
  const [calendarAppointments, setCalendarAppointments] = useState(INITIAL_CALENDAR_APPOINTMENTS);
  const [clientBookings, setClientBookings] = useState([]);
  const [clientsCRM, setClientsCRM] = useState(INITIAL_CLIENTS_CRM);
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [payrollSettlements, setPayrollSettlements] = useState([]);
  const [products, setProducts] = useState(INITIAL_RETAIL_PRODUCTS);

  // ── Loading / error states ────────────────────────────────────────────────
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Persist view so page reload returns to the same section
  useEffect(() => {
    try { localStorage.setItem('styluu_view', currentView); } catch {}
  }, [currentView]);

  // ── Initial data load from DB ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        const [
          venuesData,
          staffData,
          aptsData,
          bookingsData,
          clientsData,
          txData,
          settlementsData,
          productsData,
        ] = await Promise.all([
          venuesApi.list(),
          staffApi.list(),
          appointmentsApi.list(),
          bookingsApi.list(),
          clientsApi.list(),
          transactionsApi.list(),
          settlementsApi.list(),
          productsApi.list(),
        ]);

        if (cancelled) return;

        // If DB is empty (first run), seed with demo data
        if (!venuesData.length) {
          await venuesApi.bulkInsert(VENUES);
          const freshVenues = await venuesApi.list();
          setVenues(Array.isArray(freshVenues) && freshVenues.length ? freshVenues : VENUES);
        } else {
          setVenues(Array.isArray(venuesData) ? venuesData : VENUES);
        }

        if (!staffData.length) {
          await staffApi.bulkInsert(STAFF_MEMBERS);
          const freshStaff = await staffApi.list();
          setStaffMembers(Array.isArray(freshStaff) && freshStaff.length ? freshStaff : STAFF_MEMBERS);
        } else {
          setStaffMembers(Array.isArray(staffData) ? staffData : STAFF_MEMBERS);
        }

        if (!aptsData.length) {
          for (const apt of INITIAL_CALENDAR_APPOINTMENTS) {
            await appointmentsApi.create(apt).catch(() => {});
          }
          const freshApts = await appointmentsApi.list();
          setCalendarAppointments(Array.isArray(freshApts) ? freshApts : INITIAL_CALENDAR_APPOINTMENTS);
        } else {
          setCalendarAppointments(Array.isArray(aptsData) ? aptsData : INITIAL_CALENDAR_APPOINTMENTS);
        }

        if (!clientsData.length) {
          for (const c of INITIAL_CLIENTS_CRM) {
            await clientsApi.create(c).catch(() => {});
          }
          const freshClients = await clientsApi.list();
          setClientsCRM(Array.isArray(freshClients) ? freshClients : INITIAL_CLIENTS_CRM);
        } else {
          setClientsCRM(Array.isArray(clientsData) ? clientsData : INITIAL_CLIENTS_CRM);
        }

        if (!productsData.length) {
          await productsApi.bulkInsert(INITIAL_RETAIL_PRODUCTS);
          const freshProducts = await productsApi.list();
          setProducts(Array.isArray(freshProducts) ? freshProducts : INITIAL_RETAIL_PRODUCTS);
        } else {
          setProducts(Array.isArray(productsData) ? productsData : INITIAL_RETAIL_PRODUCTS);
        }

        setClientBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setSalesTransactions(Array.isArray(txData) ? txData : []);
        setPayrollSettlements(Array.isArray(settlementsData) ? settlementsData : []);
        setDbReady(true);
      } catch (err) {
        if (!cancelled) {
          console.error('Styluu DB load error:', err);
          setDbError(err.message);
          // Fallback to demo data so the app still works offline
          setVenues(VENUES);
          setStaffMembers(STAFF_MEMBERS);
          setCalendarAppointments(INITIAL_CALENDAR_APPOINTMENTS);
          setClientsCRM(INITIAL_CLIENTS_CRM);
          setProducts(INITIAL_RETAIL_PRODUCTS);
          setClientBookings([]);
          setSalesTransactions([]);
          setPayrollSettlements([]);
          setDbReady(true);
        }
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);

  // ── Currency preference ───────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('styluu_country', selectedCountry); } catch {}
  }, [selectedCountry]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  STAFF ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const updateStaffCommission = useCallback(async (staffId, newRate) => {
    const rateNum = Math.min(100, Math.max(0, Math.round(Number(newRate) || 0)));
    const member = staffMembers.find(s => s.id === staffId);
    if (!member) return;
    try {
      const updated = await staffApi.update(staffId, { ...member, commissionRate: rateNum });
      setStaffMembers(prev => prev.map(s => s.id === staffId ? updated : s));
      showToast(`Comisión actualizada a ${rateNum}% para el especialista`, 'success');
    } catch (err) { showToast('Error al actualizar comisión', 'error'); }
  }, [staffMembers]);

  const addStaffMember = useCallback(async (staffData) => {
    const newStaff = {
      name: staffData.name || 'Nuevo Especialista',
      role: staffData.role || 'Master Barber & Stylist',
      rating: 5.0, reviewsCount: 0,
      avatar: staffData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      color: staffData.color || '#6045F4',
      commissionRate: typeof staffData.commissionRate === 'number' ? staffData.commissionRate : 50,
      specialties: Array.isArray(staffData.specialties) ? staffData.specialties : ['Corte Clásico', 'Diseño de Barba'],
      assignedServices: Array.isArray(staffData.assignedServices) ? staffData.assignedServices : [],
      schedule: {
        ...(staffData.schedule || {
          startHour: staffData.startHour || '09:00',
          endHour: staffData.endHour || '19:00',
          workDays: staffData.workDays || ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
        }),
        assignedServices: Array.isArray(staffData.assignedServices) ? staffData.assignedServices : []
      }
    };
    try {
      const created = await staffApi.create(newStaff);
      setStaffMembers(prev => [...prev, created]);
      showToast(`¡Especialista ${created.name} añadido exitosamente al equipo!`, 'success');
      return created;
    } catch (err) { showToast('Error al añadir especialista', 'error'); }
  }, []);

  const updateStaffMember = useCallback(async (staffId, updatedData) => {
    const member = staffMembers.find(s => s.id === staffId);
    if (!member) return;
    const merged = { ...member, ...updatedData };
    if (updatedData.assignedServices) {
      merged.assignedServices = updatedData.assignedServices;
      merged.schedule = {
        ...(merged.schedule || {}),
        assignedServices: updatedData.assignedServices
      };
    }
    try {
      const updated = await staffApi.update(staffId, merged);
      setStaffMembers(prev => prev.map(s => s.id === staffId ? updated : s));
      showToast('Especialista actualizado con éxito', 'success');
      return updated;
    } catch (err) {
      setStaffMembers(prev => prev.map(s => s.id === staffId ? merged : s));
      showToast('Especialista actualizado', 'info');
      return merged;
    }
  }, [staffMembers]);

  const updateStaffSchedule = useCallback(async (staffId, scheduleData) => {
    const member = staffMembers.find(s => s.id === staffId);
    if (!member) return;
    const existingAssigned = member.assignedServices || member.schedule?.assignedServices || [];
    const updatedSchedule = { 
      ...(member.schedule || { startHour:'09:00', endHour:'19:00', workDays:[] }), 
      ...scheduleData,
      assignedServices: existingAssigned
    };
    try {
      const updated = await staffApi.update(staffId, { ...member, schedule: updatedSchedule });
      setStaffMembers(prev => prev.map(s => s.id === staffId ? updated : s));
      showToast('Horario de trabajo actualizado correctamente', 'success');
    } catch (err) { showToast('Error al actualizar horario', 'error'); }
  }, [staffMembers]);

  const deleteStaffMember = useCallback(async (staffId) => {
    try {
      await staffApi.remove(staffId);
      setStaffMembers(prev => prev.filter(s => s.id !== staffId));
      showToast('Especialista eliminado del equipo', 'info');
    } catch (err) { showToast('Error al eliminar especialista', 'error'); }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  //  VENUE HELPERS (pure computation — no DB calls needed for these)
  // ═══════════════════════════════════════════════════════════════════════════
  const activeVenue = (venues && venues[0]) || VENUES[0];

  const getVenueOperatingHours = (v = activeVenue, specificDayOrDate = null) => {
    const rawDaily = v?.dailySchedule || {};
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

    if (specificDayOrDate) {
      const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      let targetDay = specificDayOrDate;
      if (typeof specificDayOrDate === 'string' && specificDayOrDate.includes('-')) {
        const parts = specificDayOrDate.split('-').map(Number);
        if (parts.length >= 3) {
          const d = new Date(parts[0], parts[1]-1, parts[2]);
          targetDay = dayNames[d.getDay()];
        }
      } else if (specificDayOrDate instanceof Date) {
        targetDay = dayNames[specificDayOrDate.getDay()];
      }
      const dayConfig = dailySchedule[targetDay] || { isOpen: false, openingHour: '09:00', closingHour: '20:00' };
      return {
        targetDay, isOpen: Boolean(dayConfig.isOpen),
        openingHour: dayConfig.openingHour || '09:00',
        closingHour: dayConfig.closingHour || '20:00',
        openDays: openDaysList, dailySchedule,
        formatted: dayConfig.isOpen ? `${dayConfig.openingHour} - ${dayConfig.closingHour}` : 'Cerrado'
      };
    }

    const openConfigs = Object.values(dailySchedule).filter(d => d.isOpen);
    const minOpening = openConfigs.length > 0 ? openConfigs.reduce((min, d) => d.openingHour < min ? d.openingHour : min, '23:59') : '09:00';
    const maxClosing = openConfigs.length > 0 ? openConfigs.reduce((max, d) => d.closingHour > max ? d.closingHour : max, '00:00') : '20:00';
    return { openingHour: minOpening, closingHour: maxClosing, openDays: openDaysList, dailySchedule, formatted: `${minOpening} - ${maxClosing}` };
  };

  const storeOperatingHours = getVenueOperatingHours();

  const getStoreTimeSlots = (stepMinutes = 30, specificDayOrDate = null) => {
    const dayHours = getVenueOperatingHours(activeVenue, specificDayOrDate);
    if (specificDayOrDate && !dayHours.isOpen) return [];
    const [startH, startM] = (dayHours.openingHour || '09:00').split(':').map(Number);
    const [endH, endM] = (dayHours.closingHour || '20:00').split(':').map(Number);
    const slots = [];
    let curMin = startH * 60 + (startM || 0);
    const endMin = endH * 60 + (endM || 0);
    while (curMin < endMin) {
      const h = Math.floor(curMin / 60);
      const m = curMin % 60;
      slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
      curMin += stepMinutes;
    }
    return slots.length > 0 ? slots : ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'];
  };

  const updateVenueOperatingHours = useCallback(async (venueId, dailyScheduleOrOpenH, closingHour, openDays, formattedHoursString) => {
    const targetVenueId = venueId || activeVenue.id;
    let newDailySchedule = {};
    let newOpenDays = [];
    let overallOpening = '09:00';
    let overallClosing = '20:00';

    if (typeof dailyScheduleOrOpenH === 'object' && dailyScheduleOrOpenH !== null) {
      newDailySchedule = dailyScheduleOrOpenH;
      newOpenDays = Object.keys(newDailySchedule).filter(d => newDailySchedule[d]?.isOpen);
      const openConfigs = Object.values(newDailySchedule).filter(d => d?.isOpen);
      overallOpening = openConfigs.length > 0 ? openConfigs.reduce((min,d) => d.openingHour < min ? d.openingHour : min, '23:59') : '09:00';
      overallClosing = openConfigs.length > 0 ? openConfigs.reduce((max,d) => d.closingHour > max ? d.closingHour : max, '00:00') : '20:00';
    } else {
      overallOpening = dailyScheduleOrOpenH || '09:00';
      overallClosing = closingHour || '20:00';
      newOpenDays = openDays || ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].forEach(day => {
        newDailySchedule[day] = {
          isOpen: newOpenDays.includes(day),
          openingHour: overallOpening,
          closingHour: day === 'Sábado' ? '18:00' : (day === 'Domingo' ? '14:00' : overallClosing)
        };
      });
    }

    try {
      const targetVenue = venues.find(v => v.id === targetVenueId) || venues[0];
      const updatedVenueData = {
        ...targetVenue,
        dailySchedule: newDailySchedule,
        openingHour: overallOpening,
        closingHour: overallClosing,
        openDays: newOpenDays,
        hours: formattedHoursString || `${overallOpening} - ${overallClosing}`
      };
      const savedVenue = await venuesApi.upsert(targetVenueId, updatedVenueData);
      setVenues(prev => prev.map(v => v.id === targetVenueId ? savedVenue : v));

      // Cascade clamp to staff
      const updatedStaff = await Promise.all(staffMembers.map(async staff => {
        const staffSch = staff.schedule || { startHour:'09:00', endHour:'19:00', workDays:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'] };
        let startH = staffSch.startHour || '09:00';
        let endH = staffSch.endHour || '19:00';
        if (startH < overallOpening) startH = overallOpening;
        if (startH >= overallClosing) startH = overallOpening;
        if (endH > overallClosing) endH = overallClosing;
        if (endH <= startH) endH = overallClosing;
        const validDays = (staffSch.workDays || []).filter(d => newOpenDays.includes(d));
        const newSchedule = { startHour: startH, endHour: endH, workDays: validDays.length > 0 ? validDays : newOpenDays };
        try {
          return await staffApi.update(staff.id, { ...staff, schedule: newSchedule });
        } catch { return { ...staff, schedule: newSchedule }; }
      }));
      setStaffMembers(updatedStaff);
      showToast('¡Horarios configurados día a día y sincronizados con el equipo con éxito!', 'success');
    } catch (err) { showToast('Error al actualizar horarios', 'error'); }
  }, [venues, staffMembers, activeVenue]);

  const updateVenueServices = useCallback(async (venueId, newServices) => {
    const targetVenueId = venueId || activeVenue?.id || 'venue-1';
    const targetVenue = venues.find(v => v.id === targetVenueId) || activeVenue || VENUES[0];
    const updatedVenueData = {
      ...targetVenue,
      services: newServices
    };
    try {
      const savedVenue = await venuesApi.upsert(targetVenueId, updatedVenueData);
      setVenues(prev => prev.map(v => v.id === targetVenueId ? savedVenue : v));
      return savedVenue;
    } catch (err) {
      console.error('Error updating venue services:', err);
      setVenues(prev => prev.map(v => v.id === targetVenueId ? updatedVenueData : v));
      return updatedVenueData;
    }
  }, [venues, activeVenue]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  TOAST
  // ═══════════════════════════════════════════════════════════════════════════
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  BOOKING MODAL
  // ═══════════════════════════════════════════════════════════════════════════
  const openBookingModal = (venue) => {
    setBookingVenue(venue || selectedVenue || VENUES[0]);
    setIsBookingModalOpen(true);
  };
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setConfirmedBookingData(null);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  ADD APPOINTMENT (syncs booking + calendar + CRM)
  // ═══════════════════════════════════════════════════════════════════════════
  const addAppointment = useCallback(async (newBooking) => {
    const bookingId = `book-${Date.now()}`;
    // Defensive: category may be null if venue loaded from DB without it
    const categoryCode = (newBooking.venue?.category || 'STY').toUpperCase().slice(0, 3);
    const bookingCode = `STY-${Math.floor(1000 + Math.random() * 9000)}-${categoryCode}`;

    const clientEntry = {
      id: bookingId,
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
      bookingCode,
      clientName: newBooking.clientName,
      clientPhone: newBooking.clientPhone,
      clientEmail: newBooking.clientEmail
    };

    // Normalize time to HH:mm
    let startTimeFormatted = newBooking.timeSlot || '09:00';
    if (startTimeFormatted.includes('PM') && !startTimeFormatted.startsWith('12')) {
      const parts = startTimeFormatted.split(':');
      startTimeFormatted = `${String(parseInt(parts[0],10)+12).padStart(2,'0')}:${parts[1].slice(0,2)}`;
    } else if (startTimeFormatted.includes('AM') && startTimeFormatted.startsWith('12')) {
      startTimeFormatted = `00:${startTimeFormatted.split(':')[1].slice(0,2)}`;
    } else if (startTimeFormatted.includes('AM') || startTimeFormatted.includes('PM')) {
      startTimeFormatted = startTimeFormatted.slice(0,5).trim();
    }

    const calEntry = {
      id: `apt-${Date.now()}`,
      bookingId: clientEntry.id,
      staffId: newBooking.staff ? newBooking.staff.id : 'staff-1',
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

    try {
      const [savedBooking, savedApt] = await Promise.all([
        bookingsApi.create(clientEntry),
        appointmentsApi.create(calEntry),
      ]);
      setClientBookings(prev => [savedBooking, ...prev]);
      setCalendarAppointments(prev => [...prev, savedApt]);

      // Upsert CRM
      const existingClient = clientsCRM.find(c => c.email?.toLowerCase() === newBooking.clientEmail?.toLowerCase());
      if (existingClient) {
        const updatedClient = await clientsApi.update(existingClient.id, {
          incrementVisits: 1,
          incrementSpent: newBooking.totalPrice,
          lastVisit: newBooking.date
        });
        setClientsCRM(prev => prev.map(c => c.id === existingClient.id ? updatedClient : c));
      } else {
        const newClient = await clientsApi.create({
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
        });
        setClientsCRM(prev => [newClient, ...prev]);
      }

      setConfirmedBookingData(savedBooking);
      showToast('¡Cita confirmada con éxito!', 'success');
    } catch (err) {
      console.error('addAppointment error:', err);
      showToast('Error al confirmar la cita', 'error');
    }
  }, [clientsCRM]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  APPOINTMENT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const updateAppointmentStatus = useCallback(async (aptId, newStatus) => {
    try {
      const updated = await appointmentsApi.update(aptId, { status: newStatus });
      setCalendarAppointments(prev => prev.map(apt => apt.id === aptId ? updated : apt));
      showToast(`Estado de cita actualizado a: ${newStatus}`, 'info');
    } catch (err) { showToast('Error al actualizar estado', 'error'); }
  }, []);

  const clearCalendarAppointments = useCallback(async () => {
    try {
      await appointmentsApi.clearAll();
      setCalendarAppointments([]);
      showToast('Agenda limpiada: 0 citas activas', 'info');
    } catch (err) { showToast('Error al limpiar agenda', 'error'); }
  }, []);

  const resetCalendarAppointments = useCallback(async () => {
    try {
      await appointmentsApi.clearAll();
      for (const apt of INITIAL_CALENDAR_APPOINTMENTS) {
        await appointmentsApi.create(apt).catch(() => {});
      }
      const freshApts = await appointmentsApi.list();
      setCalendarAppointments(freshApts);
      showToast('Citas demo restablecidas correctamente', 'success');
    } catch (err) { showToast('Error al restablecer citas', 'error'); }
  }, []);

  const deleteAppointment = useCallback(async (aptId) => {
    try {
      await appointmentsApi.remove(aptId);
      setCalendarAppointments(prev => prev.filter(apt => apt.id !== aptId));
      showToast('Cita eliminada de la agenda', 'info');
    } catch (err) { showToast('Error al eliminar cita', 'error'); }
  }, []);

  // Used by NewAppointmentModal to persist manually created appointments to DB
  const createManualAppointment = useCallback(async (aptData) => {
    try {
      const saved = await appointmentsApi.create(aptData);
      setCalendarAppointments(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('createManualAppointment error:', err);
      // Fallback: show in UI even if API fails
      setCalendarAppointments(prev => [...prev, aptData]);
      return aptData;
    }
  }, []);

  const cancelClientBookingWithReason = useCallback(async (bookingId, reason = 'Cancelada por el cliente') => {
    const booking = clientBookings.find(b => b.id === bookingId);
    const calApt = calendarAppointments.find(a => a.bookingId === bookingId || a.id === bookingId);
    const clientEmail = booking?.clientEmail || calApt?.clientEmail;
    const clientName = booking?.clientName || calApt?.clientName;

    try {
      const [updatedBooking, updatedApt] = await Promise.all([
        bookingsApi.update(bookingId, {
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString()
        }),
        calApt ? appointmentsApi.update(calApt.id, {
          status: 'cancelled',
          notes: calApt.notes ? `${calApt.notes} | Cancelación: ${reason}` : `Cancelación: ${reason}`
        }) : Promise.resolve(null)
      ]);

      setClientBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
      if (updatedApt) setCalendarAppointments(prev => prev.map(a => (a.bookingId === bookingId || a.id === bookingId) ? updatedApt : a));

      // Increment CRM cancelled count
      const crmClient = clientsCRM.find(c =>
        (clientEmail && c.email?.toLowerCase() === clientEmail?.toLowerCase()) ||
        (clientName && c.name?.toLowerCase() === clientName?.toLowerCase())
      );
      if (crmClient) {
        const updatedClient = await clientsApi.update(crmClient.id, { incrementCancelled: 1 });
        setClientsCRM(prev => prev.map(c => c.id === crmClient.id ? updatedClient : c));
      }

      showToast('Cita cancelada con éxito. Motivo registrado en el sistema.', 'warning');
    } catch (err) { showToast('Error al cancelar la cita', 'error'); }
  }, [clientBookings, calendarAppointments, clientsCRM]);

  const cancelClientBooking = useCallback((bookingId) => {
    cancelClientBookingWithReason(bookingId, 'Cancelación solicitada por el cliente');
  }, [cancelClientBookingWithReason]);

  const rescheduleClientBooking = useCallback(async (bookingId, newDate, newTime, reason = 'Reagendamiento solicitado') => {
    let formattedTime = newTime || '10:00';
    if (formattedTime.includes('PM') && !formattedTime.startsWith('12')) {
      const parts = formattedTime.split(':');
      formattedTime = `${String(parseInt(parts[0],10)+12).padStart(2,'0')}:${parts[1].slice(0,2)}`;
    } else if (formattedTime.includes('AM') && formattedTime.startsWith('12')) {
      formattedTime = `00:${formattedTime.split(':')[1].slice(0,2)}`;
    } else if (formattedTime.includes('AM') || formattedTime.includes('PM')) {
      formattedTime = formattedTime.slice(0,5).trim();
    }

    const calApt = calendarAppointments.find(a => a.bookingId === bookingId || a.id === bookingId);
    const booking = clientBookings.find(b => b.id === bookingId);
    const clientEmail = booking?.clientEmail || calApt?.clientEmail;
    const clientName = booking?.clientName || calApt?.clientName;

    try {
      const [updatedBooking, updatedApt] = await Promise.all([
        bookingsApi.update(bookingId, { status: 'confirmed', date: newDate, time: newTime, rescheduleReason: reason, rescheduledAt: new Date().toISOString() }),
        calApt ? appointmentsApi.update(calApt.id, { date: newDate, startTime: formattedTime, status: 'confirmed', rescheduleReason: reason }) : Promise.resolve(null)
      ]);

      setClientBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
      if (updatedApt) setCalendarAppointments(prev => prev.map(a => (a.bookingId === bookingId || a.id === bookingId) ? updatedApt : a));

      const crmClient = clientsCRM.find(c =>
        (clientEmail && c.email?.toLowerCase() === clientEmail?.toLowerCase()) ||
        (clientName && c.name?.toLowerCase() === clientName?.toLowerCase())
      );
      if (crmClient) {
        const updatedClient = await clientsApi.update(crmClient.id, { incrementRescheduled: 1 });
        setClientsCRM(prev => prev.map(c => c.id === crmClient.id ? updatedClient : c));
      }

      showToast(`¡Cita reagendada con éxito para el ${newDate} a las ${newTime}!`, 'success');
    } catch (err) { showToast('Error al reagendar la cita', 'error'); }
  }, [clientBookings, calendarAppointments, clientsCRM]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  SALES / POS ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const recordSaleTransaction = useCallback(async (saleData) => {
    const txData = {
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
    try {
      const newTx = await transactionsApi.create(txData);
      setSalesTransactions(prev => [newTx, ...prev]);
      return newTx;
    } catch (err) {
      showToast('Error al registrar venta', 'error');
      return null;
    }
  }, []);

  const settlePayrollPeriod = useCallback(async (settlementData) => {
    try {
      const newSettlement = await settlementsApi.create({
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...settlementData,
        status: 'paid'
      });
      setPayrollSettlements(prev => [newSettlement, ...prev]);

      // Mark transactions as settled
      const targetIds = new Set(settlementData.transactionIds || []);
      await Promise.all(
        salesTransactions
          .filter(tx => targetIds.has(tx.id))
          .map(tx => transactionsApi.settle(tx.id, { settled: true, settlementId: newSettlement.id }))
      );
      setSalesTransactions(prev => prev.map(tx =>
        targetIds.has(tx.id) ? { ...tx, settled: true, payoutStatus: 'paid', settlementId: newSettlement.id } : tx
      ));

      // Mark appointments as commission settled
      await appointmentsApi.bulkSettle({
        ids: settlementData.transactionIds,
        staffId: settlementData.staffId,
        startDate: settlementData.startDate,
        endDate: settlementData.endDate
      });
      setCalendarAppointments(prev => prev.map(apt => {
        if (targetIds.has(apt.id) || (apt.staffId === settlementData.staffId && apt.date >= (settlementData.startDate||'1970') && apt.date <= (settlementData.endDate||'2099'))) {
          return { ...apt, commissionSettled: true };
        }
        return apt;
      }));

      showToast(`Período liquidado con éxito. Estado: PAGADA (${settlementData.periodLabel || 'Período'})`, 'success');
    } catch (err) { showToast('Error al liquidar período', 'error'); }
  }, [salesTransactions]);

  const toggleTicketSettled = useCallback(async (txId) => {
    const tx = salesTransactions.find(t => t.id === txId);
    if (!tx) return;
    const nextSettled = !tx.settled;
    try {
      await transactionsApi.settle(txId, { settled: nextSettled });
      setSalesTransactions(prev => prev.map(t =>
        t.id === txId ? { ...t, settled: nextSettled, payoutStatus: nextSettled ? 'paid' : 'pending' } : t
      ));
      showToast(`Ticket marcado como ${nextSettled ? 'PAGADA' : 'PENDIENTE'}`, 'info');
    } catch (err) { showToast('Error al actualizar ticket', 'error'); }
  }, [salesTransactions]);

  const clearSalesTransactions = useCallback(async () => {
    try {
      await transactionsApi.clearAll();
      setSalesTransactions([]);
      setPayrollSettlements([]);
      showToast('Historial de ventas y liquidaciones reseteadas a $0', 'info');
    } catch (err) { showToast('Error al limpiar historial', 'error'); }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  //  CART (local only — no need to persist to DB)
  // ═══════════════════════════════════════════════════════════════════════════
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`"${product.name}" añadido a tu bolsa de compra`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  CURRENCY
  // ═══════════════════════════════════════════════════════════════════════════
  const setBusinessCountry = (countryCode) => {
    if (SUPPORTED_COUNTRIES_CURRENCIES[countryCode]) {
      setSelectedCountry(countryCode);
      try { localStorage.setItem('styluu_country', countryCode); } catch {}
      const curr = SUPPORTED_COUNTRIES_CURRENCIES[countryCode];
      showToast(`Moneda configurada: ${curr.currencyName} (${curr.flag})`, 'success');
    }
  };

  const formatMoney = (amount, showCode = true) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0';
    let val = Number(amount);
    
    // Auto-detect legacy USD amounts when in high-denomination currencies (e.g. COP, CLP, ARS)
    if (['COP', 'CLP', 'ARS'].includes(currentCurrency.currencyCode) && val > 0 && val < 1000) {
      val = val * (currentCurrency.rateMultiplier || 1);
    } else if (['MXN', 'DOP'].includes(currentCurrency.currencyCode) && val > 0 && val < 100) {
      val = val * (currentCurrency.rateMultiplier || 1);
    }

    let formattedNumber;
    if (['COP','CLP','ARS'].includes(currentCurrency.currencyCode)) {
      formattedNumber = Math.round(val).toLocaleString('es-CO');
    } else if (currentCurrency.currencyCode === 'EUR') {
      formattedNumber = val % 1 === 0 ? Math.round(val).toLocaleString('es-ES') : val.toFixed(2);
    } else {
      formattedNumber = val % 1 === 0 ? Math.round(val).toLocaleString('en-US') : val.toFixed(2);
    }
    const symbol = currentCurrency.currencySymbol || '$';
    const code = showCode ? ` ${currentCurrency.currencyCode}` : '';
    if (currentCurrency.currencyCode === 'EUR') return `${formattedNumber} ${symbol}${code ? ` (${currentCurrency.currencyCode})` : ''}`;
    return `${symbol}${formattedNumber}${code}`;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <AppContext.Provider value={{
      // DB state
      dbReady, dbError,
      // UI
      currentView, setCurrentView,
      businessTab, setBusinessTab,
      selectedCountry, setSelectedCountry, setBusinessCountry,
      currentCurrency, currencies: SUPPORTED_COUNTRIES_CURRENCIES, formatMoney,
      selectedVenue, setSelectedVenue,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      selectedLocation, setSelectedLocation,
      // Venues
      venues, setVenues,
      getVenueOperatingHours, getStoreTimeSlots, updateVenueOperatingHours, updateVenueServices,
      storeOperatingHours,
      // Staff
      staffMembers, setStaffMembers,
      updateStaffCommission, addStaffMember, updateStaffSchedule, deleteStaffMember,
      // Appointments
      calendarAppointments, setCalendarAppointments,
      updateAppointmentStatus, clearCalendarAppointments, resetCalendarAppointments,
      deleteAppointment, createManualAppointment,
      // Client bookings
      clientBookings, setClientBookings,
      cancelClientBooking, cancelClientBookingWithReason, rescheduleClientBooking,
      // CRM
      clientsCRM, setClientsCRM,
      // Booking modal
      isBookingModalOpen, openBookingModal, closeBookingModal,
      bookingVenue, confirmedBookingData, addAppointment,
      // Sales / POS
      salesTransactions, recordSaleTransaction, clearSalesTransactions, toggleTicketSettled,
      payrollSettlements, settlePayrollPeriod,
      // Products
      products, setProducts,
      // Cart
      cart, addToCart, removeFromCart,
      // Toast
      toast, showToast,
      // Business stats (static)
      businessStats: BUSINESS_STATS,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
