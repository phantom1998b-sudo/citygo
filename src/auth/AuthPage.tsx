import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

type Mode = "signin" | "signup";

const GENERIC_ERROR = "تعذر إكمال الطلب. تحقق من اتصالك وحاول مرة أخرى.";

function describeAuthError(code: string | undefined): string {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "هذا البريد مسجل بالفعل. جرّب تسجيل الدخول.";
    case "invalid_credentials":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    case "weak_password":
      return "كلمة المرور ضعيفة. استخدم كلمة مرور أطول.";
    default:
      return GENERIC_ERROR;
  }
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const credentials = { email: email.trim(), password };
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

    setSubmitting(false);
    if (result.error) {
      setError(describeAuthError(result.error.code));
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">أهلاً بك في CityGo</h1>
        <p className="auth-subtitle">سجّل دخولك لحفظ أماكنك المفضلة.</p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={mode === "signin" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => switchMode("signin")}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => switchMode("signup")}
          >
            إنشاء حساب
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">البريد الإلكتروني</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">كلمة المرور</span>
            <input
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? "جارٍ المعالجة..." : mode === "signin" ? "دخول" : "إنشاء الحساب"}
          </button>
        </form>
      </section>
    </main>
  );
}
