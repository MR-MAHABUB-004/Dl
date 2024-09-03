import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Marquee from "react-fast-marquee";

function Instagram() {
  const [inputUrl, setInputUrl] = useState("");
  const [fetchUrl, setFetchUrl] = useState(null);
  const [message, setMessage] = useState("");

  // Function to validate Instagram URL
  const isValidUrl = (url) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel|stories|tv|s|explore|direct)\/).+$/;
    return regex.test(url);
  };

  // Query to fetch Instagram video using TanStack Query
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["instaVideo", fetchUrl],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/instadl?url=${fetchUrl}`,
        );
        if (response.data.message) {
          setMessage(response.data.message);
        }
        return response.data;
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setMessage(
            "Unfortunately, we cannot download videos from a user's personal pages.",
          );
        } else {
          setMessage("An error occurred while fetching data.");
        }
        throw err;
      }
    },
    enabled: !!fetchUrl && isValidUrl(fetchUrl),
    staleTime: Infinity,
    onSettled: () => {
      // Clear the message on successful fetch or error
      setMessage("");
    },
  });

  const handleGetVideo = () => {
    setMessage("");
    if (!inputUrl) {
      setMessage("URL Not Specified.");
      return;
    }
    if (isValidUrl(inputUrl)) {
      setFetchUrl(inputUrl);
      setInputUrl("");
      // Clear the previous data
      refetch();
    } else {
      setMessage("Invalid Instagram URL ❌");
    }
  };

  const handleDownload = async (
    thumbnailUrl,
    url,
    contentType,
    fileExtension,
  ) => {
    try {
      // Determine which URL to use based on content type
      const downloadUrl = contentType.startsWith("image/") ? thumbnailUrl : url;

      // Make the GET request to download the content
      const response = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "blob",
      });

      // Create a URL for the downloaded blob
      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType }),
      );

      // Create an anchor element and simulate a click to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `file.${fileExtension}`); // e.g., file.mp4, file.jpeg
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoke the object URL after the download
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="mt-4">
        <Marquee
          className="rounded-md"
          gradient="true"
          gradientWidth={50}
          gradientColor="white"
          speed={15}
        >
          ⚠️ Note: Only public profiles supported.
        </Marquee>
      </div>
      <div className="my-12">
        <h1 className="text-xl font-bold sm:text-3xl xs:text-2xl">
          Instagram Content Downloader
        </h1>
      </div>
      <div className="relative mb-12 flex items-center justify-center shadow-md">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste Instagram URL"
          className="w-[12rem] border-2 border-gray-500 px-4 py-2 placeholder:text-sm focus:shadow-lg sm:w-[18rem] md:w-[22rem] xs:w-[16rem]"
        />
        <button
          onClick={handleGetVideo}
          className="border-2 border-l-0 border-gray-500 px-4 py-2"
        >
          Fetch Media
        </button>
      </div>
      {message && <div className="mb-4 font-bold text-red-500">{message}</div>}

      {(isLoading || isFetching) && !message && (
        <div className="loader flex aspect-square w-8 animate-spin items-center justify-center rounded-full border-t-2 border-gray-500 bg-gray-300 text-yellow-700"></div>
      )}

      <div className="my-12 flex flex-col items-center justify-center gap-8">
        {data &&
          data.map((item, index) => {
            return (
              <div
                key={index}
                className="flex max-w-xs flex-col items-center md:max-w-sm lg:max-w-md lg:flex-row lg:gap-x-8"
              >
                <img
                  src={item.thumbnail}
                  alt={`image-${index}`}
                  className="h-auto max-h-[300px] w-full rounded-lg object-cover shadow-md"
                />
                <button
                  onClick={() =>
                    handleDownload(
                      item.thumbnail,
                      item.url,
                      item.contentType,
                      item.fileExtension,
                    )
                  }
                  className="mt-4 cursor-pointer rounded-lg border-2 border-gray-300 bg-gradient-to-br from-[#020024] from-10% via-[#090979] via-30% to-[#00d4ff] to-100% bg-clip-text px-4 py-2 font-bold tracking-wide text-transparent transition-all duration-300 ease-in-out hover:z-10 hover:shadow-md"
                >
                  Download
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Instagram;
