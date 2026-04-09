# 🎬 Smart Video Downloader Chrome Extension

A powerful Chrome Extension that detects and downloads video files from web pages by monitoring browser network activity. Built using Manifest V3 and Chrome APIs, this project demonstrates real-world browser-level programming and event-driven architecture.

---

## 🚀 Features

* 🔍 Detects video resources in real-time (MP4, WebM, M3U8)
* 📥 Download videos directly from the browser
* 🧠 Intelligent filtering of media requests
* ⚡ Fast and lightweight extension
* 📋 Displays detected videos in a clean popup UI
* ♻️ Prevents duplicate entries
* 🗑️ Clear all detected videos with one click

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* JavaScript (ES6)
* Chrome Extension APIs (Manifest V3)

  * chrome.webRequest
  * chrome.downloads
  * chrome.storage

---

## 🧩 How It Works

1. The extension listens to browser network requests using the **WebRequest API**
2. It filters video resources such as:

   * `.mp4`
   * `.webm`
   * `.m3u8`
3. Detected video URLs are stored using **Chrome Storage API**
4. The popup UI dynamically displays detected videos
5. Users can download videos using the **Downloads API**

---

## 📁 Project Structure

```
video-downloader-extension/
│
├── manifest.json        # Extension configuration
├── background.js        # Detects video requests
├── popup.html           # UI layout
├── popup.js             # Handles UI logic
├── style.css            # Styling
```

---

## ⚙️ Installation (Run Locally)

1. Download or clone this repository
2. Open Google Chrome and go to:

   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode** (top right)
4. Click **Load Unpacked**
5. Select the project folder

✅ Your extension is now ready to use!

---

## 🧪 Usage

1. Open any website with video content
2. Click on the extension icon
3. View detected video links
4. Click **Download** to save the video

---

## ⚠️ Limitations

* ❌ Does not support YouTube downloads (Chrome policy)
* ❌ Some DRM-protected videos cannot be downloaded
* ⚠️ HLS (.m3u8) streams may require backend processing

---

## 🔮 Future Improvements

*  1. Video quality selection (360p, 720p, 1080p)
*  2. Download progress indicator
*  3. Convert video to audio (MP3)
*  4. Backend integration using `yt-dlp`
*  5. Download history tracking
*  6. Enhanced UI/UX

---

## 💡 Learning Outcomes

* Understanding of browser internals
* Working with Chrome Extension APIs
* Event-driven programming
* Real-time data handling
* Building production-level tools

---

## 👨‍💻 Author

**Ajuvaitha K**
B.E CSE (IoT & Cyber Security)
SNS College of Engineering

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
