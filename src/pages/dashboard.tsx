import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  CalendarCheck,
  MessageSquare,
  Search,
  LogOut,
  Mail,
  Phone,
  ArrowRight,
  UserCircle,
} from "lucide-react";
import PropertyCard from "../components/propertyCard";
import { properties } from "../data/properties";

type User = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  created_at?: string;
};

const getUser = (): User | null => {
  try {
    const raw =
      localStorage.getItem("user") ?? sessionStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  const signOut = () => {
    ["token", "user"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    navigate("/login", { replace: true });
  };

  // Placeholder numbers: replace with real values from your API later
  const stats = [
    { label: "Saved homes", value: 0, Icon: Heart },
    { label: "Viewings booked", value: 0, Icon: CalendarCheck },
    { label: "Inquiries sent", value: 0, Icon: MessageSquare },
  ];

  const recommended = properties.slice(0, 3);

  const memberSince = user?.created_at
    ? new Date(user.created_at.replace(" ", "T")).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{greeting()},</p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {firstName} 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Here is what is happening with your home search.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/find-your-home"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Search size={16} />
              Find your home
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Recommended homes */}
          <section className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recommended for you
              </h2>
              <Link
                to="/find-your-home"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {recommended.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </section>

          {/* Account card */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <UserCircle size={32} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {user?.full_name ?? "Your account"}
                </p>
                {memberSince && (
                  <p className="text-xs text-gray-500">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>

            <ul className="mt-6 space-y-4 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-blue-600" />
                <span className="break-all">{user?.email ?? "No email"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-blue-600" />
                <span>{user?.phone ?? "No phone number added"}</span>
              </li>
            </ul>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Need help finding the right place? Talk to one of our agents.
              </p>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Contact an agent
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;