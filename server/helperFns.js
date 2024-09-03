function filterUniqueImages(images) {
    const seenThumbnails = new Map();

    // Track the latest URL for each thumbnail
    images.forEach(image => {
        const thumbnail = image.thumbnail;
        const url = image.url;
        seenThumbnails.set(thumbnail, url);
    });

    // Convert map to array of unique images
    return Array.from(seenThumbnails, ([thumbnail, url]) => ({
        thumbnail,
        url
    }));
}
const filterFormats = (formats) => {
    return formats
        .filter(format => format.mimeType && format.mimeType.startsWith("video/") && format.audioQuality) // Ensure both video and audio are present
        .map(format => ({
            url: format.url,
            qualityLabel: format.qualityLabel || "Unknown",
            mimeType: format.mimeType || "Unknown"
        }));
};
module.exports = { filterUniqueImages, filterFormats };
