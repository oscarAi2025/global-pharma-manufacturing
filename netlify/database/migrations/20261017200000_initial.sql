-- Esquema inicial: solicitudes, compradores, fabricantes, emparejamientos, cotizaciones,
-- acuerdos de comisión, pedidos, cobros y auditoría. Nunca se edita una migración aplicada:
-- los cambios van en migraciones nuevas.

create extension if not exists pgcrypto;

create table buyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text,
  country text,
  created_at timestamptz not null default now()
);
create index buyers_email_idx on buyers (lower(email));

create table manufacturing_requests (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  buyer_id uuid not null references buyers(id),
  locale text not null check (locale in ('es','pt','en')),
  product_type text not null,
  dosage_form text not null,
  quantity_text text not null,
  quantity_units integer,
  market text not null,
  formulation text not null,
  timeline text not null,
  details text not null default '',
  query_text text not null default '',
  extracted jsonb not null default '{}',
  missing text[] not null default '{}',
  score integer not null default 0,
  score_reasons jsonb not null default '[]',
  classification text not null default 'pending_validation'
    check (classification in ('incomplete','pending_validation','qualified','priority','not_viable','contact_needed')),
  stage text not null default 'lead_received'
    check (stage in ('lead_received','needs_qualification','qualified','manufacturer_matching','manufacturer_contacted',
      'nda_pending','rfq_submitted','quote_received','quote_presented','negotiation','contract_signed',
      'production_initiated','order_invoiced','commission_due','commission_paid','lost')),
  consent_at timestamptz not null,
  source jsonb not null default '{}',
  portal_token_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index requests_stage_idx on manufacturing_requests (stage);
create index requests_created_idx on manufacturing_requests (created_at desc);

create table request_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references manufacturing_requests(id) on delete cascade,
  kind text not null default 'note' check (kind in ('note','task','buyer_message')),
  body text not null,
  due_at date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table manufacturers (
  id uuid primary key default gen_random_uuid(),
  internal_name text not null,
  legal_name text,
  country text not null,
  city text,
  website text,
  -- Una empresa registrada en fuentes públicas NO equivale a un fabricante asociado.
  relationship text not null default 'public_source'
    check (relationship in ('public_source','contacted','partner','commission_agreed')),
  verification text not null default 'declared' check (verification in ('declared','verified')),
  capacity_confirmed boolean not null default false,
  dosage_forms text[] not null default '{}',
  services text[] not null default '{}',
  certifications jsonb not null default '[]',
  moq_notes text,
  public_summary text,
  private_notes text,
  contact_name text,
  contact_email text,
  contact_phone text,
  source_url text,
  last_verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table commission_agreements (
  id uuid primary key default gen_random_uuid(),
  manufacturer_id uuid not null references manufacturers(id),
  pct numeric(5,2) not null check (pct > 0 and pct <= 100),
  basis text not null default 'net_invoiced' check (basis in ('net_invoiced','net_collected')),
  recurring_months integer not null default 24 check (recurring_months >= 0),
  covered_operations text not null default '',
  status text not null default 'draft' check (status in ('draft','sent','signed','expired')),
  signed_at date,
  document_ref text,
  notes text,
  created_at timestamptz not null default now()
);

create table match_candidates (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references manufacturing_requests(id) on delete cascade,
  manufacturer_id uuid not null references manufacturers(id),
  status text not null default 'suggested'
    check (status in ('suggested','approved','contacted','nda_pending','rfq_sent','declined')),
  score integer not null default 0,
  reasons jsonb not null default '[]',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (request_id, manufacturer_id)
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references manufacturing_requests(id) on delete cascade,
  manufacturer_id uuid not null references manufacturers(id),
  amount numeric(14,2),
  currency text not null default 'USD',
  moq text,
  lead_time text,
  valid_until date,
  status text not null default 'received' check (status in ('received','presented','accepted','rejected')),
  buyer_summary text,
  notes text,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references manufacturing_requests(id),
  manufacturer_id uuid not null references manufacturers(id),
  agreement_id uuid references commission_agreements(id),
  buyer_id uuid references buyers(id),
  description text not null,
  is_reorder boolean not null default false,
  invoice_ref text,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  invoiced_at date,
  -- Venta acreditada (factura o confirmación del fabricante). Sin acreditar, la comisión es una estimación.
  credited boolean not null default false,
  created_at timestamptz not null default now()
);

create table payments_received (
  id uuid primary key default gen_random_uuid(),
  manufacturer_id uuid not null references manufacturers(id),
  order_id uuid references orders(id),
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'USD',
  received_at date not null,
  reference text,
  created_at timestamptz not null default now()
);

create table portal_tokens (
  token_hash text primary key,
  kind text not null check (kind in ('buyer','manufacturer')),
  request_id uuid references manufacturing_requests(id) on delete cascade,
  manufacturer_id uuid references manufacturers(id),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id bigserial primary key,
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  entity text not null,
  entity_id text,
  data jsonb not null default '{}'
);

-- Libro de comisiones: una línea por pedido, separando estimación de comisión devengada y cobrada.
create view commission_ledger as
select
  o.id as order_id, o.manufacturer_id, m.internal_name as manufacturer, o.request_id, o.description, o.is_reorder,
  o.amount as order_amount, o.currency, o.invoiced_at, o.credited,
  a.id as agreement_id, a.pct, a.status as agreement_status,
  round(o.amount * coalesce(a.pct, 0) / 100, 2) as commission,
  case
    when a.id is null or a.status <> 'signed' then 'no_agreement'
    when not o.credited then 'estimated'
    when coalesce(p.paid, 0) >= round(o.amount * a.pct / 100, 2) then 'paid'
    else 'accrued'
  end as commission_status,
  coalesce(p.paid, 0) as paid
from orders o
join manufacturers m on m.id = o.manufacturer_id
left join commission_agreements a on a.id = o.agreement_id
left join (select order_id, sum(amount) as paid from payments_received where order_id is not null group by order_id) p on p.order_id = o.id;
