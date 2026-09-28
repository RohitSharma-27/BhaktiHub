/*
# SankirtanHub — Devotional Artist Booking Platform Schema

## Overview
Creates the full database schema for SankirtanHub, India's devotional artist booking platform.
Users can discover Bhajan Singers, Kirtan Mandalis, Musicians, Sound Providers, and Darbar Decorators.

## New Tables

1. **artists** — Devotional artists (singers, musicians, decorators, sound providers)
   - `id` (uuid, PK)
   - `name`, `category`, `subcategory`, `city`, `state`
   - `rating`, `review_count`, `experience_years`, `events_done`
   - `languages` (text[]), `specialties` (text[])
   - `price_from`, `bio`, `short_bio`
   - `image_url`, `gallery` (text[]), `videos` (text[])
   - `verified`, `available`
   - `created_at`

2. **events** — Devotional events and festivals
   - `id` (uuid, PK)
   - `title`, `description`, `date`, `time`, `venue`, `city`
   - `image_url`, `category`, `organizer`, `price_range`
   - `featured` (boolean)
   - `created_at`

3. **testimonials** — User reviews/testimonials (public, read-only)
   - `id` (uuid, PK)
   - `name`, `role`, `city`, `rating`, `text`, `avatar_url`
   - `created_at`

4. **bookings** — Booking requests from users for artists (owner-scoped)
   - `id` (uuid, PK)
   - `user_id` (uuid, FK auth.users, DEFAULT auth.uid())
   - `artist_id` (uuid, FK artists)
   - `event_date`, `event_type`, `event_city`, `event_address`, `message`
   - `status` (enum: pending/confirmed/completed/cancelled)
   - `created_at`

5. **favorites** — User's favorited artists (owner-scoped)
   - `id` (uuid, PK)
   - `user_id` (uuid, FK auth.users, DEFAULT auth.uid())
   - `artist_id` (uuid, FK artists)
   - `created_at`
   - UNIQUE constraint on (user_id, artist_id)

## Security (RLS)
- **artists**: Public read (anon + authenticated), no public write (admin-managed)
- **events**: Public read, no public write
- **testimonials**: Public read, no public write
- **bookings**: Owner-scoped CRUD (authenticated users manage their own bookings)
- **favorites**: Owner-scoped CRUD (authenticated users manage their own favorites)

## Notes
1. Artists, events, and testimonials are public catalog data — readable by everyone (anon + authenticated).
2. Bookings and favorites are private per-user data — only the owner can access their rows.
3. Owner columns on bookings/favorites default to auth.uid() so inserts work without passing user_id.
4. Admin writes to catalog tables would be done via service-role key (server-side), not exposed via RLS.
*/

-- ============ ARTISTS ============
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('singer', 'musician', 'decorator', 'sound')),
  subcategory text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  experience_years integer NOT NULL DEFAULT 0,
  languages text[] NOT NULL DEFAULT '{}',
  specialties text[] NOT NULL DEFAULT '{}',
  price_from integer NOT NULL DEFAULT 0,
  bio text NOT NULL,
  short_bio text NOT NULL,
  image_url text NOT NULL,
  gallery text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  events_done integer NOT NULL DEFAULT 0,
  verified boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artists_category ON artists(category);
CREATE INDEX IF NOT EXISTS idx_artists_city ON artists(city);
CREATE INDEX IF NOT EXISTS idx_artists_rating ON artists(rating DESC);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_artists" ON artists;
CREATE POLICY "public_read_artists"
ON artists FOR SELECT
TO anon, authenticated USING (true);

-- ============ EVENTS ============
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  venue text NOT NULL,
  city text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  organizer text NOT NULL,
  price_range text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events"
ON events FOR SELECT
TO anon, authenticated USING (true);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  city text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  avatar_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials"
ON testimonials FOR SELECT
TO anon, authenticated USING (true);

-- ============ BOOKINGS ============
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  event_type text NOT NULL,
  event_city text NOT NULL,
  event_address text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artist_id ON bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings"
ON bookings FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings"
ON bookings FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings"
ON bookings FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings"
ON bookings FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============ FAVORITES ============
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_artist_id ON favorites(artist_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites"
ON favorites FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites"
ON favorites FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites"
ON favorites FOR DELETE
TO authenticated USING (auth.uid() = user_id);
