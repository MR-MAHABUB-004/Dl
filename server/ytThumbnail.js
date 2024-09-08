function getThumbnail(link, quality) {
    if (link && quality) {
        const videoid = youtube_parser(link)
        if (videoid) {
            switch (quality) {
                case 'max':
                    return `https://i1.ytimg.com/vi/${videoid}/maxresdefault.jpg`
                case 'hq':
                    return `https://i1.ytimg.com/vi/${videoid}/hqdefault.jpg`
                case 'mq':
                    return `https://i1.ytimg.com/vi/${videoid}/mqdefault.jpg`
                case 'sd':
                    return `https://i1.ytimg.com/vi/${videoid}/sddefault.jpg`
                case 'default':
                    return `https://i1.ytimg.com/vi/${videoid}/default.jpg`
                default:
                    return 'Please provide proper input for quality (max,hq,mq,sd,default)'
            }
        } else {
            return 'Please check youtube video link'
        }
    } else {
        return 'Please provide link and quality'
    }
}

function youtube_parser(url) {
    // Define the regular expression to match YouTube URLs and capture video ID
    var regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:embed\/|v\/|.+\?v=)|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;

    // Match the URL against the regular expression
    var match = url.match(regExp);

    // Return the video ID if found, otherwise return false
    return (match && match[1].length == 11) ? match[1] : false;
}

module.exports = getThumbnail;