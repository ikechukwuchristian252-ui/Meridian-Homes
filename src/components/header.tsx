import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search, LogIn } from "lucide-react";
import Logo from "../assets/images/logo.png";

const navLinks = [
  { label: "home", to: "/" },
  { label: "about", to: "/about" },
  { label: "services", to: "/services" },
  { label: "contact", to: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `capitalize transition-colors hover:text-blue-600 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={Logo} alt="Logo" className="w-16 sm:w-20" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass} end={to === "/"}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/find-your-home"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium capitalize text-white transition-colors hover:bg-blue-700"
          >
            <Search size={16} />
            find your home
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium capitalize text-gray-700 transition-colors hover:bg-gray-100"
          >
            <LogIn size={16} />
            sign in
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-background px-4 pb-8 pt-4 transition-all duration-200 md:hidden ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col divide-y divide-gray-200">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `block py-4 text-lg capitalize ${
                      isActive ? "font-semibold text-blue-600" : "text-gray-700"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-medium capitalize text-white hover:bg-blue-700"
          >
            <Search size={18} />
            find your home
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 font-medium capitalize text-gray-700 hover:bg-gray-100"
          >
            <LogIn size={18} />
            sign in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;