import { Heart } from "lucide-react";
import type { Place } from "../types";

type PlaceCardProps = {
  place: Place;
  isFavorite: boolean;
  saving: boolean;
  onToggleFavorite: (placeId: string) => void;
};

export function PlaceCard({ place, isFavorite, saving, onToggleFavorite }: PlaceCardProps) {
  return (
    <article className="place-card">
      <div className="place-image-wrap">
        <img src={place.image_url} alt={place.name_en} loading="lazy" className="place-image" />
        <button
          type="button"
          className={isFavorite ? "favorite-button favorite-button--active" : "favorite-button"}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "إزالة من المفضلة" : "حفظ في المفضلة"}
          disabled={saving}
          onClick={() => onToggleFavorite(place.id)}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="place-body">
        <p className="place-city">{place.city}</p>
        <h3 className="place-name">{place.name_ar}</h3>
        <p className="place-description">{place.description_ar}</p>
      </div>
    </article>
  );
}
