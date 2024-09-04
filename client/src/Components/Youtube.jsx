import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProgressBar from "./ProgressBar";

function Youtube() {
  const [inputUrl, setInputUrl] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [fetchUrl, setFetchUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const isValidUrl = (url) => {
    const regex =
      /^(https?:\/\/)?(www\.youtube\.com\/shorts\/|youtube\.com\/shorts\/|m\.youtube\.com\/shorts\/|www\.youtube\.com\/|youtu\.be\/).+$/;
    return regex.test(url);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["formats", fetchUrl],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://video-loot-api.onrender.com/ytdl?url=${fetchUrl}`,
        );
        return response.data;
      } catch (err) {
        console.error("Error fetching formats:", err);
        throw err;
      }
    },
    enabled: !!fetchUrl && isValidUrl(fetchUrl),
    staleTime: Infinity,
    refetchInterval: shouldRefetch ? 3000 : false, // Throttle with 3-second intervals
    onSuccess: () => setShouldRefetch(false),
  });

  const fetchVideo = () => {
    setMessage("");
    if (!inputUrl) {
      setMessage("URL Not Specified.");
      return;
    }
    if (isValidUrl(inputUrl)) {
      setFetchUrl(inputUrl);
      setInputUrl("");
      setShouldRefetch(true); // Allow refetching
    } else {
      setMessage("Invalid YouTube URL ❌");
    }
  };

  const handleDownload = async (url) => {
    try {
      setProgress(0); // Reset progress
      const response = await axios({
        url: url,
        method: "GET",
        responseType: "blob",
        onDownloadProgress: (event) => {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress(percentage);
        },
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "video.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="my-12">
        <h1 className="text-xl font-bold xs:text-2xl sm:text-3xl">
          YouTube Video Downloader
        </h1>
      </div>
      <div className="relative mb-12 flex items-center justify-center shadow-md">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste Your YouTube URL Here"
          className="w-[12rem] border-2 border-gray-500 px-4 py-2 placeholder:text-sm focus:shadow-lg xs:w-[16rem] sm:w-[18rem] md:w-[22rem]"
        />
        <button
          onClick={fetchVideo}
          className="border-2 border-l-0 border-gray-500 px-4 py-2"
        >
          Get Video
        </button>
      </div>
      {message && <div className="mb-4 font-bold text-red-500">{message}</div>}

      {isLoading && (
        <div className="loader flex aspect-square w-8 animate-spin items-center justify-center rounded-full border-t-2 border-gray-500 bg-gray-300 text-yellow-700"></div>
      )}
      {error && (
        <p className="mb-4 font-bold text-red-500">
          Error fetching formats: {error.message}
        </p>
      )}

      {data && (
        <iframe
          className="h-[157px] w-[280px] rounded-md xs:h-[180px] xs:w-[320px] sm:h-[225px] sm:w-[400px] md:h-[285px] md:w-[500px]"
          src={`${data.url}`}
          title="video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}

      <div className="my-12 flex flex-col items-center justify-center gap-8">
        {data?.formats?.length > 0 && (
          <div className="relative w-full max-w-xs">
            <select
              id="video-quality"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="Select Quality">Select Quality</option>
              {data.formats.map((format, index) => (
                <option
                  key={index}
                  value={format.url}
                  className="text-gray-700"
                >
                  {format.qualityLabel} - {format.mimeType.split(";")[0]}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          {selectedFormat && (
            <button
              onClick={() => handleDownload(selectedFormat)}
              className="download-btn"
            >
              Download
            </button>
          )}
        </div>
      </div>

      {progress > 0 && <ProgressBar progress={progress} />}
    </div>
  );
}

export default Youtube;
