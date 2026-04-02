-- Run after schema.sql to validate core constraints and idempotency behaviors.

-- 1) Validate plan catalog exists
select id, name from public.plans_catalog order by id;

-- 2) Validate payment webhook idempotency unique key
insert into public.payment_events (event_id, event_type, payload)
values ('evt_test_001', 'invoice_paid', '{"source":"smoke_test"}');

-- Expected to fail with duplicate key if run twice:
-- insert into public.payment_events (event_id, event_type, payload)
-- values ('evt_test_001', 'invoice_paid', '{"source":"smoke_test"}');

-- 3) Validate study session constraints
-- duration_min and focus_score boundaries are enforced by check constraints.
