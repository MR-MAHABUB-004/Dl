import { useState, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProgressBar from "./ProgressBar";
import { FaPlayCircle } from "react-icons/fa";
import VideoModal from "./VideoModal";
import { apiUrl } from "../config";

function Youtube() {
  const [inputUrl, setInputUrl] = useState("");
  const [fetchUrl, setFetchUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isValidUrl = (url) => {
    const regex =
      /^(https?:\/\/)?(www\.youtube\.com\/shorts\/|youtube\.com\/shorts\/|m\.youtube\.com\/shorts\/|www\.youtube\.com\/|youtu\.be\/).+$/;
    return regex.test(url);
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["YoutubeMedia", fetchUrl],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/ytdl?url=${fetchUrl}`);
        // const response = await axios.get(
        //   `http://localhost:4000/ytdl?url=${fetchUrl}`,
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
      // Handle success
      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage(""); // Clear message on successful fetch
      }
    },
    onSettled: () => {
      // Clear the message on successful fetch or error
      if (!isLoading && !isFetching) {
        setMessage("");
      }
    },
  });

  const fetchVideo = () => {
    setMessage(""); // Clear message before fetching new data
    if (!inputUrl) {
      setMessage("URL Not Specified.");
      return;
    }
    if (isValidUrl(inputUrl)) {
      setFetchUrl(inputUrl); // Set URL to fetch
      setInputUrl(""); // Clear the input field
    } else {
      setMessage("Invalid YouTube URL ❌");
    }
  };
  console.log(data);

  const handleDownload = async (url, contentType, fileExtension) => {
    try {
      if (!url) {
        throw new Error("Invalid URL");
      }
      setIsDownloading(true);
      setProgress(0); // Reset progress
      const response = await axios({
        // url: `http://localhost:4000/proxy?url=${encodeURIComponent(url)}`,
        url: `${apiUrl}/proxy?url=${encodeURIComponent(url)}`,
        method: "GET",
        responseType: "blob",
        onDownloadProgress: (event) => {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress((prev) => {
            return prev < percentage ? percentage : prev;
          });
        },
      });

      const downloadUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType }),
      );
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `file.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error("Error during download:", error);
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center">
        <div className="my-12">
          <h1 className="text-noir font-nunito text-xl font-bold xs:text-2xl sm:text-4xl">
            YouTube Video Downloader
          </h1>
        </div>
        <div className="relative mb-12 flex items-center justify-center shadow-md">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste Your YouTube URL Here"
            className="bg-ivory placeholder:text-noir w-[12rem] border-2 border-gray-500 px-4 py-2 placeholder:text-sm focus:shadow-lg xs:w-[16rem] sm:w-[18rem] md:w-[22rem]"
          />
          <button
            onClick={fetchVideo}
            className="bg-sage border-2 border-l-0 border-gray-500 px-4 py-2"
          >
            Get Video
          </button>
        </div>
        {message && (
          <div className="mb-4 flex items-center justify-center p-8 text-center font-bold text-red-500">
            <p> {message}</p>
          </div>
        )}

        {isLoading && (
          <div className="loader flex aspect-square w-8 animate-spin items-center justify-center rounded-full border-t-2 border-gray-500 bg-gray-300 text-yellow-700"></div>
        )}

        <div>
          {data &&
            data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-sage mx-auto max-w-md overflow-hidden rounded-xl xs:shadow-lg md:max-w-xl"
                >
                  <div className="flex flex-col items-center justify-center gap-4 p-4 md:flex-row">
                    <div
                      className="relative flex flex-shrink-0 items-center justify-center shadow-md md:w-1/3"
                      onClick={() => setModalOpen((prev) => !prev)}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-48 w-full rounded-lg object-cover md:h-full md:object-contain"
                      />
                      <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                        {
                          <FaPlayCircle className="text-[2.5rem] text-white opacity-60" />
                        }
                      </span>
                    </div>
                    <VideoModal
                      isOpen={isModalOpen}
                      onClose={() => setModalOpen((prev) => !prev)}
                      videoUrl={item.video}
                    />
                    <div className="flex flex-col items-center gap-2 p-4 md:w-2/3 md:items-start">
                      <p className="text-noir font-nunito text-center text-lg font-bold md:text-left">
                        {item.title}
                      </p>
                      <button
                        className="bg-ivory text-moss mt-4 cursor-pointer rounded-lg border-2 border-black px-4 py-2 font-bold tracking-wide shadow-md"
                        onClick={() =>
                          handleDownload(
                            item.video,
                            item.contentType,
                            item.fileExtension,
                          )
                        }
                        disabled={isDownloading}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {progress > 0 && <ProgressBar progress={progress} />}
      </div>
    </>
  );
}

export default Youtube;
