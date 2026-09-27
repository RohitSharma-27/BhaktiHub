import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Star } from 'lucide-react';
import type { Artist, ArtistCategory, ArtistFilters } from '../../types';
import { fetchArtists } from '../../lib/localApi';
import { fetchCities } from '../../lib/api';
import ArtistCard from './ArtistCard';
import Pagination from '../ui/Pagination';
import { GridSkeleton } from '../ui/Spinner';
import { useFavorites } from '../../hooks/useFavorites';
import { useToast } from '../../context/ToastContext';

interface ArtistListingPageProps {
  category: ArtistCategory;
  title: string;
  subtitle: string;
}

const PAGE_SIZE = 6;

export default function ArtistListingPage({ category, title, subtitle }: ArtistListingPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [city, setCity] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<ArtistFilters['sortBy']>('rating');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters: ArtistFilters = {
      search,
      city,
      category,
      minRating,
      sortBy,
      page,
      pageSize: PAGE_SIZE,
    };
    fetchArtists(filters)
      .then((result) => {
        setArtists(result.items);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      })
      .catch(() => {
        setArtists([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [search, city, category, minRating, sortBy, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleToggleFavorite = async (artistId: string) => {
    const result = await toggleFavorite(artistId);
    if (result.requiresAuth) {
      toast('Please sign in to save favorites', 'info');
      navigate('/login');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setMinRating(0);
    setSortBy('rating');
    setPage(1);
  };

  const hasActiveFilters = search || city || minRating > 0 || sortBy !== 'rating';

  return (
    <div className="pt-20 lg:pt-24">
      {/* Page Header */}
      <div className="bg-cream-100/50 border-b border-cream-200">
        <div className="container-page py-10 lg:py-14">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900">{title}</h1>
          <p className="text-neutral-500 mt-2">{subtitle}</p>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${title.toLowerCase()} by name, city, or specialty...`}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-300 bg-white outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as ArtistFilters['sortBy']); setPage(1); }}
              className="px-4 py-3 rounded-xl border border-cream-300 bg-white outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 transition-all text-neutral-700"
            >
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline lg:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block mb-8`}>
          <div className="flex flex-wrap items-center gap-4 p-4 bg-cream-100/50 rounded-xl border border-cream-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron-600" />
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-lg border border-cream-300 bg-white text-sm outline-none focus:border-saffron-400"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" />
              <select
                value={minRating}
                onChange={(e) => { setMinRating(Number(e.target.value)); setPage(1); }}
                className="px-3 py-2 rounded-lg border border-cream-300 bg-white text-sm outline-none focus:border-saffron-400"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium">
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
            <span className="ml-auto text-sm text-neutral-500">
              {total} {total === 1 ? 'result' : 'results'} found
            </span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <GridSkeleton count={PAGE_SIZE} />
        ) : artists.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">No artists found</h3>
            <p className="text-neutral-500 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-outline">Clear All Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist, index) => (
  <ArtistCard
    key={artist.id}
    artist={artist}
    isFavorite={favoriteIds.has(artist.id)}
    onToggleFavorite={handleToggleFavorite}
    priority={index < 3}
  />
))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
