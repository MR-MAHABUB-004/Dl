const express = require('express');
const ytdl = require('@distube/ytdl-core');
const { ndown } = require("nayan-media-downloader");
const cors = require('cors');
require("dotenv").config();
const axios = require('axios')
const { filterUniqueImages, filterFormats } = require('./helperFns');

const port = process.env.PORT || 4000;
const app = express();
app.use(cors({
    origin: 'http://localhost:5173/',
    credentials: true // Allow credentials
}));

app.get('/', (req, res) => {
    res.json('VideoLoot - Online Media Downloader')
})

app.get("/ytdl", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }

        const videoId = await ytdl.getURLVideoID(url);
        const metaInfo = await ytdl.getInfo(url);

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
