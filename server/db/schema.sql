-- ============================================================
-- Styluu Platform — PostgreSQL Database Schema
-- Run this script ONCE via PgWeb to initialize the database
-- ============================================================

-- ============================================================
-- TABLE: venues (configuración del negocio/salón)
-- ============================================================
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  address TEXT,
  city TEXT,
  category TEXT,
  rating NUMERIC(3,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  price_range TEXT DEFAULT '$$',
  hours TEXT,
  opening_hour TEXT DEFAULT '09:00',
  closing_hour TEXT DEFAULT '20:00',
  open_days JSONB DEFAULT '["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]',
  daily_schedule JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  phone TEXT,
  email TEXT,
  website TEXT,
  instagram TEXT,
  about TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: staff_members (equipo de especialistas)
-- ============================================================
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  rating NUMERIC(3,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  avatar TEXT,
  color TEXT DEFAULT '#6045F4',
  commission_rate INTEGER DEFAULT 50,
  specialties JSONB DEFAULT '[]',
  schedule JSONB DEFAULT '{"startHour":"09:00","endHour":"19:00","workDays":["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: calendar_appointments (citas en el calendario del negocio)
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_appointments (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  staff_id TEXT,
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  service_name TEXT,
  service_category TEXT DEFAULT 'General',
  price NUMERIC(10,2) DEFAULT 0,
  start_time TEXT,
  end_time TEXT,
  date TEXT,
  status TEXT DEFAULT 'confirmed',
  color TEXT DEFAULT '#6045F4',
  notes TEXT,
  cancellation_reason TEXT,
  reschedule_reason TEXT,
  commission_settled BOOLEAN DEFAULT FALSE,
  commission_settled_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  rescheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: client_bookings (reservas del lado consumidor)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_bookings (
  id TEXT PRIMARY KEY,
  venue_id TEXT,
  venue_name TEXT,
  venue_address TEXT,
  service_name TEXT,
  staff_name TEXT,
  staff_avatar TEXT,
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  date TEXT,
  time TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'confirmed',
  booking_code TEXT,
  cancellation_reason TEXT,
  reschedule_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  rescheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: clients_crm (base de clientes CRM)
-- ============================================================
CREATE TABLE IF NOT EXISTS clients_crm (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE,
  avatar TEXT,
  total_visits INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  total_cancelled INTEGER DEFAULT 0,
  total_rescheduled INTEGER DEFAULT 0,
  last_visit TEXT,
  favorite_staff TEXT,
  tags JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: sales_transactions (ventas POS)
-- ============================================================
CREATE TABLE IF NOT EXISTS sales_transactions (
  id TEXT PRIMARY KEY,
  timestamp BIGINT,
  date TEXT,
  time TEXT,
  staff_id TEXT,
  staff_name TEXT,
  client_name TEXT,
  service_name TEXT,
  service_price NUMERIC(10,2) DEFAULT 0,
  products_total NUMERIC(10,2) DEFAULT 0,
  tip_amount NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT DEFAULT 'card',
  items JSONB DEFAULT '[]',
  settled BOOLEAN DEFAULT FALSE,
  payout_status TEXT DEFAULT 'pending',
  settlement_id TEXT,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: payroll_settlements (liquidaciones de nómina)
-- ============================================================
CREATE TABLE IF NOT EXISTS payroll_settlements (
  id TEXT PRIMARY KEY,
  timestamp BIGINT,
  date TEXT,
  staff_id TEXT,
  staff_name TEXT,
  period_label TEXT,
  start_date TEXT,
  end_date TEXT,
  transaction_ids JSONB DEFAULT '[]',
  gross_amount NUMERIC(10,2) DEFAULT 0,
  commission_rate INTEGER DEFAULT 50,
  net_payout NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: retail_products (inventario de productos)
-- ============================================================
CREATE TABLE IF NOT EXISTS retail_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  image TEXT,
  description TEXT,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES para búsquedas frecuentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cal_apts_date ON calendar_appointments(date);
CREATE INDEX IF NOT EXISTS idx_cal_apts_staff ON calendar_appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_cal_apts_status ON calendar_appointments(status);
CREATE INDEX IF NOT EXISTS idx_client_bookings_email ON client_bookings(client_email);
CREATE INDEX IF NOT EXISTS idx_clients_crm_email ON clients_crm(email);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_transactions(date);
CREATE INDEX IF NOT EXISTS idx_sales_staff ON sales_transactions(staff_id);

-- ============================================================
-- Mensaje de confirmación
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE 'Styluu schema creado exitosamente. Tablas listas: venues, staff_members, calendar_appointments, client_bookings, clients_crm, sales_transactions, payroll_settlements, retail_products';
END $$;
