-- Seed data for Worksense scheduling app
-- Run this AFTER running 20231110_initial.sql

-- Clear existing data (be careful in production!)
TRUNCATE TABLE public.shift_swap_requests CASCADE;
TRUNCATE TABLE public.time_off_requests CASCADE;
TRUNCATE TABLE public.shifts CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- Insert sample users
-- Password for all users: "password123"
-- Generated with: bcrypt hash at cost 10
INSERT INTO public.users (id, email, first_name, last_name, role, password_hash) VALUES
  -- Managers
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah.manager@worksense.com', 'Sarah', 'Johnson', 'manager', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK'),
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'mike.manager@worksense.com', 'Mike', 'Chen', 'manager', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK'),
  
  -- Employees
  ('c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33', 'john.doe@worksense.com', 'John', 'Doe', 'employee', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK'),
  ('d3bbef99-9c0b-4ef8-bb6d-6bb9bd380a44', 'jane.smith@worksense.com', 'Jane', 'Smith', 'employee', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK'),
  ('e4ccfe99-9c0b-4ef8-bb6d-6bb9bd380a55', 'alex.wilson@worksense.com', 'Alex', 'Wilson', 'employee', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK'),
  ('f5ddae99-9c0b-4ef8-bb6d-6bb9bd380a66', 'emma.davis@worksense.com', 'Emma', 'Davis', 'employee', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK'),
  ('c6eeae99-9c0b-4ef8-bb6d-6bb9bd380a77', 'chris.brown@worksense.com', 'Chris', 'Brown', 'employee', '$2b$10$rKZhMxJqL6/EqG9LZ5VGHuKp8yYqZ7bXxFxQZ.nqWZvYGJ8nO7YZK');

-- Insert sample shifts for the next 2 weeks
INSERT INTO public.shifts (id, shift_date, start_time, end_time, position, status, notes, created_by, assigned_to) VALUES
  -- Week 1: November 11-17, 2025
  ('10000000-0000-0000-0000-000000000001', '2025-11-11', '09:00', '17:00', 'Front Desk', 'scheduled', 'Morning shift', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33'),
  -- Adjusted to avoid overnight (constraint start_time < end_time same day)
  ('10000000-0000-0000-0000-000000000002', '2025-11-11', '17:00', '23:00', 'Security', 'scheduled', 'Evening shift', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd3bbef99-9c0b-4ef8-bb6d-6bb9bd380a44'),
  ('10000000-0000-0000-0000-000000000003', '2025-11-12', '09:00', '17:00', 'Sales Floor', 'open', 'Need coverage', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL),
  ('10000000-0000-0000-0000-000000000004', '2025-11-12', '13:00', '21:00', 'Kitchen', 'scheduled', NULL, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e4ccfe99-9c0b-4ef8-bb6d-6bb9bd380a55'),
  ('10000000-0000-0000-0000-000000000005', '2025-11-13', '08:00', '16:00', 'Front Desk', 'scheduled', 'Early shift', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5ddae99-9c0b-4ef8-bb6d-6bb9bd380a66'),
  -- Adjusted to end before midnight
  ('10000000-0000-0000-0000-000000000006', '2025-11-13', '16:00', '22:00', 'Security', 'scheduled', NULL, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c6eeae99-9c0b-4ef8-bb6d-6bb9bd380a77'),
  ('10000000-0000-0000-0000-000000000007', '2025-11-14', '10:00', '18:00', 'Sales Floor', 'scheduled', NULL, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33'),
  ('10000000-0000-0000-0000-000000000008', '2025-11-14', '12:00', '20:00', 'Kitchen', 'open', 'Weekend coverage needed', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', NULL),
  ('10000000-0000-0000-0000-000000000009', '2025-11-15', '09:00', '17:00', 'Front Desk', 'scheduled', NULL, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd3bbef99-9c0b-4ef8-bb6d-6bb9bd380a44'),
  -- Adjusted to avoid overnight
  ('10000000-0000-0000-0000-000000000010', '2025-11-15', '17:00', '23:00', 'Security', 'scheduled', 'Weekend evening', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4ccfe99-9c0b-4ef8-bb6d-6bb9bd380a55'),
  
  -- Week 2: November 18-24, 2025
  ('10000000-0000-0000-0000-000000000011', '2025-11-18', '09:00', '17:00', 'Front Desk', 'open', 'Need Monday coverage', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL),
  ('10000000-0000-0000-0000-000000000012', '2025-11-19', '10:00', '18:00', 'Sales Floor', 'scheduled', NULL, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f5ddae99-9c0b-4ef8-bb6d-6bb9bd380a66'),
  ('10000000-0000-0000-0000-000000000013', '2025-11-20', '08:00', '16:00', 'Kitchen', 'scheduled', NULL, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c6eeae99-9c0b-4ef8-bb6d-6bb9bd380a77'),
  ('10000000-0000-0000-0000-000000000014', '2025-11-21', '13:00', '21:00', 'Front Desk', 'cancelled', 'Event cancelled', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33'),
  ('10000000-0000-0000-0000-000000000015', '2025-11-22', '09:00', '17:00', 'Sales Floor', 'scheduled', NULL, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd3bbef99-9c0b-4ef8-bb6d-6bb9bd380a44');

-- Insert sample time off requests
INSERT INTO public.time_off_requests (id, employee_id, start_date, end_date, reason, status, reviewed_by, reviewed_at) VALUES
  -- Approved requests
  ('20000000-0000-0000-0000-000000000001', 'c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33', '2025-11-25', '2025-11-27', 'Family vacation', 'approved', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-11-05 10:30:00+00'),
  ('20000000-0000-0000-0000-000000000002', 'e4ccfe99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-12-01', '2025-12-01', 'Medical appointment', 'approved', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-06 14:15:00+00'),
  
  -- Pending requests
  ('20000000-0000-0000-0000-000000000003', 'd3bbef99-9c0b-4ef8-bb6d-6bb9bd380a44', '2025-11-28', '2025-11-29', 'Personal day', 'pending', NULL, NULL),
  ('20000000-0000-0000-0000-000000000004', 'f5ddae99-9c0b-4ef8-bb6d-6bb9bd380a66', '2025-12-15', '2025-12-22', 'Holiday vacation', 'pending', NULL, NULL),
  
  -- Denied request
  ('20000000-0000-0000-0000-000000000005', 'c6eeae99-9c0b-4ef8-bb6d-6bb9bd380a77', '2025-11-16', '2025-11-17', 'Weekend trip', 'denied', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-11-08 09:00:00+00');

-- Insert sample shift swap requests
INSERT INTO public.shift_swap_requests (id, shift_id, requesting_employee_id, original_employee_id, status, approved_by, approved_at) VALUES
  -- Approved swap
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'f5ddae99-9c0b-4ef8-bb6d-6bb9bd380a66', 'c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33', 'approved', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-11-09 11:20:00+00'),
  
  -- Pending swap
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009', 'c6eeae99-9c0b-4ef8-bb6d-6bb9bd380a77', 'd3bbef99-9c0b-4ef8-bb6d-6bb9bd380a44', 'pending', NULL, NULL),
  
  -- Denied swap
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000010', 'c2aade99-9c0b-4ef8-bb6d-6bb9bd380a33', 'e4ccfe99-9c0b-4ef8-bb6d-6bb9bd380a55', 'denied', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-10 16:45:00+00');

-- Verify data was inserted
SELECT 'Users created: ' || COUNT(*)::text FROM public.users;
SELECT 'Shifts created: ' || COUNT(*)::text FROM public.shifts;
SELECT 'Time off requests created: ' || COUNT(*)::text FROM public.time_off_requests;
SELECT 'Shift swap requests created: ' || COUNT(*)::text FROM public.shift_swap_requests;
