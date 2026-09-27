import emailjs from '@emailjs/browser';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  BadgeCheck,
  Clock,
  Award,
  Heart,
  Calendar,
  Music,
  CheckCircle2,
  ArrowLeft,
  Phone,
} from 'lucide-react';

import { useAsync } from '../hooks/useAsync';
import { fetchArtistById, createBooking } from '../lib/localApi';
import type { Artist } from '../types';
import Rating from '../components/ui/Rating';
import Modal from '../components/ui/Modal';
import { FullPageSpinner } from '../components/ui/Spinner';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../lib/utils';

const isValidIndianPhone = (phone: string) => {
  const value = phone.trim();

  if (!/^[6-9]\d{9}$/.test(value)) {
    return false;
  }

  // Reject numbers like 8888888888, 9999999999, etc.
  if (/^(\d)\1{9}$/.test(value)) {
    return false;
  }

  // Reject obvious test/sequential numbers
  const fakeNumbers = [
    '0123456789',
    '1234567890',
    '0987654321',
    '9876543210',
  ];

  return !fakeNumbers.includes(value);
};

const isValidEmail = (email: string) => {
  const value = email.trim();

  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value);
};

export default function ArtistDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    event_date: '',
    event_type: '',
    event_city: '',
    event_address: '',
    message: '',
  });

  const [contactOpen, setContactOpen] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const { data: artist, loading } = useAsync<Artist | null>(
    () => fetchArtistById(id!),
    [id]
  );

  if (loading) {
    return (
      <div className="pt-20">
        <FullPageSpinner />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="pt-20 min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
            Artist Not Found
          </h2>

          <p className="text-neutral-500 mb-4">
            The artist you're looking for doesn't exist.
          </p>

          <Link to="/singers" className="btn-primary">
            Browse Artists
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favoriteIds.has(artist.id);

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(artist.id);

    if (result.requiresAuth) {
      toast('Please sign in to save favorites', 'info');
      navigate('/login');
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast('Please sign in to book an artist', 'info');
      navigate('/login');
      return;
    }

    setBookingOpen(false);
    setContactOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast('Please sign in to continue', 'info');
      navigate('/login');
      return;
    }

   const email = contactForm.email.trim();
const phone = contactForm.phone.trim();

if (!isValidEmail(email)) {
  toast('Please enter a valid email address.', 'error');
  return;
}

if (!isValidIndianPhone(phone)) {
  toast('Please enter a valid 10-digit mobile number.', 'error');
  return;
}

setSubmitting(true);

try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing.');
      }

      // Format event date as: 1 October 2026
      const [year, month, day] = bookingForm.event_date.split('-');

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const formattedEventDate =
        day && month && year
          ? `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`
          : bookingForm.event_date;

      // Confirmation email
      const confirmSubject = `Booking Confirmed - ${artist.name}`;

      const confirmBody = `Hello ${contactForm.name},

Your booking request for ${artist.name} has been confirmed.

Booking Details:
Artist: ${artist.name}
Event Date: ${formattedEventDate}
Event Type: ${bookingForm.event_type}
City: ${bookingForm.event_city}
Venue: ${bookingForm.event_address}

Artist Contact Details:
Phone: PLEASE ADD ARTIST PHONE NUMBER BEFORE SENDING

Thank you for choosing BhaktiHub.

BhaktiHub
Devotional Artist Booking`;

      // Rejection email
      const rejectSubject = `Booking Request Update - ${artist.name}`;

      const rejectBody = `Hello ${contactForm.name},

We are sorry, but your booking request for ${artist.name} could not be confirmed.

Booking Details:
Artist: ${artist.name}
Event Date: ${formattedEventDate}
Event Type: ${bookingForm.event_type}
City: ${bookingForm.event_city}
Venue: ${bookingForm.event_address}

Please contact us if you would like to discuss alternative options.

BhaktiHub
Devotional Artist Booking`;

      // Open Gmail compose with pre-filled recipient,
      // subject and message.
      const confirmLink =
        `https://mail.google.com/mail/u/2/?view=cm&fs=1` +
        `&to=${encodeURIComponent(contactForm.email)}` +
        `&su=${encodeURIComponent(confirmSubject)}` +
        `&body=${encodeURIComponent(confirmBody)}`;

      const rejectLink =
        `https://mail.google.com/mail/u/2/?view=cm&fs=1` +
        `&to=${encodeURIComponent(contactForm.email)}` +
        `&su=${encodeURIComponent(rejectSubject)}` +
        `&body=${encodeURIComponent(rejectBody)}`;

      // Send booking request to admin
      await emailjs.send(
        serviceId,
        templateId,
        {
          customer_name: contactForm.name.trim(),
customer_email: email,
customer_phone: phone,
          artist_name: artist.name,

          event_date: bookingForm.event_date,
          event_type: bookingForm.event_type,
          event_city: bookingForm.event_city,
          event_address: bookingForm.event_address,

          message: bookingForm.message || 'No message provided.',

          confirm_link: confirmLink,
          reject_link: rejectLink,
        },
        {
          publicKey,
        }
      );

      // Save booking only after admin email is successfully sent
     await createBooking(
  user.id,
  contactForm.name.trim(),
  email,
  artist.id,
  bookingForm
);
      toast(
        'Booking request sent successfully. You will receive confirmation through email.',
        'success'
      );

      setContactOpen(false);

      setBookingForm({
        event_date: '',
        event_type: '',
        event_city: '',
        event_address: '',
        message: '',
      });

      setContactForm({
        name: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      console.error('BOOKING EMAIL ERROR:', error);

      toast(
        'Failed to send your booking request. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 lg:pt-24 overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="container-page py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-saffron-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Gallery */}
      <div className="container-page">
        <div className="mb-8 rounded-2xl overflow-hidden bg-cream-200 aspect-[4/3] sm:aspect-[16/8]">
          <img
  src={artist.image_url}
  alt={artist.name}
  className="w-full h-full object-cover object-[50%_32%]"
/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">

                {artist.verified && (
                  <span className="chip bg-saffron-50 text-saffron-700">
                    <BadgeCheck className="w-4 h-4" />
                    Verified Artist
                  </span>
                )}

                <span
                  className={`chip ${
                    artist.available
                      ? 'bg-green-50 text-green-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {artist.available
                    ? 'Available'
                    : 'Currently Unavailable'}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 break-words">
                {artist.name}
              </h1>

              <p className="text-base sm:text-lg text-saffron-600 font-medium mb-3">
                {artist.subcategory}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-saffron-500 shrink-0" />
                  <span>
                    {artist.city}, {artist.state}
                  </span>
                </span>

                <Rating value={artist.rating} />
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
                About
              </h2>

              <p className="text-neutral-600 leading-relaxed">
                {artist.bio}
              </p>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
                {artist.category === 'singer'
                  ? 'Bhajans Include'
                  : artist.category === 'musician'
                    ? 'Performance Services'
                    : 'Ideal For'}
              </h2>

              <div className="flex flex-wrap gap-2">
                {artist.specialties.map((s) => (
                  <span
                    key={s}
                    className="chip bg-cream-100 text-neutral-700 border border-cream-200"
                  >
                    <Music className="w-3.5 h-3.5 text-saffron-500 shrink-0" />
                    <span className="break-words">{s}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience & Stats */}
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">
                Experience & Stats
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                <div className="card p-4 text-center">
                  <Clock className="w-6 h-6 text-saffron-500 mx-auto mb-2" />

                  <p className="font-display text-2xl font-bold text-neutral-900">
                    {artist.experience_years}+
                  </p>

                  <p className="text-sm text-neutral-500">
                    Years Exp.
                  </p>
                </div>

                <div className="card p-4 text-center">
                  <Award className="w-6 h-6 text-saffron-500 mx-auto mb-2" />

                  <p className="font-display text-2xl font-bold text-neutral-900">
                    {artist.events_done}+
                  </p>

                  <p className="text-sm text-neutral-500">
                    Events Done
                  </p>
                </div>

                <div className="card p-4 text-center">
                  <Star className="w-6 h-6 text-gold-500 mx-auto mb-2" />

                  <p className="font-display text-2xl font-bold text-neutral-900">
                    {artist.rating}
                  </p>

                  <p className="text-sm text-neutral-500">
                    Rating
                  </p>
                </div>

              </div>
            </div>

            {/* Category Specific Information */}

            {artist.category === 'singer' && (
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
                  Languages
                </h2>

                <div className="flex flex-wrap gap-2">
                  {artist.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="chip bg-saffron-50 text-saffron-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {artist.category === 'musician' && (
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
                  Instruments Included
                </h2>

                <div className="flex flex-wrap gap-2">
                  {artist.instruments?.map((item) => (
                    <span
                      key={item}
                      className="chip bg-saffron-50 text-saffron-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {artist.category === 'sound' && (
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
                  Speaker Boxes Available
                </h2>

                <div className="flex flex-wrap gap-2">
                  {artist.speakerBoxes?.map((item) => (
                    <span
                      key={item}
                      className="chip bg-saffron-50 text-saffron-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Booking Card */}
              <div className="card p-5 sm:p-6">
                <div className="mb-5">

                  <p className="text-sm text-neutral-400">
                    Booking Starts From
                  </p>

                  <p className="font-display text-3xl font-bold text-neutral-900">
                    {formatPrice(artist.price_from)}
                  </p>

                  <p className="text-sm text-neutral-500">
                    per event
                  </p>
                </div>

                <div className="space-y-3 mb-6 text-sm">

                  <div className="flex items-start gap-2 text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Verified Artist</span>
                  </div>

                  <div className="flex items-start gap-2 text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>
                      {artist.events_done}+ events completed
                    </span>
                  </div>

                </div>

                <button
                  onClick={() => setBookingOpen(true)}
                  disabled={!artist.available}
                  className="btn-primary w-full mb-3"
                >
                  <Calendar className="w-5 h-5" />
                  Request Booking
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className={`btn w-full mt-1 px-6 py-3 border-2 transition-colors ${
                    isFavorite
                      ? 'border-red-500 text-red-600 bg-red-50'
                      : 'border-cream-300 text-neutral-700 hover:bg-cream-100'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-red-500' : ''
                    }`}
                  />
                  {isFavorite
                    ? 'Saved to Favorites'
                    : 'Add to Favorites'}
                </button>
              </div>

              {/* Contact Info */}
              <div className="card p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-3 text-sm">

                  <p className="flex items-start gap-2 text-neutral-600">
                    <Phone className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />

                   <span className="font-medium text-sm leading-6 min-w-0 break-words">
  Included in the booking confirmation email
</span>
                  </p>

                  <p className="flex items-start gap-2 text-neutral-600">
                    <MapPin className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />

                    <span className="min-w-0 break-words">
                      {artist.city}, {artist.state}
                    </span>
                  </p>

                </div>

                <p className="text-xs text-neutral-400 mt-4 pt-4 border-t border-cream-200 leading-relaxed">
                  Contact details are shared only after the booking is confirmed.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={`Book ${artist.name}`}
      >
        <form
          onSubmit={handleBooking}
          className="space-y-4 max-h-[70vh] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0"
        >

          <div>
            <label className="label-field">
              Event Date
            </label>

            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={bookingForm.event_date}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  event_date: e.target.value,
                })
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">
              Event Type
            </label>

            <select
              required
              value={bookingForm.event_type}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  event_type: e.target.value,
                })
              }
              className="input-field"
            >
              <option value="">
                Select event type
              </option>

              <option value="Bhajan Sandhya">
                Bhajan Sandhya
              </option>

              <option value="Kirtan">
                Kirtan
              </option>

              <option value="Temple Festival">
                Temple Festival
              </option>

              <option value="Private Kirtan">
                Private Kirtan
              </option>

              

              <option value="Janmashtami">
                Janmashtami
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="label-field">
              Event City
            </label>

            <input
              type="text"
              required
              value={bookingForm.event_city}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  event_city: e.target.value,
                })
              }
              placeholder="e.g., Varanasi"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">
              Event Address
            </label>

            <textarea
              required
              value={bookingForm.event_address}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  event_address: e.target.value,
                })
              }
              placeholder="Full venue address"
              rows={2}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">
              Message (Optional)
            </label>

            <textarea
              value={bookingForm.message}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  message: e.target.value,
                })
              }
              placeholder="Any specific requirements or details..."
              rows={3}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setBookingOpen(false)}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>

          {!user && (
            <p className="text-sm text-saffron-600 text-center">
              Sign in to submit your booking request securely.
            </p>
          )}

        </form>
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Complete Your Booking Request"
      >
        <form
          onSubmit={handleContactSubmit}
          className="space-y-4 max-h-[70vh] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0"
        >

          <p className="text-sm text-neutral-500">
            Please provide your contact details.
          </p>

          <div>
            <label className="label-field">
              Full Name
            </label>

            <input
              type="text"
              required
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  name: e.target.value,
                })
              }
              placeholder="Your full name"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">
              Email
            </label>

           <input
  type="email"
  required
  value={contactForm.email}
  onChange={(e) =>
    setContactForm({
      ...contactForm,
      email: e.target.value,
    })
  }
  placeholder="you@example.com"
  pattern="[^\s@]+@[^\s@]+\.[A-Za-z]{2,}"
  title="Please enter a valid email address, for example: name@gmail.com"
  className="input-field"
/>
          </div>

          <div>
            <label className="label-field">
              Phone Number
            </label>

            <input
  type="tel"
  required
  value={contactForm.phone}
  onChange={(e) =>
  setContactForm({
    ...contactForm,
    phone: e.target.value.replace(/\D/g, '').slice(0, 10),
  })
}
  placeholder="Enter 10-digit mobile number"
  minLength={10}
  maxLength={10}
  pattern="[6-9][0-9]{9}"
  title="Please enter a valid 10-digit number"
  inputMode="numeric"
  className="input-field"
/>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="btn-ghost flex-1"
            >
              Later
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Sending...' : 'Send Details'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}