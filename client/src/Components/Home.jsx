import { NavLink } from "react-router-dom";
import { links } from "../assets/links";
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="my-12">
          <h1 className="font-nunito text-2xl font-bold xs:text-4xl">
            Free Video Downloader
          </h1>
        </div>
        <div className="mb-8">
          <h3 className="my-4 text-center text-xl xs:text-2xl">
            Supported Resources
          </h3>
          <div className="my-12 flex flex-wrap justify-center gap-4">
            {links.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className="mx-4 flex w-40 items-center justify-around gap-2 rounded-md border border-black px-6 py-2 shadow-lg"
                >
                  {<item.icon className={item.styles} />}{" "}
                  <span className="font-sans">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
          <hr className="border-sage my-8 w-full border-t-2" />
        </div>
        <div className="">
          <h1 className="font-nunito text-center text-xl xs:text-3xl">
            How to downlaod with VideoLoot
          </h1>
          <div className="my-8 flex flex-col">
            <div className="mb-8">
              <h1 className="font-nunito text-moss mb-4 text-center text-2xl font-bold">
                Step 1:
              </h1>
              <p className="font-nunito text-center lg:text-xl">
                Open the video you want to download and copy its link at the top
                of the screen.
              </p>
            </div>
            <div className="mb-8">
              <h1 className="font-nunito text-moss mb-4 text-center text-2xl font-bold">
                Step 2:
              </h1>
              <p className="font-nunito text-center lg:text-xl">
                Then go to our website and paste the link into the input field.
              </p>
            </div>
            <div className="mb-8">
              <h1 className="font-nunito text-moss mb-4 text-center text-2xl font-bold">
                Step 3:
              </h1>
              <p className="font-nunito text-center lg:text-xl">
                click the "Fetch Media" button.
              </p>
            </div>
            <div className="mb-8">
              <h1 className="font-nunito text-moss mb-4 text-center text-2xl font-bold">
                Step 4:
              </h1>
              <p className="font-nunito text-center lg:text-xl">
                Click the "Download" button to Download.
              </p>
            </div>
          </div>
          <hr className="border-sage w-full border-t-2" />
        </div>
      </div>
    </>
  );
}
