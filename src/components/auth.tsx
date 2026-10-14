import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Logo from "../assets/images/logo.png";
import LoginImg from "../assets/images/loginImg.avif";
import SignUpImg from "../assets/images/signUpImg.avif";

type Mode = "login" | "signup";

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
  terms?: string;
  form?: string;
};

const content = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your account to continue.",
    submit: "Sign in",
    loading: "Signing in...",
    panelTitle: "Find the home that fits your life.",
    panelText:
      "Sign in to save your favorite properties, book viewings and get alerts when new homes match what you are looking for.",
    image: LoginImg,
  },
  signup: {
    title: "Create your account",
    subtitle: "Join us and start your property journey today.",
    submit: "Create account",
    loading: "Creating account...",
    panelTitle: "Your next home is one click away.",
    panelText:
      "Create a free account to save listings, compare properties and talk directly to our agents.",
    image: SignUpImg,
  },
};

const Auth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // The URL decides the mode, so /login and /register both work
  const mode: Mode = pathname.startsWith("/register") ? "signup" : "login";
  const isSignup = mode === "signup";
  const text = content[mode];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setErrors({});
    setPassword("");
    setConfirm("");
    setShowPassword(false);
    navigate(next === "login" ? "/login" : "/register", { replace: true });
  };

  const validate = (): Errors => {
    const next: Errors = {};

    if (isSignup && name.trim().length < 2) next.name = "Enter your full name";

    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";

    if (isSignup && phone && !/^[+\d][\d\s-]{6,}$/.test(phone))
      next.phone = "Enter a valid phone number";

    if (!password) next.password = "Password is required";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters";

    if (isSignup) {
      if (!confirm) next.confirm = "Please confirm your password";
      else if (confirm !== password) next.confirm = "Passwords do not match";
      if (!terms) next.terms = "You must accept the terms to continue";
    }

    return next;
  };


const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost/real-estate-api/users";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const found = validate();
  setErrors(found);
  if (Object.keys(found).length > 0) return;

  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/${isSignup ? "store" : "login"}.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isSignup
          ? { name, email, phone, password, confirm_password: confirm, terms }
          : { email, password, remember }
      ),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.status !== "success") {
      // Server-side field errors (e.g. "email already exists") go under the inputs
      if (data?.errors) {
        setErrors(data.errors);
        return;
      }
      throw new Error(data?.message ?? "Request failed. Please try again.");
    }

    // REMEMBER ME AFTER SIGING IN
    const keep = !isSignup && remember;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    const storage = keep ? localStorage : sessionStorage;
    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  } catch (err) {
    setErrors({
      form:
        err instanceof TypeError
          ? "Cannot reach the server. Check your connection and try again."
          : err instanceof Error
          ? err.message
          : "Something went wrong",
    });
  } finally {
    setLoading(false);
  }
};

  const inputClass = (error?: string) =>
    `w-full rounded-lg border bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  const passwordChecks = [
    { label: "6+ characters", ok: password.length >= 6 },
    { label: "A number", ok: /\d/.test(password) },
    {
      label: "Upper & lower case",
      ok: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
  ];

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Image panel (desktop only) */}
      <div className="relative hidden lg:block">
        {(Object.keys(content) as Mode[]).map((key) => (
          <img
            key={key}
            src={content[key].image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              key === mode ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight">
            {text.panelTitle}
          </h2>
          <p className="mt-3 max-w-md text-white/80">{text.panelText}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Link to="/" className="hidden lg:inline-block">
            <img src={Logo} alt="Logo" className="w-20" />
          </Link>

          {/* Toggle */}
          <div
            role="tablist"
            aria-label="Choose sign in or sign up"
            className="mt-8 grid grid-cols-2 rounded-full bg-gray-100 p-1"
          >
            {(["login", "signup"] as Mode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => switchMode(tab)}
                className={`rounded-full py-2.5 text-sm font-semibold transition-all ${
                  mode === tab
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1 className="mt-8 text-3xl font-bold text-gray-900">
            {text.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{text.subtitle}</p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-5"
            key={mode}
          >
            {errors.form && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="shrink-0" />
                {errors.form}
              </div>
            )}

            {/* Full name (sign up) */}
            {isSignup && (
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <div className="relative">
                  <User size={18} className={iconClass} />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    className={inputClass(errors.name)}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className={iconClass} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  className={inputClass(errors.email)}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone (sign up) */}
            {isSignup && (
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone number <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <Phone size={18} className={iconClass} />
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={!!errors.phone}
                    className={inputClass(errors.phone)}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className={iconClass} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={
                    isSignup ? "Create a password" : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  className={`${inputClass(errors.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}

              {isSignup && password && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {passwordChecks.map(({ label, ok }) => (
                    <li
                      key={label}
                      className={`flex items-center gap-1 text-xs ${
                        ok ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirm password (sign up) */}
            {isSignup && (
              <div>
                <label htmlFor="confirm" className={labelClass}>
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={18} className={iconClass} />
                  <input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    aria-invalid={!!errors.confirm}
                    className={inputClass(errors.confirm)}
                  />
                </div>
                {errors.confirm && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.confirm}
                  </p>
                )}
              </div>
            )}

            {/* Login extras */}
            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Terms (sign up) */}
            {isSignup && (
              <div>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-blue-600"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.terms}</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {text.loading}
                </>
              ) : (
                text.submit
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? "login" : "signup")}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Auth;
