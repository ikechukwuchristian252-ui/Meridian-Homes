import PropertyCard from "../components/propertyCard";
import House1 from "../assets/images/home1.webp"
import Esther from "../assets/images/esther.jpg"

const Homepage = () => {
  return (
    <div>
      <PropertyCard
        images={[House1]}
        status="For Sale"
        type="Semi Detached"
        location="Lekki"
        price="₦165,000,000"
        title="4 Bedroom Semi-Detached Duplex in Lekki"
        agent={{
          name: "Esther",
          photo: Esther,
          whatsapp: "2348012345678",
          phone: "+2348012345678",
        }}
      />
    </div>
  );
};

export default Homepage;
