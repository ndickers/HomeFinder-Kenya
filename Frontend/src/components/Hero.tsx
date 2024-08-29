import hero from '../assets/hero2.jpg';

const Hero = () => {
  return (
    <div 
      className="hero min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${hero})` }} // Apply the background image correctly
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-lg">
          <h1 className="mb-5 text-5xl font-bold">Discover Your Next Home in Kenya</h1>
          <p className="mb-5 text-xl">
            Search thousands of rental properties in your preferred location.
          </p>
          <button className="btn btn-primary">
            Start Your Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
