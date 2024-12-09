const express = require('express');
const { ndown } = require("nayan-video-downloader");
const { ytdown } = require("nayan-video-downloader");
const { twitterdown } = require("nayan-video-downloader");
const getThumbnail = require("./ytThumbnail");
const cors = require('cors');
const got = require('got');
const { filterUniqueImages, processMediaData, getFileType, createUniqueFileName } = require('./utils');
require("dotenv").config();

const port = process.env.PORT || 4000;
const app = express();

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://videoloot.vercel.app'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));



// Handle errors and responses
const handleError = (res, statusCode, message) => res.status(statusCode).json({ message: message });

// Routes
app.get('/', (req, res) => {
    res.json('VideoLoot - Online Media Downloader');
});

app.get('/proxy', async (req, res) => {
    const videoUrl = req.query.url;
    try {
        const stream = got.stream(videoUrl, { timeout: 60000 });
        stream.on('response', (response) => {
            res.set('Content-Type', response.headers['content-type']);
            res.set('Content-Length', response.headers['content-length']);
        });
        stream.pipe(res);
    } catch (err) {
        console.error("Error fetching video:", err.message);
        handleError(res, 500, 'Error fetching video');
    }
});

app.get('/ytdl', async (req, res) => {
    const url = req.query.url;
    if (!url) return handleError(res, 400, "URL parameter is required");

    try {
        const info = await ytdown(url);
        if (!info.status) return handleError(res, 403, "Sorry, we couldn't find the video you're looking for.");

        const { contentType, fileExtension } = await getFileType(info.data.video);
        const thumbnail = getThumbnail(url, 'mq');
        const fileName = createUniqueFileName()
        const responseData = [{
            contentType,
            fileExtension,
            fileName,
            thumbnail,
            title: `${info.data.title.slice(0, 30)}...`,
            video: info.data.video,
            video_hd: info.data.video_hd,
            audio: info.data.audio
        }];

        return res.json(responseData);
    } catch (error) {
        console.error("Error fetching video info:", error);
        handleError(res, 500, "Internal Server Error");
    }
});

app.get('/instadl', async (req, res) => {
    const url = req.query.url;
    if (!url) return handleError(res, 400, "URL parameter is required");

    try {
        const info = await ndown(url);
        if (!info.status) return handleError(res, 403, "Unfortunately, We cannot download videos from personal pages.");

        const data = filterUniqueImages(info.data);
        if (data && data.length > 0) {
            const processedData = await processMediaData(data);
            return res.json(processedData);
        } else {
            return handleError(res, 404, "No media found");
        }
    } catch (error) {
        console.error("Error fetching media info:", error);
        handleError(res, 500, "Internal Server Error");
    }
});

app.get('/fbdl', async (req, res) => {
    const url = req.query.url;
    if (!url) return handleError(res, 400, "URL parameter is required");

    try {
        const info = await ndown(url);
        if (!info.status) return handleError(res, 403, "Sorry, we couldn't find the media you're looking for.");

        if (info.data && info.data.length > 0) {
            const processedData = await processMediaData(info.data);
            return res.json(processedData);
        } else {
            return handleError(res, 404, "No media found");
        }
    } catch (error) {
        console.error("Error processing request:", error);
        handleError(res, 500, "Internal Server Error");
    }
});

app.get('/xdl', async (req, res) => {
    const url = req.query.url;
    if (!url) return handleError(res, 400, "URL parameter is required");

    try {
        const info = await twitterdown(url);

        const dataStatus = Object.values(info.data)[0]

        if (dataStatus === undefined) return handleError(res, 403, "Sorry, we couldn't find the media you're looking for.");
        const data = Object.entries(info.data).map(([resolution, url]) => ({ resolution, url }))

        if (data && data.length > 0) {
            const processedData = await processMediaData(data);
            return res.json(processedData);
        } else {
            return handleError(res, 404, "No media found");
        }
    } catch (error) {
        console.error("Error processing request:", error);
        handleError(res, 500, "Internal Server Error");
    }


});

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});