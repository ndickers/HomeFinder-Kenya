import logo from "../assets/logo2.png";

const Header = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        {/* Logo on the left (as an image) */}
        <img
          src={logo}
          // #0097b2
          alt="Logo"
          className="h-20"
        />
      </div>
      <div className="flex-none">
        {/* Search bar in the middle */}
        <div className="form-control mx-4">
          <input
            type="text"
            placeholder="Search properties"
            className="input input-bordered"
          />
        </div>
      </div>
      <div className="flex-none">
        {/* Link items on the right */}
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>About Us</a>
          </li>
          <li>
            <a>Properties</a>
          </li>
          <li>
            <a>Contact Us</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
