import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Place } from "../types";

const LOAD_ERROR = "تعذر تحميل الأماكن. حاول مرة أخرى.";
const SAVE_ERROR = "تعذر حفظ التغيير. حاول مرة أخرى.";

export function usePlacesData() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const [placesResult, favoritesResult] = await Promise.all([
      supabase
        .from("places")
        .select("id, name_ar, name_en, city, description_ar, image_url")
        .order("name_en"),
      supabase.from("favorites").select("place_id"),
    ]);

    if (
      placesResult.error ||
      favoritesResult.error ||
      !placesResult.data ||
      !favoritesResult.data
    ) {
      setLoadError(LOAD_ERROR);
    } else {
      setPlaces(placesResult.data as Place[]);
      setFavoriteIds(new Set(favoritesResult.data.map((row) => row.place_id as string)));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleFavorite = useCallback(
    async (placeId: string) => {
      const isFavorite = favoriteIds.has(placeId);
      setSaveError(null);
      setSavingId(placeId);

      const result = isFavorite
        ? await supabase.from("favorites").delete().eq("place_id", placeId)
        : await supabase.from("favorites").insert({ place_id: placeId });

      setSavingId(null);

      if (result.error) {
        setSaveError(SAVE_ERROR);
        return;
      }

      setFavoriteIds((previous) => {
        const next = new Set(previous);
        if (isFavorite) {
          next.delete(placeId);
        } else {
          next.add(placeId);
        }
        return next;
      });
    },
    [favoriteIds],
  );

  return {
    places,
    favoriteIds,
    loading,
    loadError,
    saveError,
    savingId,
    reload: load,
    toggleFavorite,
  };
}
