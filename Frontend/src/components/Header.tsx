import { useEffect, useState } from "react";
import logo from "../assets/logo2.png";
import burgerIcon from "../assets/menu-icon.png";
import cancelIcon from "../assets/close-icon.png";
const Header = () => {
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const [showMenuIcon, setShowMenuIcon] = useState(false);

  function handleScreenSize() {
    setScreenWidth(window.screen.width);
  }
  useEffect(() => {
    window.addEventListener("resize", handleScreenSize);
    return () => {
      window.removeEventListener("resize", handleScreenSize);
    };
  }, []);

  console.log(screenWidth);
  return (
    <header className="navbar fixed flex flex-col md:flex-row bg-base-100 top-0 left-0">
      <div className="md:flex-1 flex justify-between w-[100%]">
        {/* Logo on the left (as an image) */}
        <img
          src={logo}
          // #0097b2
          alt="Logo"
          className="h-20"
        />
        {screenWidth <= 768 && showMenuIcon ? (
          <button
            onClick={() => {
              setShowMenuIcon(false);
            }}
            className="md:hidden mr-4"
          >
            <img src={cancelIcon} alt="menu icon" />
          </button>
        ) : (
          <button
            onClick={() => {
              setShowMenuIcon(true);
            }}
            className="md:hidden mr-4"
          >
            <img src={burgerIcon} alt="menu icon" />
          </button>
        )}
      </div>

      {showMenuIcon && (
        <nav className="md:flex-none  flex justify-between w-[100%] md:w-auto">
          {/* Link items on the right */}
          <ul className="menu md:menu-horizontal menu-dropdown-show md:px-1">
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
        </nav>
      )}
      {!showMenuIcon && screenWidth > 768 && (
        <nav className="md:flex-none  flex justify-between w-[100%] md:w-auto">
          {/* Link items on the right */}
          <ul className="menu md:menu-horizontal menu-dropdown-show md:px-1">
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
        </nav>
      )}
    </header>
  );
};

export default Header;

{
  /* <div className="flex-none">
<div className="form-control mx-4">
  <input
    type="text"
    placeholder="Search properties"
    className="input input-bordered"
  />
</div>
</div> */
}
