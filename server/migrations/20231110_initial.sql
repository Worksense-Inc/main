-- Initial schema for Worksense scheduling app
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('manager','employee')),
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Shifts table
CREATE TABLE IF NOT EXISTS public.shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  position text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('scheduled','open','completed','cancelled')),
  notes text,
  created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  assigned_to uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shift_time_valid CHECK (end_time > start_time)
);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON public.shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON public.shifts(status);

-- Time off requests
CREATE TABLE IF NOT EXISTS public.time_off_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT time_off_range_valid CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS idx_time_off_employee ON public.time_off_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_off_status ON public.time_off_requests(status);

-- Shift swap requests
CREATE TABLE IF NOT EXISTS public.shift_swap_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
  requesting_employee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  original_employee_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied','cancelled')),
  approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_swap_shift ON public.shift_swap_requests(shift_id);
CREATE INDEX IF NOT EXISTS idx_swap_status ON public.shift_swap_requests(status);

-- Audit trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER shifts_updated_at BEFORE UPDATE ON public.shifts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER time_off_updated_at BEFORE UPDATE ON public.time_off_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
