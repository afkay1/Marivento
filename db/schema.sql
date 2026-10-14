-- Marivento booking database (Postgres / Neon). Run once.
create table if not exists bookings (
  ref         text primary key,
  created_at  timestamptz not null default now(),
  check_in    date not null,
  check_out   date not null,
  room_slug   text not null,
  status      text not null check (status in ('confirmed', 'pending_payment', 'cancelled')),
  email       text not null,
  data        jsonb not null
);
create index if not exists bookings_dates on bookings (check_in, check_out);
create index if not exists bookings_lookup on bookings (ref, email);

create table if not exists room_blocks (
  id         serial primary key,
  room_slug  text not null,
  date       date not null,
  units      int  not null default 1
);
create index if not exists room_blocks_date on room_blocks (date);
