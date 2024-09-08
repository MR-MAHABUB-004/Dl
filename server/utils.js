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
// Utility function to fetch file type
const getFileType = async (mediaUrl) => {
    let contentType = 'application/octet-stream';
    let fileExtension = 'bin';
    try {
        const got = (await import('got')).default;
        const { fileTypeFromStream } = await import('file-type');
        const stream = got.stream(mediaUrl);
        const fileTypeInfo = await fileTypeFromStream(stream);
        if (fileTypeInfo) {
            contentType = fileTypeInfo.mime;
            fileExtension = fileTypeInfo.ext;
        }
    } catch (error) {
        console.warn("Error fetching file data:", error);
    }
    return { contentType, fileExtension };
};

// Utility function to process media data
const processMediaData = async (mediaItems) => {
    return Promise.all(mediaItems.map(async (item) => {
        const { contentType, fileExtension } = await getFileType(item.url);
        return {
            thumbnail: item.thumbnail,
            url: item.url,
            contentType,
            fileExtension,
            resolution: item.resolution || null
        };
    }));
};

module.exports = { filterUniqueImages, processMediaData, getFileType };
