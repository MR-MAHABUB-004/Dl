import express from 'express';
import ytdl from '@distube/ytdl-core';
import pkg from 'nayan-media-downloader';
const { ndown } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { filterUniqueImages, filterFormats } from './helperFns.mjs'; // Note the .js extension
import rateLimit from 'express-rate-limit';
import pRetry from 'p-retry';

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors({
    origin: ['http://localhost:5173', 'https://videoloot.vercel.app'],
    credentials: true
}));

const fetchYouTubeInfo = async (url) => {
    return pRetry(() => {
        return ytdl.getInfo(url);
    }, {
        retries: 5,
        minTimeout: 1000,
        maxTimeout: 5000,
        onFailedAttempt: error => {
            console.warn(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        }
    });
};

app.get('/', (req, res) => {
    res.json('VideoLoot - Online Media Downloader');
});

app.get("/ytdl", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }

        const videoId = await ytdl.getURLVideoID(url);
        const metaInfo = await fetchYouTubeInfo(url);

        if (!metaInfo || !metaInfo.formats) {
            throw new Error("Failed to retrieve video formats");
        }

        const data = {
            url: `https://www.youtube.com/embed/${videoId}`,
            formats: filterFormats(metaInfo.formats) // Limit data here
        };

        return res.json(data); // Send the filtered data
    } catch (error) {
        console.error("Error fetching video info:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/instadl', async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }

        // Get the media information using ndown
        const info = await ndown(url);

        // Check if the status indicates a personal page
        if (info.status === false) {
            return res.status(403).json({ message: "Unfortunately, we cannot download videos from a user's personal pages." });
        }

        const data = filterUniqueImages(info.data);

        if (data && data.length > 0) {
            // Process each media item
            const processedData = await Promise.all(data.map(async (item) => {
                const mediaUrl = item.url;
                let contentType;
                let fileExtension = "";

                try {
                    const headResponse = await axios({
                        url: mediaUrl,
                        method: "HEAD",
                    });
                    contentType = headResponse.headers["content-type"];
                } catch (headError) {
                    console.warn("HEAD request failed, defaulting to GET request.");
                    contentType = null;
                }

                // Determine the content type and file extension
                if (contentType) {
                    if (contentType.startsWith("image/")) {
                        fileExtension = contentType.split("/")[1]; // e.g., 'jpeg', 'png'
                    } else if (contentType.startsWith("video/")) {
                        fileExtension = contentType.split("/")[1]; // e.g., 'mp4', 'webm'
                    } else if (contentType === "application/octet-stream") {
                        // Handle octet-stream by assuming it's a video file
                        contentType = "video/mp4";
                        fileExtension = "mp4";
                    } else {
                        console.warn("Unrecognized content type:", contentType);
                    }
                } else {
                    // If contentType is null, assume it's a video or perform more checks
                    console.warn("No content type found, defaulting to video.");
                    contentType = "video/mp4";
                    fileExtension = "mp4";
                }

                return {
                    thumbnail: item.thumbnail,
                    url: mediaUrl,
                    contentType: contentType,
                    fileExtension: fileExtension,
                };
            }));

            // Send the processed data back to the client
            return res.json(processedData);
        } else {
            return res.status(404).json({ error: "No media found" });
        }
    } catch (error) {
        console.error("Error fetching video info:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});
