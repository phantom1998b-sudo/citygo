import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { AuthPage } from "./auth/AuthPage";
import { PlacesView } from "./places/PlacesView";

type Tab = "all" | "favorites";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("all");

  if (loading) {
    return <p className="state-message">جارٍ التحميل...</p>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="brand">CityGo الأردن</span>
          <nav className="app-nav" aria-label="التنقل الرئيسي">
            <button
              type="button"
              className={tab === "all" ? "nav-tab nav-tab--active" : "nav-tab"}
              aria-current={tab === "all" ? "page" : undefined}
              onClick={() => setTab("all")}
            >
              الأماكن
            </button>
            <button
              type="button"
              className={tab === "favorites" ? "nav-tab nav-tab--active" : "nav-tab"}
              aria-current={tab === "favorites" ? "page" : undefined}
              onClick={() => setTab("favorites")}
            >
              المفضلة
            </button>
          </nav>
          <button type="button" className="button button--ghost" onClick={() => void signOut()}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        <h1 className="page-title">{tab === "all" ? "الأماكن" : "أماكني المفضلة"}</h1>
        <PlacesView favoritesOnly={tab === "favorites"} />
      </main>
    </div>
  );
}
