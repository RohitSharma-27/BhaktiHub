import { sampleArtists } from '../data/sampleData';
import type {
  Artist,
  ArtistCategory,
  ArtistFilters,
  PaginatedResult,
  Booking,
} from '../types';
export async function fetchFeaturedArtists(limit = 3): Promise<Artist[]> {
  return sampleArtists
    .filter((artist) => artist.category === "singer")
    .slice(0, limit);
}
export async function fetchArtistById(id: string): Promise<Artist | null> {
  const artist = sampleArtists.find(
  artist => artist.id === id
);

  if (!artist) {
    return null;
  }

  return {
  ...artist,
  created_at: new Date().toISOString(),
};
}
export async function fetchArtists(
  filters: ArtistFilters
): Promise<PaginatedResult<Artist>> {

let artists = [...sampleArtists];

  if (filters.category !== "all") {
    artists = artists.filter(
      artist => artist.category === filters.category
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();

    artists = artists.filter(
      artist =>
        artist.name.toLowerCase().includes(search) ||
        artist.city.toLowerCase().includes(search) ||
        artist.subcategory.toLowerCase().includes(search)
    );
  }

  return {
    items: artists,
    total: artists.length,
    page: 1,
    pageSize: artists.length,
    totalPages: 1,
  };
}
export async function fetchArtistsByCategory(
  category: ArtistCategory,
  limit = 3
): Promise<Artist[]> {
  return sampleArtists
    .filter((artist) => artist.category === category)
    .slice(0, limit);
}
export async function fetchAllArtists(): Promise<Artist[]> {
  return sampleArtists;
}

export async function updateArtistAvailability(
  artistId: string,
  available: boolean
): Promise<void> {
  const artist = sampleArtists.find(
    (artist) => artist.id === artistId
  );

  if (artist) {
    artist.available = available;
  }
}

// ==================== LOCAL BOOKINGS ====================

const getBookingsKey = (userId: string) => {
  return `bhaktihub_bookings_${userId}`;
};

export async function fetchBookings(userId: string): Promise<Booking[]> {
  const key = getBookingsKey(userId);

  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as Booking[];
  } catch {
    return [];
  }
}

export async function createBooking(
  userId: string,
  userName: string,
  userEmail: string,
  artistId: string,
  booking: Omit<
    Booking,
    | 'id'
    | 'user_id'
    | 'user_name'
    | 'user_email'
    | 'artist_id'
    | 'status'
    | 'created_at'
    | 'artist_name'
    | 'artist_image'
  >,
): Promise<Booking> {
  const artist = sampleArtists.find(
    (artist) => artist.id === artistId
  );

  if (!artist) {
    throw new Error('Artist not found');
  }

  const newBooking: Booking = {
  id: crypto.randomUUID(),
  user_id: userId,
  user_name: userName,
  user_email: userEmail,
  artist_id: artistId,
    artist_name: artist.name,
    artist_image: artist.image_url,
    event_date: booking.event_date,
    event_type: booking.event_type,
    event_city: booking.event_city,
    event_address: booking.event_address,
    message: booking.message ?? '',
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const existingBookings = await fetchBookings(userId);

  localStorage.setItem(
    getBookingsKey(userId),
    JSON.stringify([newBooking, ...existingBookings])
  );

  return newBooking;
}

export async function cancelBooking(
  bookingId: string,
  userId: string,
): Promise<void> {
  const bookings = await fetchBookings(userId);

  const updatedBookings = bookings.map((booking) =>
    booking.id === bookingId
      ? { ...booking, status: 'cancelled' as const }
      : booking
  );

  localStorage.setItem(
    getBookingsKey(userId),
    JSON.stringify(updatedBookings)
  );
}

// ==================== ADMIN BOOKINGS ====================

export async function fetchAllBookings(): Promise<Booking[]> {
  const allBookings: Booking[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (!key || !key.startsWith('bhaktihub_bookings_')) {
      continue;
    }

    try {
      const saved = localStorage.getItem(key);

      if (saved) {
        const bookings = JSON.parse(saved) as Booking[];
        allBookings.push(...bookings);
      }
    } catch {
      // Ignore invalid localStorage data
    }
  }

  return allBookings.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status'],
): Promise<void> {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (!key || !key.startsWith('bhaktihub_bookings_')) {
      continue;
    }

    try {
      const saved = localStorage.getItem(key);

      if (!saved) continue;

      const bookings = JSON.parse(saved) as Booking[];

      const bookingExists = bookings.some(
        (booking) => booking.id === bookingId
      );

      if (!bookingExists) continue;

      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status }
          : booking
      );

      localStorage.setItem(
        key,
        JSON.stringify(updatedBookings)
      );

      return;
    } catch {
      // Continue searching other users
    }
  }

  throw new Error('Booking not found');
}