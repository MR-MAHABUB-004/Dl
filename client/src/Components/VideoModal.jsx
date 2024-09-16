import React, { useRef, useEffect } from "react";
import "plyr/dist/plyr.css";
import Plyr from "plyr";

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
      const player = new Plyr(playerRef.current, {
        controls: [
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen",
        ],
      });

      return () => player.destroy();
    }
  }, [videoUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[90%] rounded-lg bg-black p-4 sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[50%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Aspect-ratio box to maintain consistent video size */}
        <div className="relative pb-[56.25%]">
          <video
            ref={playerRef}
            src={videoUrl}
            controls
            className="absolute left-0 top-0 h-full w-full rounded-lg"
          ></video>
        </div>
        <h1 className="bg-black"></h1>
      </div>
    </div>
  );
}
