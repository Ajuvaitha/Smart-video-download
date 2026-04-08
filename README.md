# Smart Video Downloader

A Chrome Extension (Manifest V3) that detects video files (MP4, WebM, M3U8) from browser network requests and provides a clean UI for downloading.

## 🚀 How to Run

### Method 1: Automatic (MacOS)
If you are on MacOS, you can run the following in your terminal from the project directory:
```bash
npm run run:chrome
```

### Method 2: Manual (Universal)
1. Open **Chrome** and go to `chrome://extensions/`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select this directory.

## 🛠 Features
- Detects video URLs in real-time.
- Supports `.mp4`, `.webm`, and detects `.m3u8` streams.
- Persistent storage using `chrome.storage.local`.
- Clean, modern UI with clear feedback.
- Prevents duplicates and provides a "Clear All" option.

## ⚠️ Important Note
- **YouTube Support**: Not included (per Chrome Extension policies).
- **HLS Streams**: Detected but direct download is disabled as they require a muxer/special tool.

## 📜 License
This project is for educational purposes.
