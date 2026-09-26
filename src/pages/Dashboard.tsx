import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchBookings } from '../lib/localApi';
import { sampleArtists } from '../data/sampleData';
import type { Artist, Booking } from '../types';
import ArtistCard from '../components/shared/ArtistCard';
import { useFavorites } from '../hooks/useFavorites';
import { formatDate } from '../lib/utils';
import { FullPageSpinner } from '../components/ui/Spinner';

type Tab = 'favorites' | 'bookings';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [tab, setTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<Artist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    fetchBookings(user.id)
      .then((books) => {
        setBookings(books);
      })
      .catch(() => {
        toast('Failed to load your bookings', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, toast]);

  useEffect(() => {
    const favoriteArtists = sampleArtists.filter((artist) =>
      favoriteIds.has(artist.id)
    );

    setFavorites(favoriteArtists);
  }, [favoriteIds]);

  const handleToggleFavorite = async (artistId: string) => {
    const result = await toggleFavorite(artistId);

    if (result.requiresAuth) {
      toast('Please sign in to save favorites', 'info');
      navigate('/login');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="pt-20">
        <FullPageSpinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-cream-100/50 border-b border-cream-200">
        <div className="container-page py-10 lg:py-14">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {user.name?.[0]?.toUpperCase() ??
                user.email?.[0]?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                {user.name || 'Welcome'}
              </h1>

             <p className="text-neutral-500 break-words">
  {user.email}
</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-cream-200 overflow-x-auto">
          <button
            onClick={() => setTab('favorites')}
            className={`shrink-0 flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
              tab === 'favorites'
                ? 'border-saffron-500 text-saffron-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorites ({favorites.length})
          </button>

          <button
            onClick={() => setTab('bookings')}
            className={`shrink-0 flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
              tab === 'bookings'
                ? 'border-saffron-500 text-saffron-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            My Bookings ({bookings.length})
          </button>
        </div>

        {/* Favorites Tab */}
        {tab === 'favorites' &&
          (favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-neutral-400" />
              </div>

              <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
                No favorites yet
              </h3>

              <p className="text-neutral-500 mb-4">
                Save artists you love for quick access
              </p>

              <Link to="/singers" className="btn-primary">
                Browse Artists
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  isFavorite={favoriteIds.has(artist.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ))}

        {/* Bookings Tab */}
        {tab === 'bookings' &&
          (bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>

              <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
                No bookings yet
              </h3>

              <p className="text-neutral-500 mb-4">
                Book an artist to see your requests here
              </p>

              <Link to="/singers" className="btn-primary">
                Find an Artist
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="card p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                >
                  {/* Artist Image */}
                  <Link
                    to={`/artist/${booking.artist_id}`}
                    className="shrink-0"
                  >
                    <img
                      src={
                        booking.artist_image ||
                        'https://images.pexels.com/photos/7092658/pexels-photo-7092658.jpeg?auto=compress&cs=tinysrgb&w=200'
                      }
                      alt={booking.artist_name}
                      className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover bg-cream-200"
                    />
                  </Link>

                  {/* Booking Content */}
                  <div className="flex-1 min-w-0">
                    {/* Artist + Request Status */}
                    <div className="mb-3">
                      <Link to={`/artist/${booking.artist_id}`}>
                        <h3 className="font-display text-lg font-bold text-neutral-900 hover:text-saffron-700 transition-colors break-words">
                          {booking.artist_name}
                        </h3>
                      </Link>

                      <p className="mt-1 text-sm text-saffron-600 font-medium leading-5 break-words">
                        Request sent. Please check your email for booking
                        confirmation or updates.
                      </p>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <p className="flex items-start gap-1.5 min-w-0">
                        <Calendar className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />
                        <span className="break-words">
                          {formatDate(booking.event_date)}
                        </span>
                      </p>

                      <p className="flex items-start gap-1.5 min-w-0">
                        <LayoutDashboard className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />
                        <span className="break-words">
                          {booking.event_type}
                        </span>
                      </p>

                      <p className="flex items-start gap-1.5 min-w-0">
                        <MapPin className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />
                        <span className="break-words">
                          {booking.event_city}
                        </span>
                      </p>

                      <p className="flex items-start gap-1.5 min-w-0">
                        <Clock className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />
                        <span className="break-words">
                          Request sent on {formatDate(booking.created_at)}
                        </span>
                      </p>
                    </div>

                    {/* Customer Message */}
                    {booking.message && (
                      <p className="text-sm text-neutral-500 mt-3 italic break-words">
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}