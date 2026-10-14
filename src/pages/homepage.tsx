import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import PropertyCard from "../components/propertyCard";
import { properties } from "../data/properties";
import HeroSlider from "../components/heroSlider";

const Homepage = () => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  return (
    <>
      <HeroSlider />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property, index) => (
            <div
              key={property.id}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Homepage;