import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  MapPinned,
  Star,
  ArrowRight,
  Sparkles,
  Music,
  Mic2,
  Volume2,
  Calendar,
  BadgeCheck,
  CalendarCheck,
  IndianRupee,
} from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { fetchFeaturedArtists} from '../lib/localApi';
import {fetchArtistsByCategory } from '../lib/localApi';

import type { Artist } from '../types';
import { sampleArtists } from '../data/sampleData';
import ArtistCard from '../components/shared/ArtistCard';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../context/ToastContext';


import { FullPageSpinner } from '../components/ui/Spinner';

const categories = [
  { key: 'singer', label: 'Bhajan Singers', icon: Mic2, desc: 'Professional Bhajan & Kirtan Artists' },
  { key: 'musician', label: 'Musicians', icon: Music, desc: 'Live Musical Accompaniment' },
  { key: 'sound', label: 'Sound Providers', icon: Volume2, desc: 'Professional Sound & Stage Setup' },
] as const;

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Artist[]>([]);

  const { data: featuredArtists, loading: artistsLoading } = useAsync<Artist[]>(() => fetchFeaturedArtists(3), []);
 const { data: musicians } = useAsync<Artist[]>(
  () => fetchArtistsByCategory('musician', 3),
  []
);
const { data: soundProviders } = useAsync<Artist[]>(
  () => fetchArtistsByCategory('sound', 3),
  []
);
 const getSearchMatches = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return sampleArtists
    .map((artist) => {
      const name = artist.name.toLowerCase();
      const city = artist.city.toLowerCase();
      const state = artist.state.toLowerCase();
      const category = artist.category.toLowerCase();
      const subcategory = artist.subcategory.toLowerCase();

      const specialties = artist.specialties
        .join(' ')
        .toLowerCase();

      const languages = (artist.languages ?? [])
        .join(' ')
        .toLowerCase();

      const instruments = (artist.instruments ?? [])
        .join(' ')
        .toLowerCase();

      const speakerBoxes = (artist.speakerBoxes ?? [])
        .join(' ')
        .toLowerCase();

      // For a single character, search only artist names.
      if (normalizedQuery.length === 1) {
        return name.includes(normalizedQuery)
          ? { artist, score: 100 }
          : null;
      }

      // Name gets the highest priority.
      if (name.includes(normalizedQuery)) {
        return { artist, score: 100 };
      }

      if (city.includes(normalizedQuery)) {
        return { artist, score: 80 };
      }

      if (subcategory.includes(normalizedQuery)) {
        return { artist, score: 70 };
      }

      if (category.includes(normalizedQuery)) {
        return { artist, score: 60 };
      }

      if (specialties.includes(normalizedQuery)) {
        return { artist, score: 50 };
      }

      if (languages.includes(normalizedQuery)) {
        return { artist, score: 40 };
      }

      if (instruments.includes(normalizedQuery)) {
        return { artist, score: 40 };
      }

      if (speakerBoxes.includes(normalizedQuery)) {
        return { artist, score: 40 };
      }

      if (state.includes(normalizedQuery)) {
        return { artist, score: 20 };
      }

      return null;
    })
    .filter(
      (result): result is { artist: Artist; score: number } =>
        result !== null
    )
    .sort((a, b) => b.score - a.score)
    .map((result) => result.artist);
};
  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  const query = searchQuery.trim();

  if (!query) {
    return;
  }

  const matches = getSearchMatches(query);

  if (matches.length === 1) {
    navigate(`/artist/${matches[0].id}`);
    setSearchSuggestions([]);
    return;
  }

  if (matches.length > 1) {
    toast(
      'Multiple results found. Please select an artist from the suggestions.',
      'info'
    );
    return;
  }

  toast('No matching artist or service found.', 'info');
};

  const handleToggleFavorite = async (artistId: string) => {
    const result = await toggleFavorite(artistId);
    if (result.requiresAuth) {
      toast('Please sign in to save favorites', 'info');
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden bg-[#fffaf3] border-b border-[#ead8c0]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff3df] via-[#fffaf3] to-[#fffdf8]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="container-page relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 chip bg-saffron-100 text-saffron-700 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" /> Discover Devotional Artists & Services
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight text-balance animate-slide-up">
              Book India's Best <span className="text-saffron-600">
  Bhajan Singers, Musicians & Sound Providers
</span>
            </h1>
            <p className="text-lg text-neutral-600 mt-6 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Find verified Bhajan Singers, Kirtan Mandalis, Musical Groups and Sound Providers for Bhajan Sandhya, Sankirtan, Bhagwat Katha, Jagran and other devotional events across India.
            </p>

            {/* Search Bar */}
<form
  onSubmit={handleSearch}
  className="mt-8 max-w-2xl mx-auto animate-slide-up"
  style={{ animationDelay: '0.2s' }}
>
  <div className="relative">

    <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-card border border-cream-200">
      <div className="flex-1 flex items-center gap-2 px-4">
        <Search className="w-5 h-5 text-neutral-400 shrink-0" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;

            setSearchQuery(value);

            const query = value.trim().toLowerCase();

            if (!query) {
              setSearchSuggestions([]);
              return;
            }

            const matches = getSearchMatches(value);

setSearchSuggestions(matches.slice(0, 5));
          }}
          placeholder="Search by artist name, city or category..."
          className="w-full py-3 outline-none text-neutral-800 placeholder-neutral-400 bg-transparent"
        />
      </div>

      <button type="submit" className="btn-primary sm:px-8">
        <Search className="w-5 h-5" /> Search
      </button>
    </div>

    {/* Search Suggestions */}
    {searchSuggestions.length > 0 && (
  <div className="mt-2 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card text-left">
        {searchSuggestions.map((artist) => (
          <button
            key={artist.id}
            type="button"
            onClick={() => {
              navigate(`/artist/${artist.id}`);
              setSearchQuery('');
              setSearchSuggestions([]);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-saffron-50 transition-colors"
          >
            <img
              src={artist.image_url}
              alt=""
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />

            <div className="min-w-0">
              <p className="font-semibold text-neutral-900 truncate">
                {artist.name}
              </p>

              <p className="text-xs text-neutral-500">
                {artist.subcategory} · {artist.city}, {artist.state}
              </p>
            </div>

            <ArrowRight className="w-4 h-4 text-saffron-600 ml-auto shrink-0" />
          </button>
        ))}
      </div>
    )}

  </div>
</form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-gold-400 fill-gold-400" /> Growing Artist Network</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-saffron-500" /> Across Multiple Cities</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-saffron-500" /> Book with Confidence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
  id="services"
  className="py-16 lg:py-20 bg-[#fff0dc] border-y border-[#ead8c0]"
>
  <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore Our Services</h2>
            <p className="section-subtitle">Choose from verified Bhajan Singers, Musical Groups and Sound Providers for your next devotional event.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <button
                key={cat.key}
               onClick={() => {
  if (cat.key === 'singer') {
    navigate('/singers');
  } else if (cat.key === 'musician') {
    navigate('/musicians');
  } else if (cat.key === 'sound') {
    navigate('/sound-providers');
  }
}}
                className="card group p-6 text-center hover:shadow-glow hover:-translate-y-1 transition-all last:col-span-2 lg:last:col-span-1 last:justify-self-center last:w-full last:max-w-[calc(50%-0.5rem)] lg:last:max-w-none"
              >
                <div className="w-14 h-14 rounded-2xl bg-saffron-50 group-hover:bg-saffron-gradient flex items-center justify-center mx-auto mb-4 transition-colors">
                  <cat.icon className="w-7 h-7 text-saffron-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-1">{cat.label}</h3>
                <p className="text-sm text-neutral-500">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
     <section className="relative overflow-hidden py-12 lg:py-20 bg-[#fffaf3] border-y border-[#ead8c0]/80">
  <div className="absolute inset-0 bg-temple-pattern opacity-[0.25] pointer-events-none" />
  <div className="absolute top-0 right-0 w-72 h-72 bg-saffron-200/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-200/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-page relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Bhajan Singers</h2>
              <p className="section-subtitle">Verified devotional artists available for booking</p>
            </div>
            <button
              onClick={() => navigate('/singers')}
              className="hidden sm:flex items-center gap-1.5 text-saffron-700 font-semibold hover:gap-2.5 transition-all"
            >
              Explore All Artists  <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {artistsLoading ? (
            <FullPageSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtists?.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  isFavorite={favoriteIds.has(artist.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <button onClick={() => navigate('/singers')} className="btn-outline">
              Explore All Artists <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* Featured Musicians */}
{musicians && musicians.length > 0 && (
  <section className="relative overflow-hidden py-12 lg:py-20 bg-[#fff0dc] border-y border-[#ead8c0]">
  <div className="absolute inset-0 bg-temple-pattern opacity-[0.18] pointer-events-none" />
  <div className="absolute top-10 left-0 w-72 h-72 bg-gold-200/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-64 h-64 bg-saffron-200/10 rounded-full blur-3xl pointer-events-none" />
    <div className="container-page relative z-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="section-title">Featured Musicians</h2>
          <p className="section-subtitle">
            Enhance your devotional event with skilled musicians
          </p>
        </div>

        <button
          onClick={() => navigate('/musicians')}
          className="hidden sm:flex items-center gap-1.5 text-saffron-700 font-semibold hover:gap-2.5 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {musicians.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            isFavorite={favoriteIds.has(artist.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  </section>
)}


{/* Featured Sound Providers */}
{soundProviders && soundProviders.length > 0 && (
 <section className="relative overflow-hidden py-12 lg:py-20 bg-[#fffaf3] border-y border-[#ead8c0]/80">
  <div className="absolute inset-0 bg-temple-pattern opacity-[0.25] pointer-events-none" />
  <div className="absolute top-0 left-0 w-72 h-72 bg-gold-200/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-64 h-64 bg-saffron-200/10 rounded-full blur-3xl pointer-events-none" />
    <div className="container-page relative z-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="section-title">Featured Sound Providers</h2>
          <p className="section-subtitle">
            Premium Sound & Audio Services for Bhajan Sandhyas
          </p>
        </div>

        <button
          onClick={() => navigate('/sound-providers')}
          className="hidden sm:flex items-center gap-1.5 text-saffron-700 font-semibold hover:gap-2.5 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {soundProviders.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            isFavorite={favoriteIds.has(artist.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  </section>
)}

{/* Why Book with SankirtanHub */}
<section className="relative overflow-hidden py-12 lg:py-20 bg-[#fff0dc] border-y border-[#ead8c0]">
  <div className="absolute inset-0 bg-temple-pattern opacity-[0.18] pointer-events-none" />
  <div className="absolute top-0 right-0 w-72 h-72 bg-gold-200/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-72 h-72 bg-saffron-200/10 rounded-full blur-3xl pointer-events-none" />
 <div className="container-page relative z-10">

    {/* Header */}
    <div className="text-center mb-14">

     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-100 text-saffron-700 font-semibold text-sm mb-4">
     <Sparkles className="w-4 h-4" />
        Built for Bhakti
     </div>

     <h2 className="section-title">
         Why Book with SankirtanHub?
     </h2>

     <p className="section-subtitle max-w-2xl mx-auto">
         Made for Devotional Events. Simple, Transparent, and Reliable Booking.
     </p>
   </div>
    {/* Cards */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
   
      <div className="card min-h-[270px] p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">

  <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center mb-4">
    <BadgeCheck className="w-7 h-7 text-saffron-600" />
  </div>

  <h3 className="font-display text-xl font-bold text-neutral-900 mb-3">
   Verified Artists & Services
  </h3>

  <div className="w-10 h-1 rounded-full bg-saffron-500 my-3"></div>

  <p className="text-neutral-600 leading-relaxed">
    Every artist and service provider is carefully verified before being listed on SankirtanHub.
  </p>

</div>

<div className="card min-h-[270px] p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">

  <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center mb-4">
    <Music className="w-6 h-6 text-saffron-600" />
  </div>

  <h3 className="font-display text-xl font-bold text-neutral-900">
    Complete Devotional Services
  </h3>

  <div className="w-10 h-1 rounded-full bg-saffron-500 my-3"></div>

  <p className="text-neutral-600 leading-relaxed">
   Everything you need for a successful devotional event—all in one place.
  </p>

</div>

<div className="card min-h-[270px] p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">

  <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center mb-4">
    <MapPinned className="w-6 h-6 text-saffron-600" />
  </div>

  <h3 className="font-display text-xl font-bold text-neutral-900">
    Available Across India
  </h3>

  <div className="w-10 h-1 rounded-full bg-saffron-500 my-3"></div>

  <p className="text-neutral-600 leading-relaxed">
    Discover devotional artists and services from different cities across India, all in one place.
  </p>

</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

 <div className="card min-h-[270px] p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">

  <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center mb-4">
    <CalendarCheck className="w-6 h-6 text-saffron-600" />
  </div>

  <h3 className="font-display text-xl font-bold text-neutral-900">
    Easy Booking Process
  </h3>

  <div className="w-10 h-1 rounded-full bg-saffron-500 my-3"></div>

 <p className="text-neutral-600 leading-relaxed">
  Connect with artists through a simple booking request process and receive
  confirmation through email.
</p>

</div>

 <div className="card min-h-[270px] p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">

  <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center mb-4">
    <IndianRupee className="w-6 h-6 text-saffron-600" />
  </div>

  <h3 className="font-display text-xl font-bold text-neutral-900">
    Transparent Pricing
  </h3>

  <div className="w-10 h-1 rounded-full bg-saffron-500 my-3"></div>

  <p className="text-neutral-600 leading-relaxed">
    View starting prices upfront and choose the right artist or service that fits your budget.
  </p>

  </div>
</div>
  </div>
</section>

      

      {/* CTA */}
<section className="py-16 lg:py-24 bg-[#fffaf3]">
  <div className="container-page">
    <div className="relative rounded-3xl bg-saffron-gradient shadow-2xl overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-temple-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="relative px-6 py-16 lg:px-16 lg:py-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white font-semibold text-sm mb-5">
          <Sparkles className="w-4 h-4" />
          Start Your Devotional Journey
        </div>

        {/* Heading */}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 text-balance">
          Find the Perfect Artist for Your Next Devotional Event
        </h2>

        {/* Description */}
        <p className="text-white/90 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
          Browse verified singers, musical groups, sound providers, and other devotional services—all in one platform.
        </p>

        
       {/* Buttons */}
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">

  <button
    onClick={() => navigate('/singers')}
    className="btn bg-white text-saffron-700 px-8 py-3.5 hover:bg-cream-50 shadow-soft"
  >
    Explore Artists
    <ArrowRight className="w-5 h-5" />
  </button>

  <button
  onClick={() => {
    document
      .getElementById("services")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  className="btn border-2 border-white/40 text-white px-8 py-3.5 hover:bg-white/10"
>
  Browse Categories
</button>
</div>

      </div>
    </div>
  </div>
</section>
    </div>
  );
}
