import { FaSearchLocation, FaHome, FaPhoneAlt } from 'react-icons/fa'; // Importing icons from react-icons

const HowitWorks = () => {
  return (
    <div className="bg-base-100 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-600">
          Find your dream home in just a few simple steps.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        
        {/* Step 1: Search */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary p-4 rounded-full mb-4">
            <FaSearchLocation className="text-3xl text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Step 1: Search</h3>
          <p className="text-gray-600">
            Enter your desired location and preferences.
          </p>
        </div>
        
        {/* Step 2: Explore */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary p-4 rounded-full mb-4">
            <FaHome className="text-3xl text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Step 2: Explore</h3>
          <p className="text-gray-600">
            Browse through detailed property listings.
          </p>
        </div>
        
        {/* Step 3: Contact */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary p-4 rounded-full mb-4">
            <FaPhoneAlt className="text-3xl text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Step 3: Contact</h3>
          <p className="text-gray-600">
            Schedule a viewing or contact the property owner.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default HowitWorks;
