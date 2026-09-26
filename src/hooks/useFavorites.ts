import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const { user } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Current user ke liye localStorage key
  const getStorageKey = () => {
    if (!user) return null;
    return `bhaktihub_favorites_${user.id}`;
  };

  // User ke saved favorites load karna
  const loadFavorites = useCallback(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    try {
      const key = getStorageKey();
      if (!key) return;

      const savedFavorites = localStorage.getItem(key);

      if (savedFavorites) {
        const ids: string[] = JSON.parse(savedFavorites);
        setFavoriteIds(new Set(ids));
      } else {
        setFavoriteIds(new Set());
      }
    } catch {
      setFavoriteIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Favorite add/remove karna
  const toggleFavorite = useCallback(
    async (artistId: string) => {
      if (!user) {
        return { requiresAuth: true };
      }

      setLoading(true);

      try {
        const key = getStorageKey();

        if (!key) {
          return { requiresAuth: true };
        }

        const next = new Set(favoriteIds);

        if (next.has(artistId)) {
          // Remove favorite
          next.delete(artistId);
        } else {
          // Add favorite
          next.add(artistId);
        }

        // React state update
        setFavoriteIds(next);

        // localStorage mein save
        localStorage.setItem(
          key,
          JSON.stringify(Array.from(next))
        );

        return { requiresAuth: false };
      } finally {
        setLoading(false);
      }
    },
    [user, favoriteIds],
  );

  return {
    favoriteIds,
    toggleFavorite,
    loading,
    reloadFavorites: loadFavorites,
  };
}