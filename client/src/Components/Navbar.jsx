import { useState, useEffect, useRef } from "react";
import { links } from "../assets/links";
import { NavLink } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";

function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const navRef = useRef(null); // Reference for the navbar

  // Close the navbar when the window resizes
  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  // Close the navbar if clicked outside
  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setOpenNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks outside

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  return (
    <>
      <nav
        className="rounded bg-noir px-6 py-3 text-ivory shadow-lg lg:mx-24"
        ref={navRef}
      >
        <div className="flex items-center justify-between">
          <NavLink
            to="/"
            className="mr-4 cursor-pointer py-1.5 font-pacifico text-xl font-bold"
          >
            Video Loot
          </NavLink>
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {links.map((item, index) => (
                <li key={index} className="p-1">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `pb-1 font-sans tracking-wider transition-all hover:text-sage ${
                        isActive ? "lg:border-b-2 lg:border-ivory" : ""
                      } `
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="p-2 lg:hidden"
            onClick={() => setOpenNav(!openNav)}
            aria-label={openNav ? "Close menu" : "Open menu"}
          >
            {openNav ? (
              <IoClose className="text-2xl" />
            ) : (
              <IoMenu className="text-2xl" />
            )}
          </button>
        </div>
        <div className={`lg:hidden ${openNav ? "block" : "hidden"}`}>
          <ul className="mt-2 flex flex-col gap-2">
            {links.map((item, index) => (
              <li key={index} className="p-1">
                <NavLink
                  to={item.path}
                  className="font-sans tracking-wider transition-all hover:text-sage"
                  onClick={() => setOpenNav(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
