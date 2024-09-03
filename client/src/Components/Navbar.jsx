import { useState, useEffect } from "react";
import { links } from "../assets/links";
import { NavLink } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";

function Navbar() {
  const [openNav, setOpenNav] = useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  return (
    <>
      <nav className="rounded-xl px-6 py-3 shadow-lg lg:mx-24">
        <div className="flex items-center justify-between">
          <NavLink
            to="/"
            className="mr-4 cursor-pointer bg-gradient-to-br from-[#020024] from-10% via-[#090979] via-30% to-[#00d4ff] to-100% bg-clip-text py-1.5 font-pacifico text-xl font-bold text-transparent"
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
                      `flex items-center font-bold transition-all hover:bg-gradient-to-br hover:from-[#020024] hover:from-10% hover:via-[#090979] hover:via-30% hover:to-[#00d4ff] hover:to-100% hover:bg-clip-text hover:text-transparent ${
                        isActive ? "lg:border-b-2 lg:border-black" : ""
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
                  className="flex items-center font-bold transition-all hover:bg-gradient-to-br hover:from-[#020024] hover:from-10% hover:via-[#090979] hover:via-30% hover:to-[#00d4ff] hover:to-100% hover:bg-clip-text hover:text-transparent"
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
