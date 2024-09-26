# Videoloot - Online Media Downloader

**Videoloot** is an online media downloader that allows you to download videos and posts from various social media platforms, including Facebook, Twitter (X), YouTube, and Instagram.

> **Important**: Videoloot supports downloading from public profiles only. Media from private accounts is not accessible.

## Features

- **YouTube**: Download YouTube videos.
- **Instagram**: Download Instagram stories, posts, reels, IGTV, etc.
- **Facebook**: Download Facebook posts, reels, and videos.
- **Twitter (X)**: Download Twitter (X) videos.

> **Note**: Sometimes the actual media data may differ, meaning the downloaded content may not exactly match the displayed media, or the media may not be available at all.

## Progressive Web App (PWA) Features

Videoloot is now a **PWA**, meaning you can install it on your device for faster access, offline capabilities, and a native-like experience.

### How to Install

- **On Desktop**:
  1. Open Videoloot in Chrome, Edge, or any PWA-supported browser.
  2. Click the install button in the address bar or the "Add to Home Screen" option from the browser menu.
- **On Mobile (Android)**:
  1. Open Videoloot in your browser (Chrome, Edge, etc.).
  2. Tap the three dots in the top-right corner and select "Add to Home Screen."
  3. Follow the on-screen instructions to add the app to your home screen.
- **On iOS (Safari)**:
  1. Open Videoloot in Safari.
  2. Tap the share icon at the bottom of the screen and select "Add to Home Screen."
  3. Follow the instructions to install the app.

Once installed, you can access Videoloot directly from your home screen or app drawer without needing to open a browser.

## Folder Structure

- **client**: The frontend is built using Vite.
- **server**: The backend is built using Node.js.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jafeershaik5/VideoLoot-online-media-downloader.git
   cd videoloot-online-media-downloader
   ```

2. **Backend Setup**:

   - Navigate to the `server` folder and install dependencies:

     ```bash
     cd server
     npm install
     ```

   - Start the Node.js server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**:

   - Navigate to the `client` folder and install dependencies:

     ```bash
     cd client
     npm install
     ```

   - Create a `.env` file in the `client` folder and add the following line:

     ```bash
     VITE_API_URL=http://localhost:4000
     ```

   - Start the Vite development server:
     ```bash
     npm run dev
     ```

4. **Access the application**:
   - Open your browser and go to `http://localhost:5173/`.

## Technologies Used

- **Frontend**: Vite, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Other Libraries**: Axios, TanStack React Query, Plyr.js

## Usage

- **YouTube**: Enter the YouTube video URL to fetch and download the video in available formats.
- **Instagram**: Paste the Instagram URL to download media, including stories, posts, reels, and IGTV.
- **Facebook**: Enter the URL of Facebook posts, reels, or videos to download.
- **Twitter**: Provide the Twitter video URL to download videos from Twitter.

## Known Issues

- Media availability can sometimes differ from what is shown on the platform.
- Some media may not be available due to API limitations or platform restrictions.

## Future Enhancements

- Support for additional platforms.
- Adding more customization options for media downloads (resolution, format, etc.).
- Improving the user interface for better performance and user experience.

## Contributing

Feel free to fork this repository and contribute by submitting pull requests. Any contributions are greatly appreciated!
