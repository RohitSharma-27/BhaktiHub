import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Music,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  X,
  Mail,
  MapPin,
  MessageSquare,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  fetchAllArtists,
  updateArtistAvailability,
} from '../lib/localApi';

import {
  fetchAllBookings,
  updateBookingStatus,
} from '../lib/localApi';
import type { Artist, Booking } from '../types';
import { formatDate } from '../lib/utils';
import { FullPageSpinner } from '../components/ui/Spinner';

type Tab = 'overview' | 'artists' | 'bookings';

const statusConfig = {
  pending: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50', label: 'Pending' },
  confirmed: { icon: CheckCircle2, color: 'text-green-600 bg-green-50', label: 'Confirmed' },
  completed: { icon: CheckCircle2, color: 'text-blue-600 bg-blue-50', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Cancelled' },
};

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      toast('Admin access required', 'error');
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    setLoading(true);
    Promise.all([fetchAllArtists(), fetchAllBookings()])
  .then(([a, b]) => {
    setArtists(a);
    setBookings(b);
      })
      .catch(() => toast('Failed to load admin data', 'error'))
      .finally(() => setLoading(false));
  }, [user, isAdmin, toast]);

  const handleToggleAvailability = async (artistId: string, current: boolean) => {
    try {
      await updateArtistAvailability(artistId, !current);
      setArtists((prev) => prev.map((a) => a.id === artistId ? { ...a, available: !current } : a));
      toast('Artist availability updated', 'success');
    } catch {
      toast('Failed to update availability', 'error');
    }
  };

  const handleBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
      toast(`Booking ${status}`, 'success');
    } catch {
      toast('Failed to update booking', 'error');
    }
  };

  if (authLoading || loading) return <div className="pt-20"><FullPageSpinner /></div>;
  if (!user || !isAdmin) return null;

  const stats = [
    { label: 'Total Artists', value: artists.length, icon: Music, color: 'bg-saffron-50 text-saffron-600' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Requests', value: bookings.filter((b) => b.status === 'pending').length, icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },

  ];

  const tabs = [
    { key: 'overview' as Tab, label: 'Overview' },
    { key: 'artists' as Tab, label: 'Artists' },
    { key: 'bookings' as Tab, label: 'Bookings' },
   
  ];

  return (
    <div className="pt-20 lg:pt-24">
      <div className="bg-cream-100/50 border-b border-cream-200">
        <div className="container-page py-10 lg:py-14">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">Admin Panel</h1>
          <p className="text-neutral-500 mt-1">Manage artists and bookings</p>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-cream-200 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key ? 'border-saffron-500 text-saffron-700' : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="card p-5">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="font-display text-3xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-4">Recent Bookings</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => {
                  const status = statusConfig[booking.status];
                  const StatusIcon = status.icon;
                  return (
                    <div key={booking.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-cream-50">
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{booking.artist_name}</p>
                        <p className="text-sm text-neutral-500">{booking.event_type} · {formatDate(booking.event_date)}</p>
                      </div>
                      <span className={`chip ${status.color} shrink-0`}>
                        <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                      </span>
                    </div>
                  );
                })}
                {bookings.length === 0 && <p className="text-neutral-500 text-center py-4">No bookings yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* Artists */}
        {tab === 'artists' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700">Artist</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700">City</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700">Rating</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {artists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-cream-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={artist.image_url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                          <span className="font-medium text-neutral-900">{artist.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 capitalize">{artist.category}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{artist.city}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600"> {artist.rating}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAvailability(artist.id, artist.available)}
                          className="flex items-center gap-1.5 text-sm"
                        >
                          {artist.available ? (
                            <ToggleRight className="w-8 h-8 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-neutral-400" />
                          )}
                          <span className={artist.available ? 'text-green-600' : 'text-neutral-400'}>
                            {artist.available ? 'Available' : 'Unavailable'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">No bookings yet</h3>
                <p className="text-neutral-500">Booking requests will appear here</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const status = statusConfig[booking.status];
                const StatusIcon = status.icon;
                return (
                  <div key={booking.id} className="card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={booking.artist_image || 'https://images.pexels.com/photos/7092658/pexels-photo-7092658.jpeg?auto=compress&cs=tinysrgb&w=200'}
                          alt={booking.artist_name}
                          className="w-14 h-14 rounded-xl object-cover bg-cream-200"
                        />
                        <div>
                          <h3 className="font-display text-lg font-bold text-neutral-900">{booking.artist_name}</h3>
                          <p className="text-sm text-neutral-500">
                            {booking.event_type} · {formatDate(booking.event_date)} · {booking.event_city}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">
  Requested by: {booking.user_name || 'User'}
</p>

<p className="text-xs text-neutral-400 mt-0.5">
  Email: {booking.user_email || 'Not available'}
</p>
                        </div>
                      </div>
                     <div className="flex items-center gap-3">
  <span className={`chip ${status.color}`}>
    <StatusIcon className="w-3.5 h-3.5" /> {status.label}
  </span>

  <button
    onClick={() => setSelectedBooking(booking)}
    className="px-3 py-1.5 rounded-lg bg-saffron-50 text-saffron-700 text-sm font-medium hover:bg-saffron-100"
  >
    View Details
  </button>

  {booking.status === 'pending' && (
    <div className="flex gap-2">
      <button
        onClick={() => handleBookingStatus(booking.id, 'confirmed')}
        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100"
      >
        Confirm
      </button>

      <button
        onClick={() => handleBookingStatus(booking.id, 'cancelled')}
        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100"
      >
        Reject
      </button>
    </div>
  )}

  {booking.status === 'confirmed' && (
    <button
      onClick={() => handleBookingStatus(booking.id, 'completed')}
      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100"
    >
      Mark Complete
    </button>
  )}
</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {selectedBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-900 shadow-2xl border border-saffron-700/30">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Booking Request
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Complete booking request details
          </p>
        </div>

        <button
          onClick={() => setSelectedBooking(null)}
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Booking Details */}
      <div className="p-6 space-y-6">

        {/* Artist */}
        <div className="flex items-center gap-4">
          <img
            src={selectedBooking.artist_image}
            alt={selectedBooking.artist_name}
            className="w-16 h-16 rounded-xl object-cover bg-cream-200"
          />

          <div>
            <p className="text-xs text-neutral-400 mb-1">
              Artist
            </p>
            <h3 className="font-display text-xl font-bold text-white">
              {selectedBooking.artist_name}
            </h3>
          </div>
        </div>

        {/* User Information */}
        <div className="rounded-xl bg-neutral-800/70 p-5">
          <h3 className="font-semibold text-white mb-4">
            Customer Information
          </h3>

          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <UserRound className="w-4 h-4 text-saffron-500" />
              <div>
                <p className="text-xs text-neutral-400">Name</p>
                <p className="text-sm text-neutral-200">
                  {selectedBooking.user_name || 'Not available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-saffron-500" />
              <div>
                <p className="text-xs text-neutral-400">Email</p>
                <p className="text-sm text-neutral-200">
                  {selectedBooking.user_email || 'Not available'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Event Information */}
        <div className="rounded-xl bg-neutral-800/70 p-5">
          <h3 className="font-semibold text-white mb-4">
            Event Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-neutral-400 mb-1">
                Event Date
              </p>
              <p className="text-sm text-neutral-200">
                {formatDate(selectedBooking.event_date)}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-1">
                Event Type
              </p>
              <p className="text-sm text-neutral-200">
                {selectedBooking.event_type}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-saffron-500 mt-0.5" />
              <div>
                <p className="text-xs text-neutral-400 mb-1">
                  Event City
                </p>
                <p className="text-sm text-neutral-200">
                  {selectedBooking.event_city}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-1">
                Request Sent On
              </p>
              <p className="text-sm text-neutral-200">
                {formatDate(selectedBooking.created_at)}
              </p>
            </div>

          </div>

          {/* Address */}
          <div className="mt-4 pt-4 border-t border-neutral-700">
            <p className="text-xs text-neutral-400 mb-1">
              Event Address
            </p>
            <p className="text-sm text-neutral-200">
              {selectedBooking.event_address || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="rounded-xl bg-neutral-800/70 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-saffron-500" />
            <h3 className="font-semibold text-white">
              Customer Message
            </h3>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {selectedBooking.message || 'No message provided.'}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 mb-1">
              Current Status
            </p>

            <span className={`chip ${statusConfig[selectedBooking.status].color}`}>
              {statusConfig[selectedBooking.status].label}
            </span>
          </div>

          <div className="flex gap-2">

            {selectedBooking.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    handleBookingStatus(selectedBooking.id, 'cancelled');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100"
                >
                  Reject
                </button>

                <button
                  onClick={() => {
                    handleBookingStatus(selectedBooking.id, 'confirmed');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100"
                >
                  Confirm
                </button>
              </>
            )}

            {selectedBooking.status === 'confirmed' && (
              <button
                onClick={() => {
                  handleBookingStatus(selectedBooking.id, 'completed');
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100"
              >
                Mark Complete
              </button>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 text-sm font-medium hover:bg-neutral-600"
            >
              Close
            </button>

          </div>
        </div>

      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
