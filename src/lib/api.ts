import { supabase } from './supabase';
import type { Artist, EventItem, Testimonial, Booking, ArtistCategory, ArtistFilters, PaginatedResult } from '../types';

function mapArtist(row: Record<string, unknown>): Artist {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as ArtistCategory,
    subcategory: row.subcategory as string,
    city: row.city as string,
    state: row.state as string,
    rating: Number(row.rating),
    
    experience_years: row.experience_years as number,
    languages: (row.languages as string[]) ?? [],
    price_from: row.price_from as number,
    bio: row.bio as string,
    short_bio: row.short_bio as string,
    image_url: row.image_url as string,
    
    
    specialties: (row.specialties as string[]) ?? [],
    events_done: row.events_done as number,
    verified: row.verified as boolean,
    available: row.available as boolean,
    created_at: row.created_at as string,
  };
}

export async function fetchArtists(filters: ArtistFilters): Promise<PaginatedResult<Artist>> {
  let query = supabase.from('artists').select('*', { count: 'exact' });

  if (filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.minRating > 0) {
    query = query.gte('rating', filters.minRating);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,subcategory.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
  }

  switch (filters.sortBy) {
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'price-low':
      query = query.order('price_from', { ascending: true });
      break;
    case 'price-high':
      query = query.order('price_from', { ascending: false });
      break;
    case 'experience':
      query = query.order('experience_years', { ascending: false });
      break;
  }

  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const items = (data ?? []).map(mapArtist);
  const total = count ?? 0;
  return {
    items,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.ceil(total / filters.pageSize),
  };
}

export async function fetchFeaturedArtists(limit = 6): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('available', true)
    .order('rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapArtist);
}

export async function fetchArtistsByCategory(category: ArtistCategory, limit = 6): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('category', category)
    .order('rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapArtist);
}

export async function fetchArtistById(id: string): Promise<Artist | null> {
  const { data, error } = await supabase.from('artists').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapArtist(data) : null;
}

export async function fetchCities(): Promise<string[]> {
  const { data, error } = await supabase.from('artists').select('city').order('city');
  if (error) throw error;
  const cities = [...new Set((data ?? []).map((r) => r.city))];
  return cities;
}

export async function fetchEvents(featuredOnly = false): Promise<EventItem[]> {
  let query = supabase.from('events').select('*').order('date', { ascending: true });
  if (featuredOnly) {
    query = query.eq('featured', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as EventItem[];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

// ============ FAVORITES ============

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('artist_id').eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.artist_id as string);
}

export async function fetchFavoriteArtists(userId: string): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('artist_id, artists(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapArtist((r as unknown as { artists: Record<string, unknown> }).artists));
}

export async function addFavorite(userId: string, artistId: string): Promise<void> {
  const { error } = await supabase.from('favorites').insert({ user_id: userId, artist_id: artistId });
  if (error && error.code !== '23505') throw error;
}

export async function removeFavorite(userId: string, artistId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('artist_id', artistId);
  if (error) throw error;
}

// ============ BOOKINGS ============

export async function fetchBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, artists(name, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
 return (data ?? []).map((r) => ({
  id: r.id as string,
  user_id: r.user_id as string,
  user_name: (r as { user_name?: string }).user_name ?? '',
  user_email: (r as { user_email?: string }).user_email ?? '',
  artist_id: r.artist_id as string,
    artist_name: (r as { artists?: { name: string } }).artists?.name ?? '',
    artist_image: (r as { artists?: { image_url: string } }).artists?.image_url ?? '',
    event_date: r.event_date as string,
    event_type: r.event_type as string,
    event_city: r.event_city as string,
    event_address: r.event_address as string,
    message: (r.message as string) ?? '',
    status: r.status as Booking['status'],
    created_at: r.created_at as string,
  }));
}

export async function createBooking(
  userId: string,
  artistId: string,
  booking: Omit<Booking, 'id' | 'user_id' | 'artist_id' | 'status' | 'created_at' | 'artist_name' | 'artist_image'>,
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      artist_id: artistId,
      event_date: booking.event_date,
      event_type: booking.event_type,
      event_city: booking.event_city,
      event_address: booking.event_address,
      message: booking.message,
    })
    .select('*')
    .single();
  if (error) throw error;
  return {
    ...data,
    artist_name: '',
    artist_image: '',
  } as Booking;
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
  if (error) throw error;
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
  if (error) throw error;
}

// ============ ADMIN ============

export async function fetchAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, artists(name, image_url)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
  id: r.id as string,
  user_id: r.user_id as string,
  user_name: (r as { user_name?: string }).user_name ?? '',
  user_email: (r as { user_email?: string }).user_email ?? '',
  artist_id: r.artist_id as string,
    artist_name: (r as { artists?: { name: string } }).artists?.name ?? '',
    artist_image: (r as { artists?: { image_url: string } }).artists?.image_url ?? '',
    event_date: r.event_date as string,
    event_type: r.event_type as string,
    event_city: r.event_city as string,
    event_address: r.event_address as string,
    message: (r.message as string) ?? '',
    status: r.status as Booking['status'],
    created_at: r.created_at as string,
  }));
}

export async function fetchAllArtists(): Promise<Artist[]> {
  const { data, error } = await supabase.from('artists').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapArtist);
}

export async function updateArtistAvailability(artistId: string, available: boolean): Promise<void> {
  const { error } = await supabase.from('artists').update({ available }).eq('id', artistId);
  if (error) throw error;
}
