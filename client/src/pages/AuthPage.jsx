import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertCircle, ArrowLeft, Bell, Eye, EyeOff, Lock, Mail, MessageCircle, Sparkles, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { login, register, sendCode } from "../store/authSlice";
import { Logo, Spinner } from "../components/ui";

function PasswordInput({ value, onChange, autoComplete, placeholder = "Password" }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-icon password-input">
      <Lock />
      <input
        className="input"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        minLength={autoComplete === "new-password" ? 8 : undefined}
      />
      <button type="button" className="icon-btn sm" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}

const ErrorBox = ({ message }) =>
  message ? (
    <div className="form-error" role="alert">
      <AlertCircle /> <span>{message}</span>
    </div>
  ) : null;

function LoginForm() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await dispatch(login(form)).unwrap();
    } catch (message) {
      setError(message);
      setBusy(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <div>
        <h1>Welcome back</h1>
        <p className="muted">Log in to catch up with your friends.</p>
      </div>
      <ErrorBox message={error} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <div className="input-icon">
          <Mail />
          <input
            id="email"
            className="input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            required
            autoFocus
          />
        </div>
      </div>
      <div className="field">
        <label>Password</label>
        <PasswordInput
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
        />
      </div>
      <button className="btn btn-brand lg block" disabled={busy}>
        {busy ? <Spinner size="sm" light /> : "Log in"}
      </button>
      <p className="auth-switch">
        New to Mingle? <Link to="/signup" className="link">Create an account</Link>
      </p>
    </form>
  );
}

function SignupForm() {
  const dispatch = useAppDispatch();
  const verification = useAppSelector((s) => s.auth.config?.emailVerification);
  const [form, setForm] = useState({ name: "", email: "", password: "", birthdate: "", gender: "Female" });
  const [step, setStep] = useState("details");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const today = new Date().toISOString().slice(0, 10);

  const attempt = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (message) {
      setError(message);
    }
    setBusy(false);
  };

  const requestCode = () =>
    attempt(async () => {
      const result = await dispatch(sendCode(form.email)).unwrap();
      if (result.verificationRequired === false) {
        await dispatch(register(form)).unwrap();
        return;
      }
      setStep("verify");
      setCooldown(60);
    });

  const submitDetails = (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (verification) requestCode();
    else attempt(() => dispatch(register(form)).unwrap());
  };

  const submitCode = (e) => {
    e.preventDefault();
    attempt(() => dispatch(register({ ...form, code })).unwrap());
  };

  if (step === "verify") {
    return (
      <form className="auth-form" onSubmit={submitCode}>
        <button type="button" className="btn btn-ghost sm back-btn" onClick={() => setStep("details")}>
          <ArrowLeft /> Back
        </button>
        <div>
          <h1>Check your email</h1>
          <p className="muted">
            We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below to finish creating your account.
          </p>
        </div>
        <ErrorBox message={error} />
        <input
          className="input code-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          aria-label="Verification code"
          autoFocus
          required
        />
        <button className="btn btn-brand lg block" disabled={busy || code.length !== 6}>
          {busy ? <Spinner size="sm" light /> : "Verify & create account"}
        </button>
        <p className="auth-switch">
          Didn't get it?{" "}
          <button type="button" className="link" disabled={cooldown > 0 || busy} onClick={requestCode}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </p>
      </form>
    );
  }

  return (
    <form className="auth-form" onSubmit={submitDetails}>
      <div>
        <h1>Create your account</h1>
        <p className="muted">It's quick and easy.</p>
      </div>
      <ErrorBox message={error} />
      <div className="field">
        <label htmlFor="name">Full name</label>
        <div className="input-icon">
          <User />
          <input id="name" className="input" placeholder="Jane Doe" value={form.name} onChange={set("name")} autoComplete="name" required minLength={2} maxLength={60} autoFocus />
        </div>
      </div>
      <div className="field">
        <label htmlFor="su-email">Email</label>
        <div className="input-icon">
          <Mail />
          <input id="su-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" required />
        </div>
      </div>
      <div className="field">
        <label>Password</label>
        <PasswordInput value={form.password} onChange={set("password")} autoComplete="new-password" placeholder="At least 8 characters" />
      </div>
      <div className="auth-grid">
        <div className="field">
          <label htmlFor="birthdate">Birthday</label>
          <input id="birthdate" className="input" type="date" max={today} value={form.birthdate} onChange={set("birthdate")} required />
        </div>
        <div className="field">
          <span className="field-label">Gender</span>
          <div className="segmented" role="radiogroup" aria-label="Gender">
            {["Female", "Male", "Other"].map((g) => (
              <button
                type="button"
                key={g}
                role="radio"
                aria-checked={form.gender === g}
                className={form.gender === g ? "on" : ""}
                onClick={() => setForm({ ...form, gender: g })}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button className="btn btn-brand lg block" disabled={busy}>
        {busy ? <Spinner size="sm" light /> : verification ? "Continue" : "Sign up"}
      </button>
      <p className="auth-switch">
        Already have an account? <Link to="/login" className="link">Log in</Link>
      </p>
    </form>
  );
}

export default function AuthPage({ mode }) {
  return (
    <div className="auth">
      <section className="auth-hero">
        <Logo size={40} />
        <div className="auth-hero-copy">
          <h2>
            Where friends
            <br />
            come together.
          </h2>
          <p>Share what you're up to, chat in real time, and never miss a moment with the people you care about.</p>
          <ul>
            <li>
              <MessageCircle /> Real-time messaging with typing indicators and read receipts
            </li>
            <li>
              <Bell /> Instant notifications for likes, comments and friend requests
            </li>
            <li>
              <Sparkles /> A fresh look in light and dark
            </li>
          </ul>
        </div>
        <div className="auth-bubbles" aria-hidden="true">
          <span className="bubble b1">Are we still on for tonight? 🍕</span>
          <span className="bubble b2">Yes! See you at 8 🙌</span>
          <span className="bubble b3">
            <Bell size={14} /> Maya liked your photo
          </span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-mobile-logo">
          <Logo size={40} />
        </div>
        <div className="card auth-card">{mode === "signup" ? <SignupForm /> : <LoginForm />}</div>
        <p className="faint auth-foot">© {new Date().getFullYear()} Mingle</p>
      </section>
    </div>
  );
}
