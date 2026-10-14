import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Logo from "../assets/images/logo.png";
import { FaX } from "react-icons/fa6";

const quickLinks = [
  { label: "home", to: "/" },
  { label: "about", to: "/about" },
  { label: "services", to: "/services" },
  { label: "contact", to: "/contact" },
];

const services = [
  { label: "buy a home", to: "/services" },
  { label: "sell a home", to: "/services" },
  { label: "rent a property", to: "/services" },
  { label: "property management", to: "/services" },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebook },
  { label: "Twitter", href: "https://twitter.com", Icon: FaX },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedin },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <img src={Logo} alt="Logo" className="w-20" />
            </Link>
            <p className="max-w-xs text-sm text-gray-600">
              We help you find, buy, sell and rent the home that fits your life.
            </p>
            <ul className="flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Quick links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm capitalize text-gray-600 transition-colors hover:text-blue-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm capitalize text-gray-600 transition-colors hover:text-blue-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Contact us
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-600" />
                <span>123 Property Avenue, Your City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-blue-600" />
                <a href="tel:+1234567890" className="hover:text-blue-600">
                  +123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-blue-600" />
                <a
                  href="mailto:info@yourdomain.com"
                  className="break-all hover:text-blue-600"
                >
                  info@yourdomain.com
                </a>
              </li>
            </ul>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex overflow-hidden rounded-full border border-gray-300 focus-within:border-blue-600"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center justify-center bg-blue-600 px-4 text-white transition-colors hover:bg-blue-700"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-600 sm:flex-row">
          <p>&copy; {year} Your Company. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link to="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;