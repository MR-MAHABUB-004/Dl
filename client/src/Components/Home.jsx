import { NavLink } from "react-router-dom";
import { links } from "../assets/links";
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="my-12">
          <h1 className="text-xl font-bold xs:text-2xl">
            Free Video Downloader
          </h1>
        </div>
        <div className="mb-12">
          <h3 className="my-4 text-center text-xl xs:text-2xl">
            Supported Resources
          </h3>
          <div className="my-12 flex flex-wrap justify-center gap-4">
            {links.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className="mx-4 flex w-max items-center justify-around gap-2 rounded-md border border-black px-6 py-2"
                >
                  {<item.icon className={item.styles} />}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
