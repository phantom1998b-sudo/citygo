import { usePlacesData } from "./usePlacesData";
import { PlaceCard } from "./PlaceCard";

type PlacesViewProps = {
  favoritesOnly: boolean;
};

export function PlacesView({ favoritesOnly }: PlacesViewProps) {
  const { places, favoriteIds, loading, loadError, saveError, savingId, reload, toggleFavorite } =
    usePlacesData();

  if (loading) {
    return <p className="state-message">جارٍ التحميل...</p>;
  }

  if (loadError) {
    return (
      <div className="state-message">
        <p className="form-error" role="alert">
          {loadError}
        </p>
        <button type="button" className="button button--secondary" onClick={() => void reload()}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const visiblePlaces = favoritesOnly
    ? places.filter((place) => favoriteIds.has(place.id))
    : places;

  return (
    <section className="places-section">
      {saveError && (
        <p className="form-error" role="alert">
          {saveError}
        </p>
      )}

      {visiblePlaces.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-title">لم تحفظ أي مكان بعد</h2>
          <p className="empty-text">تصفح الأماكن واضغط على القلب لحفظها هنا.</p>
        </div>
      ) : (
        <div className="places-grid">
          {visiblePlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isFavorite={favoriteIds.has(place.id)}
              saving={savingId === place.id}
              onToggleFavorite={(placeId) => void toggleFavorite(placeId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
