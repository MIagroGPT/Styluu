require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Database Connection ────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '5mb' }));

// ─── Helpers ────────────────────────────────────────────────────────────────
const db = (sql, params) => pool.query(sql, params);
const nowISO = () => new Date().toISOString();
const uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await db('SELECT 1');
    res.json({ status: 'ok', db: 'connected', time: nowISO() });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── Database Setup (run once to create all tables) ─────────────────────────
app.get('/api/setup', async (_req, res) => {
  try {
    await db(`
      CREATE TABLE IF NOT EXISTS venues (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, tagline TEXT, address TEXT, city TEXT,
        category TEXT, rating NUMERIC(3,1) DEFAULT 5.0, reviews_count INTEGER DEFAULT 0,
        price_range TEXT DEFAULT '$$', hours TEXT, opening_hour TEXT DEFAULT '09:00',
        closing_hour TEXT DEFAULT '20:00', open_days JSONB DEFAULT '[]',
        daily_schedule JSONB DEFAULT '{}', images JSONB DEFAULT '[]',
        services JSONB DEFAULT '[]', amenities JSONB DEFAULT '[]',
        phone TEXT, email TEXT, website TEXT, instagram TEXT, about TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS staff_members (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT,
        rating NUMERIC(3,1) DEFAULT 5.0, reviews_count INTEGER DEFAULT 0,
        avatar TEXT, color TEXT DEFAULT '#6045F4', commission_rate INTEGER DEFAULT 50,
        specialties JSONB DEFAULT '[]', schedule JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS calendar_appointments (
        id TEXT PRIMARY KEY, booking_id TEXT, staff_id TEXT,
        client_name TEXT, client_phone TEXT, client_email TEXT,
        service_name TEXT, service_category TEXT DEFAULT 'General',
        price NUMERIC(10,2) DEFAULT 0, start_time TEXT, end_time TEXT,
        date TEXT, status TEXT DEFAULT 'confirmed', color TEXT DEFAULT '#6045F4',
        notes TEXT, cancellation_reason TEXT, reschedule_reason TEXT,
        commission_settled BOOLEAN DEFAULT FALSE, commission_settled_at TIMESTAMPTZ,
        cancelled_at TIMESTAMPTZ, rescheduled_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS client_bookings (
        id TEXT PRIMARY KEY, venue_id TEXT, venue_name TEXT, venue_address TEXT,
        service_name TEXT, staff_name TEXT, staff_avatar TEXT,
        client_name TEXT, client_phone TEXT, client_email TEXT,
        date TEXT, time TEXT, price NUMERIC(10,2) DEFAULT 0,
        status TEXT DEFAULT 'confirmed', booking_code TEXT,
        cancellation_reason TEXT, reschedule_reason TEXT,
        cancelled_at TIMESTAMPTZ, rescheduled_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS clients_crm (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT, email TEXT UNIQUE,
        avatar TEXT, total_visits INTEGER DEFAULT 0, total_spent NUMERIC(10,2) DEFAULT 0,
        total_cancelled INTEGER DEFAULT 0, total_rescheduled INTEGER DEFAULT 0,
        last_visit TEXT, favorite_staff TEXT, tags JSONB DEFAULT '[]', notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sales_transactions (
        id TEXT PRIMARY KEY, timestamp BIGINT, date TEXT, time TEXT,
        staff_id TEXT, staff_name TEXT, client_name TEXT, service_name TEXT,
        service_price NUMERIC(10,2) DEFAULT 0, products_total NUMERIC(10,2) DEFAULT 0,
        tip_amount NUMERIC(10,2) DEFAULT 0, tax_amount NUMERIC(10,2) DEFAULT 0,
        total_amount NUMERIC(10,2) DEFAULT 0, payment_method TEXT DEFAULT 'card',
        items JSONB DEFAULT '[]', settled BOOLEAN DEFAULT FALSE,
        payout_status TEXT DEFAULT 'pending', settlement_id TEXT, settled_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS payroll_settlements (
        id TEXT PRIMARY KEY, timestamp BIGINT, date TEXT, staff_id TEXT,
        staff_name TEXT, period_label TEXT, start_date TEXT, end_date TEXT,
        transaction_ids JSONB DEFAULT '[]', gross_amount NUMERIC(10,2) DEFAULT 0,
        commission_rate INTEGER DEFAULT 50, net_payout NUMERIC(10,2) DEFAULT 0,
        status TEXT DEFAULT 'paid', created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS retail_products (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, brand TEXT, category TEXT,
        price NUMERIC(10,2) DEFAULT 0, stock INTEGER DEFAULT 0,
        image TEXT, description TEXT, sku TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_cal_apts_date ON calendar_appointments(date);
      CREATE INDEX IF NOT EXISTS idx_cal_apts_staff ON calendar_appointments(staff_id);
      CREATE INDEX IF NOT EXISTS idx_client_bookings_email ON client_bookings(client_email);
      CREATE INDEX IF NOT EXISTS idx_clients_crm_email ON clients_crm(email);
      CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_transactions(date);
    `);
    res.json({ status: 'ok', message: '✅ Todas las tablas creadas exitosamente', tables: ['venues','staff_members','calendar_appointments','client_bookings','clients_crm','sales_transactions','payroll_settlements','retail_products'] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  VENUES
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/venues', async (_req, res) => {
  try {
    const { rows } = await db('SELECT * FROM venues ORDER BY created_at');
    res.json(rows.map(mapVenueOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/venues/:id', async (req, res) => {
  try {
    const { rows } = await db('SELECT * FROM venues WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapVenueOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/venues/:id', async (req, res) => {
  const v = req.body;
  try {
    const { rows } = await db(`
      INSERT INTO venues (
        id, name, tagline, address, city, category, rating, reviews_count,
        price_range, hours, opening_hour, closing_hour, open_days,
        daily_schedule, images, services, amenities, phone, email,
        website, instagram, about, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,NOW())
      ON CONFLICT (id) DO UPDATE SET
        name=$2, tagline=$3, address=$4, city=$5, category=$6, rating=$7,
        reviews_count=$8, price_range=$9, hours=$10, opening_hour=$11,
        closing_hour=$12, open_days=$13, daily_schedule=$14, images=$15,
        services=$16, amenities=$17, phone=$18, email=$19, website=$20,
        instagram=$21, about=$22, updated_at=NOW()
      RETURNING *
    `, [
      v.id || uid('venue'), v.name, v.tagline, v.address, v.city, v.category,
      v.rating ?? 5.0, v.reviewsCount ?? 0, v.priceRange ?? '$$', v.hours,
      v.openingHour ?? '09:00', v.closingHour ?? '20:00',
      JSON.stringify(v.openDays ?? []),
      JSON.stringify(v.dailySchedule ?? {}),
      JSON.stringify(v.images ?? []),
      JSON.stringify(v.services ?? []),
      JSON.stringify(v.amenities ?? []),
      v.phone, v.email, v.website, v.instagram, v.about
    ]);
    res.json(mapVenueOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bulk upsert all venues (for initial sync)
app.post('/api/venues/bulk', async (req, res) => {
  const venues = req.body;
  if (!Array.isArray(venues)) return res.status(400).json({ error: 'Expected array' });
  try {
    const results = [];
    for (const v of venues) {
      const { rows } = await db(`
        INSERT INTO venues (
          id, name, tagline, address, city, category, rating, reviews_count,
          price_range, hours, opening_hour, closing_hour, open_days,
          daily_schedule, images, services, amenities, phone, email,
          website, instagram, about
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
      `, [
        v.id || uid('venue'), v.name, v.tagline, v.address, v.city, v.category,
        v.rating ?? 5.0, v.reviewsCount ?? 0, v.priceRange ?? '$$', v.hours,
        v.openingHour ?? '09:00', v.closingHour ?? '20:00',
        JSON.stringify(v.openDays ?? []),
        JSON.stringify(v.dailySchedule ?? {}),
        JSON.stringify(v.images ?? []),
        JSON.stringify(v.services ?? []),
        JSON.stringify(v.amenities ?? []),
        v.phone, v.email, v.website, v.instagram, v.about
      ]);
      if (rows.length) results.push(mapVenueOut(rows[0]));
    }
    res.json({ inserted: results.length, venues: results });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapVenueOut(r) {
  return {
    id: r.id, name: r.name, tagline: r.tagline, address: r.address,
    city: r.city, category: r.category, rating: Number(r.rating),
    reviewsCount: r.reviews_count, priceRange: r.price_range,
    hours: r.hours, openingHour: r.opening_hour, closingHour: r.closing_hour,
    openDays: r.open_days, dailySchedule: r.daily_schedule,
    images: r.images, services: r.services, amenities: r.amenities,
    phone: r.phone, email: r.email, website: r.website,
    instagram: r.instagram, about: r.about,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  STAFF MEMBERS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/staff', async (_req, res) => {
  try {
    const { rows } = await db('SELECT * FROM staff_members ORDER BY created_at');
    res.json(rows.map(mapStaffOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/staff', async (req, res) => {
  const s = req.body;
  const id = s.id || uid('staff');
  try {
    const { rows } = await db(`
      INSERT INTO staff_members (id, name, role, rating, reviews_count, avatar, color, commission_rate, specialties, schedule)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `, [
      id, s.name, s.role, s.rating ?? 5.0, s.reviewsCount ?? 0,
      s.avatar, s.color ?? '#6045F4', s.commissionRate ?? 50,
      JSON.stringify(s.specialties ?? []),
      JSON.stringify(s.schedule ?? { startHour: '09:00', endHour: '19:00', workDays: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'] })
    ]);
    res.status(201).json(mapStaffOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/staff/:id', async (req, res) => {
  const s = req.body;
  try {
    const { rows } = await db(`
      UPDATE staff_members SET
        name=$2, role=$3, rating=$4, reviews_count=$5, avatar=$6,
        color=$7, commission_rate=$8, specialties=$9, schedule=$10, updated_at=NOW()
      WHERE id=$1 RETURNING *
    `, [
      req.params.id, s.name, s.role, s.rating ?? 5.0, s.reviewsCount ?? 0,
      s.avatar, s.color ?? '#6045F4', s.commissionRate ?? 50,
      JSON.stringify(s.specialties ?? []),
      JSON.stringify(s.schedule ?? {})
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapStaffOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    await db('DELETE FROM staff_members WHERE id=$1', [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bulk insert (initial seed)
app.post('/api/staff/bulk', async (req, res) => {
  const staff = req.body;
  if (!Array.isArray(staff)) return res.status(400).json({ error: 'Expected array' });
  try {
    let count = 0;
    for (const s of staff) {
      await db(`
        INSERT INTO staff_members (id, name, role, rating, reviews_count, avatar, color, commission_rate, specialties, schedule)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (id) DO NOTHING
      `, [
        s.id || uid('staff'), s.name, s.role, s.rating ?? 5.0, s.reviewsCount ?? 0,
        s.avatar, s.color ?? '#6045F4', s.commissionRate ?? 50,
        JSON.stringify(s.specialties ?? []),
        JSON.stringify(s.schedule ?? {})
      ]);
      count++;
    }
    res.json({ inserted: count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapStaffOut(r) {
  return {
    id: r.id, name: r.name, role: r.role, rating: Number(r.rating),
    reviewsCount: r.reviews_count, avatar: r.avatar, color: r.color,
    commissionRate: r.commission_rate, specialties: r.specialties,
    schedule: r.schedule, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  CALENDAR APPOINTMENTS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/appointments', async (req, res) => {
  try {
    const { date, staff_id, status } = req.query;
    let sql = 'SELECT * FROM calendar_appointments WHERE 1=1';
    const params = [];
    if (date) { params.push(date); sql += ` AND date=$${params.length}`; }
    if (staff_id) { params.push(staff_id); sql += ` AND staff_id=$${params.length}`; }
    if (status) { params.push(status); sql += ` AND status=$${params.length}`; }
    sql += ' ORDER BY date, start_time';
    const { rows } = await db(sql, params);
    res.json(rows.map(mapAptOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/appointments', async (req, res) => {
  const a = req.body;
  const id = a.id || uid('apt');
  try {
    const { rows } = await db(`
      INSERT INTO calendar_appointments (
        id, booking_id, staff_id, client_name, client_phone, client_email,
        service_name, service_category, price, start_time, end_time,
        date, status, color, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
    `, [
      id, a.bookingId, a.staffId, a.clientName, a.clientPhone, a.clientEmail,
      a.serviceName, a.serviceCategory ?? 'General', a.price ?? 0,
      a.startTime, a.endTime, a.date, a.status ?? 'confirmed',
      a.color ?? '#6045F4', a.notes
    ]);
    res.status(201).json(mapAptOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/appointments/:id', async (req, res) => {
  const fields = req.body;
  try {
    const setClauses = [];
    const vals = [req.params.id];
    const allowed = ['status','date','start_time','end_time','notes','cancellation_reason',
      'reschedule_reason','commission_settled','cancelled_at','rescheduled_at','commission_settled_at'];
    const jsToDb = { startTime:'start_time', endTime:'end_time', cancellationReason:'cancellation_reason',
      rescheduleReason:'reschedule_reason', commissionSettled:'commission_settled',
      cancelledAt:'cancelled_at', rescheduledAt:'rescheduled_at', commissionSettledAt:'commission_settled_at' };
    for (const [key, dbKey] of Object.entries(jsToDb)) {
      if (key in fields) {
        vals.push(fields[key]);
        setClauses.push(`${dbKey}=$${vals.length}`);
      }
    }
    if ('status' in fields) { vals.push(fields.status); setClauses.push(`status=$${vals.length}`); }
    if ('notes' in fields) { vals.push(fields.notes); setClauses.push(`notes=$${vals.length}`); }
    if ('date' in fields) { vals.push(fields.date); setClauses.push(`date=$${vals.length}`); }
    if (!setClauses.length) return res.json({ message: 'Nothing to update' });
    setClauses.push('updated_at=NOW()');
    const { rows } = await db(
      `UPDATE calendar_appointments SET ${[...new Set(setClauses)].join(',')} WHERE id=$1 RETURNING *`,
      vals
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapAptOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await db('DELETE FROM calendar_appointments WHERE id=$1', [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/appointments', async (_req, res) => {
  try {
    await db('DELETE FROM calendar_appointments');
    res.json({ message: 'All appointments cleared' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bulk update (commission settlement cascades)
app.patch('/api/appointments/bulk/settle', async (req, res) => {
  const { ids, staffId, startDate, endDate } = req.body;
  try {
    let sql, params;
    if (Array.isArray(ids) && ids.length) {
      sql = `UPDATE calendar_appointments SET commission_settled=true, commission_settled_at=NOW(), updated_at=NOW()
             WHERE id = ANY($1) RETURNING id`;
      params = [ids];
    } else {
      sql = `UPDATE calendar_appointments SET commission_settled=true, commission_settled_at=NOW(), updated_at=NOW()
             WHERE staff_id=$1 AND date>=$2 AND date<=$3 RETURNING id`;
      params = [staffId, startDate || '1970-01-01', endDate || '2099-12-31'];
    }
    const { rows } = await db(sql, params);
    res.json({ settled: rows.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapAptOut(r) {
  return {
    id: r.id, bookingId: r.booking_id, staffId: r.staff_id,
    clientName: r.client_name, clientPhone: r.client_phone, clientEmail: r.client_email,
    serviceName: r.service_name, serviceCategory: r.service_category,
    price: Number(r.price), startTime: r.start_time, endTime: r.end_time,
    date: r.date, status: r.status, color: r.color, notes: r.notes,
    cancellationReason: r.cancellation_reason, rescheduleReason: r.reschedule_reason,
    commissionSettled: r.commission_settled,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  CLIENT BOOKINGS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/bookings', async (_req, res) => {
  try {
    const { rows } = await db('SELECT * FROM client_bookings ORDER BY created_at DESC');
    res.json(rows.map(mapBookingOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bookings', async (req, res) => {
  const b = req.body;
  const id = b.id || uid('book');
  try {
    const { rows } = await db(`
      INSERT INTO client_bookings (
        id, venue_id, venue_name, venue_address, service_name, staff_name, staff_avatar,
        client_name, client_phone, client_email, date, time, price, status, booking_code
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
    `, [
      id, b.venueId, b.venueName, b.venueAddress, b.serviceName, b.staffName, b.staffAvatar,
      b.clientName, b.clientPhone, b.clientEmail, b.date, b.time,
      b.price ?? 0, b.status ?? 'confirmed', b.bookingCode
    ]);
    res.status(201).json(mapBookingOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/bookings/:id', async (req, res) => {
  const b = req.body;
  try {
    const { rows } = await db(`
      UPDATE client_bookings SET
        status=COALESCE($2,status),
        date=COALESCE($3,date),
        time=COALESCE($4,time),
        cancellation_reason=$5,
        reschedule_reason=$6,
        cancelled_at=$7,
        rescheduled_at=$8,
        updated_at=NOW()
      WHERE id=$1 RETURNING *
    `, [
      req.params.id, b.status, b.date, b.time,
      b.cancellationReason ?? null, b.rescheduleReason ?? null,
      b.cancelledAt ?? null, b.rescheduledAt ?? null,
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapBookingOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapBookingOut(r) {
  return {
    id: r.id, venueId: r.venue_id, venueName: r.venue_name, venueAddress: r.venue_address,
    serviceName: r.service_name, staffName: r.staff_name, staffAvatar: r.staff_avatar,
    clientName: r.client_name, clientPhone: r.client_phone, clientEmail: r.client_email,
    date: r.date, time: r.time, price: Number(r.price), status: r.status,
    bookingCode: r.booking_code,
    cancellationReason: r.cancellation_reason, rescheduleReason: r.reschedule_reason,
    cancelledAt: r.cancelled_at, rescheduledAt: r.rescheduled_at,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  CLIENTS CRM
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/clients', async (_req, res) => {
  try {
    const { rows } = await db('SELECT * FROM clients_crm ORDER BY created_at DESC');
    res.json(rows.map(mapClientOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/clients', async (req, res) => {
  const c = req.body;
  const id = c.id || uid('cli');
  try {
    const { rows } = await db(`
      INSERT INTO clients_crm (
        id, name, phone, email, avatar, total_visits, total_spent,
        total_cancelled, total_rescheduled, last_visit, favorite_staff, tags, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (email) DO UPDATE SET
        total_visits=clients_crm.total_visits+EXCLUDED.total_visits,
        total_spent=clients_crm.total_spent+EXCLUDED.total_spent,
        last_visit=EXCLUDED.last_visit,
        updated_at=NOW()
      RETURNING *
    `, [
      id, c.name, c.phone, c.email, c.avatar,
      c.totalVisits ?? 0, c.totalSpent ?? 0,
      c.totalCancelled ?? 0, c.totalRescheduled ?? 0,
      c.lastVisit, c.favoriteStaff,
      JSON.stringify(c.tags ?? []), c.notes
    ]);
    res.status(201).json(mapClientOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/clients/:id', async (req, res) => {
  const c = req.body;
  try {
    const { rows } = await db(`
      UPDATE clients_crm SET
        total_visits = total_visits + COALESCE($2, 0),
        total_spent = total_spent + COALESCE($3, 0),
        total_cancelled = total_cancelled + COALESCE($4, 0),
        total_rescheduled = total_rescheduled + COALESCE($5, 0),
        last_visit = COALESCE($6, last_visit),
        updated_at = NOW()
      WHERE id=$1 RETURNING *
    `, [
      req.params.id,
      c.incrementVisits ?? 0, c.incrementSpent ?? 0,
      c.incrementCancelled ?? 0, c.incrementRescheduled ?? 0,
      c.lastVisit ?? null,
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapClientOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapClientOut(r) {
  return {
    id: r.id, name: r.name, phone: r.phone, email: r.email, avatar: r.avatar,
    totalVisits: r.total_visits, totalSpent: Number(r.total_spent),
    totalCancelled: r.total_cancelled, totalRescheduled: r.total_rescheduled,
    lastVisit: r.last_visit, favoriteStaff: r.favorite_staff,
    tags: r.tags, notes: r.notes,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  SALES TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/transactions', async (req, res) => {
  try {
    const { staff_id, settled } = req.query;
    let sql = 'SELECT * FROM sales_transactions WHERE 1=1';
    const params = [];
    if (staff_id) { params.push(staff_id); sql += ` AND staff_id=$${params.length}`; }
    if (settled !== undefined) { params.push(settled === 'true'); sql += ` AND settled=$${params.length}`; }
    sql += ' ORDER BY timestamp DESC';
    const { rows } = await db(sql, params);
    res.json(rows.map(mapTxOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/transactions', async (req, res) => {
  const t = req.body;
  const id = t.id || uid('tx');
  try {
    const { rows } = await db(`
      INSERT INTO sales_transactions (
        id, timestamp, date, time, staff_id, staff_name, client_name, service_name,
        service_price, products_total, tip_amount, tax_amount, total_amount,
        payment_method, items, settled, payout_status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *
    `, [
      id, t.timestamp || Date.now(), t.date, t.time,
      t.staffId, t.staffName, t.clientName, t.serviceName,
      t.servicePrice ?? 0, t.productsTotal ?? 0, t.tipAmount ?? 0,
      t.taxAmount ?? 0, t.totalAmount ?? 0, t.paymentMethod ?? 'card',
      JSON.stringify(t.items ?? []), t.settled ?? false, t.payoutStatus ?? 'pending'
    ]);
    res.status(201).json(mapTxOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/transactions/:id/settle', async (req, res) => {
  const { settled, settlementId } = req.body;
  try {
    const { rows } = await db(`
      UPDATE sales_transactions SET
        settled=$2, settled_at=$3, payout_status=$4, settlement_id=$5
      WHERE id=$1 RETURNING *
    `, [
      req.params.id, settled ?? true,
      settled ? nowISO() : null,
      settled ? 'paid' : 'pending',
      settlementId ?? null
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapTxOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/transactions', async (_req, res) => {
  try {
    await db('DELETE FROM sales_transactions');
    await db('DELETE FROM payroll_settlements');
    res.json({ message: 'All transactions and settlements cleared' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapTxOut(r) {
  return {
    id: r.id, timestamp: Number(r.timestamp), date: r.date, time: r.time,
    staffId: r.staff_id, staffName: r.staff_name, clientName: r.client_name,
    serviceName: r.service_name, servicePrice: Number(r.service_price),
    productsTotal: Number(r.products_total), tipAmount: Number(r.tip_amount),
    taxAmount: Number(r.tax_amount), totalAmount: Number(r.total_amount),
    paymentMethod: r.payment_method, items: r.items,
    settled: r.settled, payoutStatus: r.payout_status,
    settlementId: r.settlement_id, settledAt: r.settled_at,
    createdAt: r.created_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  PAYROLL SETTLEMENTS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/settlements', async (_req, res) => {
  try {
    const { rows } = await db('SELECT * FROM payroll_settlements ORDER BY timestamp DESC');
    res.json(rows.map(mapSettlementOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/settlements', async (req, res) => {
  const s = req.body;
  const id = s.id || uid('settle');
  try {
    const { rows } = await db(`
      INSERT INTO payroll_settlements (
        id, timestamp, date, staff_id, staff_name, period_label,
        start_date, end_date, transaction_ids, gross_amount,
        commission_rate, net_payout, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    `, [
      id, s.timestamp || Date.now(), s.date,
      s.staffId, s.staffName, s.periodLabel,
      s.startDate, s.endDate,
      JSON.stringify(s.transactionIds ?? []),
      s.grossAmount ?? 0, s.commissionRate ?? 50,
      s.netPayout ?? 0, s.status ?? 'paid'
    ]);
    res.status(201).json(mapSettlementOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapSettlementOut(r) {
  return {
    id: r.id, timestamp: Number(r.timestamp), date: r.date,
    staffId: r.staff_id, staffName: r.staff_name, periodLabel: r.period_label,
    startDate: r.start_date, endDate: r.end_date,
    transactionIds: r.transaction_ids, grossAmount: Number(r.gross_amount),
    commissionRate: r.commission_rate, netPayout: Number(r.net_payout),
    status: r.status, createdAt: r.created_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  RETAIL PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/products', async (_req, res) => {
  try {
    const { rows } = await db('SELECT * FROM retail_products ORDER BY name');
    res.json(rows.map(mapProductOut));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  const p = req.body;
  try {
    const { rows } = await db(`
      INSERT INTO retail_products (id, name, brand, category, price, stock, image, description, sku)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO UPDATE SET
        name=$2, brand=$3, category=$4, price=$5, stock=$6,
        image=$7, description=$8, sku=$9, updated_at=NOW()
      RETURNING *
    `, [
      req.params.id, p.name, p.brand, p.category,
      p.price ?? 0, p.stock ?? 0, p.image, p.description, p.sku
    ]);
    res.json(mapProductOut(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products/bulk', async (req, res) => {
  const products = req.body;
  if (!Array.isArray(products)) return res.status(400).json({ error: 'Expected array' });
  try {
    let count = 0;
    for (const p of products) {
      await db(`
        INSERT INTO retail_products (id, name, brand, category, price, stock, image, description, sku)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO NOTHING
      `, [p.id || uid('prod'), p.name, p.brand, p.category, p.price ?? 0, p.stock ?? 0, p.image, p.description, p.sku]);
      count++;
    }
    res.json({ inserted: count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapProductOut(r) {
  return {
    id: r.id, name: r.name, brand: r.brand, category: r.category,
    price: Number(r.price), stock: r.stock, image: r.image,
    description: r.description, sku: r.sku,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ─── 404 fallback ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Styluu API running on port ${PORT}`);
  console.log(`   DB: ${process.env.DATABASE_URL ? 'Connected' : '⚠️  DATABASE_URL not set'}`);
});
