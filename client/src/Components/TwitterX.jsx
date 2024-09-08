import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Marquee from "react-fast-marquee";
import ProgressBar from "./ProgressBar";
import { FaPlayCircle } from "react-icons/fa";
import VideoModal from "./VideoModal";
import ximage from "../assets/ximage.jpeg";
import { apiUrl } from "../config";

function TwitterX() {
  const [inputUrl, setInputUrl] = useState("");
  const [fetchUrl, setFetchUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [progressMap, setProgressMap] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to validate Instagram URL
  const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.|m\.)?(twitter|x)\.com\/.+$/;
    return regex.test(url);
  };

  // Query to fetch Instagram media using TanStack Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["Xmedia", fetchUrl],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/xdl?url=${fetchUrl}`);
        // const response = await axios.get(
        //   `http://localhost:4000/xdl?url=${fetchUrl}`,
        // );
        return response.data;
      } catch (err) {
        if (err.response.status === 403) {
          setMessage(err.response.data.message);
        } else {
          throw err;
        }
      }
    },
    enabled: !!fetchUrl && isValidUrl(fetchUrl),
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage("");
      }
    },
    onSettled: () => {
      // Clear the message on successful fetch or error
      if (!isLoading && !isFetching) {
        setMessage("");
      }
    },
  });

  const fetchMedia = () => {
    setMessage("");
    if (!inputUrl) {
      setMessage("URL Not Specified.");
      return;
    }
    if (isValidUrl(inputUrl)) {
      setFetchUrl(inputUrl);
      setInputUrl("");
    } else {
      setMessage("Invalid Instagram URL ❌");
    }
  };

  const handleDownload = async (
    index,
    thumbnailUrl,
    url,
    contentType,
    fileExtension,
  ) => {
    try {
      // Initialize progress for this post
      setProgressMap((prev) => ({ ...prev, [index]: 0 }));
      setIsDownloading(true);

      // Determine which URL to use based on content type
      const downloadUrl = contentType.startsWith("image/") ? thumbnailUrl : url;

      // Make the GET request to download the content
      const response = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "blob",
        onDownloadProgress: (event) => {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgressMap((prev) => ({ ...prev, [index]: percentage }));
        },
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

      // Set progress to 100% and then clear after 2 seconds
      setProgressMap((prev) => ({ ...prev, [index]: 100 }));
      setTimeout(() => {
        setProgressMap((prev) => ({ ...prev, [index]: 0 }));
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error("Error during download:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="mt-4">
        <Marquee
          className="text-noir rounded-md"
          gradient="true"
          gradientWidth={50}
          gradientColor="#E4E4DE"
          speed={15}
        >
          ⚠️ Note: Only Twitter (X) videos can be downloaded.
        </Marquee>
      </div>
      <div className="my-12">
        <h1 className="text-noir font-nunito text-xl font-bold xs:text-2xl sm:text-4xl">
          Twitter(X) Video Downloader
        </h1>
      </div>
      <div className="relative mb-12 flex items-center justify-center shadow-md">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste Twitter(X) URL"
          className="bg-ivory placeholder:text-noir w-[11rem] border-2 border-gray-500 px-4 py-2 placeholder:text-sm focus:shadow-lg xs:w-[16rem] sm:w-[18rem] md:w-[22rem]"
        />
        <button
          onClick={fetchMedia}
          className="bg-sage border-2 border-l-0 border-gray-500 px-4 py-2"
        >
          Fetch Media
        </button>
      </div>
      {message && (
        <div className="mb-4 flex items-center justify-center p-8 text-center font-bold text-red-500">
          <p> {message}</p>
        </div>
      )}

      {(isLoading || isFetching) && !message && (
        <div className="loader flex aspect-square w-8 animate-spin items-center justify-center rounded-full border-t-2 border-gray-500 bg-gray-300 text-yellow-700"></div>
      )}

      <div className="my-12 flex flex-col items-center justify-center gap-8">
        {data &&
          data.map((item, index) => {
            return (
              <div
                key={index}
                className="flex max-w-xs flex-col items-center xs:max-w-[70%] md:max-w-sm lg:max-w-md"
              >
                {item.contentType.startsWith("image/") ? (
                  <div className="flex flex-col">
                    <img
                      src={item.thumbnail}
                      alt={`image-${index}`}
                      className="h-auto max-h-[300px] w-full rounded-lg object-cover shadow-md"
                    />
                    <button
                      onClick={() =>
                        handleDownload(
                          index,
                          item.thumbnail,
                          item.url,
                          item.contentType,
                          item.fileExtension,
                        )
                      }
                      disabled={isDownloading}
                      className="bg-ivory text-moss mt-6 cursor-pointer rounded-lg border-2 border-black px-4 py-2 font-bold tracking-wide shadow-md"
                    >
                      Download
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative flex flex-col">
                      <div
                        className="relative"
                        onClick={() => setModalOpen((prev) => !prev)}
                      >
                        <img
                          src={ximage}
                          alt={`image-${index}`}
                          className="h-auto max-h-[300px] w-full rounded-lg object-cover shadow-md"
                        />
                        <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                          {
                            <FaPlayCircle className="text-[2.5rem] text-white opacity-60" />
                          }
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleDownload(
                            index,
                            item.thumbnail,
                            item.url,
                            item.contentType,
                            item.fileExtension,
                          )
                        }
                        disabled={isDownloading}
                        className="bg-ivory text-moss mt-4 cursor-pointer rounded-lg border-2 border-black px-4 py-2 font-bold tracking-wide shadow-md"
                      >
                        Download
                        <span className="m-4 text-center">
                          {item.resolution}
                        </span>
                      </button>
                    </div>
                    <VideoModal
                      isOpen={isModalOpen}
                      onClose={() => setModalOpen((prev) => !prev)}
                      videoUrl={item.url}
                    />
                  </>
                )}
                <div className="w-full">
                  {progressMap[index] > 0 && (
                    <ProgressBar progress={progressMap[index]} />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TwitterX;
