import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Heart } from 'lucide-react';
import type { Artist } from '../../types';
import { formatPrice } from '../../lib/utils';
import Rating from '../ui/Rating';

interface ArtistCardProps {
  artist: Artist;
  isFavorite: boolean;
  onToggleFavorite: (artistId: string) => void;
}

export default function ArtistCard({
  artist,
  isFavorite,
  onToggleFavorite,
}: ArtistCardProps) {
  return (
    <div className="card group relative border border-cream-200/70 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <Link
        to={`/artist/${artist.id}`}
        className="block relative overflow-hidden"
      >
        <div className="h-52 sm:h-56 overflow-hidden bg-cream-200">
          <img
            src={artist.image_url}
            alt={artist.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Verified Badge */}
        {artist.verified && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs sm:text-sm font-semibold text-saffron-700 shadow-soft backdrop-blur-sm">
            <BadgeCheck className="w-4 h-4" />
            Verified
          </span>
        )}

        {/* Unavailable Badge */}
        {!artist.available && (
          <span className="absolute top-14 right-3 inline-flex items-center rounded-full bg-neutral-900/80 px-3 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm">
            Unavailable
          </span>
        )}
      </Link>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(artist.id);
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 shadow-soft flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
        aria-label={
          isFavorite ? 'Remove from favorites' : 'Add to favorites'
        }
      >
        <Heart
          className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-colors ${
            isFavorite
              ? 'fill-red-500 text-red-500'
              : 'text-neutral-400 hover:text-saffron-600'
          }`}
        />
      </button>

      {/* Card Content */}
      <div className="p-4 sm:p-5">

        {/* Artist Name */}
        <Link to={`/artist/${artist.id}`} className="block">
          <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-900 hover:text-saffron-700 transition-colors line-clamp-1">
            {artist.name}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-xs sm:text-sm text-saffron-600 font-semibold mt-1 mb-2">
          {artist.subcategory}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 mb-4">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-saffron-500 shrink-0" />
          <span className="line-clamp-1">
            {artist.city}, {artist.state}
          </span>
        </div>

        {/* Experience & Events */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <div>
            <p className="text-[11px] sm:text-xs text-neutral-400 uppercase tracking-wide">
              Experience
            </p>
            <p className="font-semibold text-sm sm:text-base text-neutral-800 mt-1">
              {artist.experience_years}+ Years
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] sm:text-xs text-neutral-400 uppercase tracking-wide">
              Events
            </p>
            <p className="font-semibold text-sm sm:text-base text-neutral-800 mt-1">
              {artist.events_done}+
            </p>
          </div>

        </div>

        {/* Rating */}
        <div className="mb-4 pb-4 border-b border-cream-200">
          <Rating
            value={artist.rating}
            size="sm"
          />
        </div>

        {/* Price + Profile Button */}
        <div className="flex items-end justify-between gap-3">

          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-neutral-400">
              Booking Starts From
            </p>

            <p className="font-display text-lg sm:text-xl font-bold text-neutral-900 mt-0.5">
              {formatPrice(artist.price_from)}
            </p>
          </div>

          <Link
            to={`/artist/${artist.id}`}
            className="shrink-0 inline-flex items-center justify-center rounded-xl bg-saffron-50 text-saffron-700 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-saffron-100 hover:shadow-soft transition-all"
          >
            View Profile
          </Link>

        </div>

      </div>
    </div>
  );
}