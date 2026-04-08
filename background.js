// Smart Video Downloader - Background Service Worker

// -------------------------------------------------
// Helper functions
// -------------------------------------------------
const isYouTube = (url) => {
  try {
    const u = new URL(url);
    return u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be');
  } catch {
    return false;
  }
};

const isVideoUrl = (url) => {
  const exts = ['.mp4', '.webm', '.m3u8'];
  const lower = url.toLowerCase();
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return exts.some(e => path.endsWith(e) || lower.includes(e));
  } catch {
    return exts.some(e => lower.includes(e));
  }
};

// Ad‑filter – ignore URLs that look like ads (same list used in content)
const isAdUrl = (url) => {
  const adPatterns = [
    'adservice', 'doubleclick', 'ads.', '/ad/', '/ads/', 'ad.', 'advert',
    'adframe', 'googlesyndication', 'adclick', 'adnetwork', 'adtag', 'adserver'
  ];
  const lower = url.toLowerCase();
  return adPatterns.some(p => lower.includes(p));
};

// Normalise a URL – strip query string and fragment
const normaliseUrl = (url) => {
  try {
    const u = new URL(url);
    u.search = '';
    u.hash = '';
    return u.toString();
  } catch {
    return url; // fallback – should not happen for valid URLs
  }
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// -------------------------------------------------
// Store video data (deduplication + normalisation)
// -------------------------------------------------
function addVideoToStorage(videoObj) {
  const normUrl = normaliseUrl(videoObj.url);
  videoObj.url = normUrl; // store the normalised version

  chrome.storage.local.get(['detectedVideos'], (res) => {
    const videos = res.detectedVideos || [];

    // avoid duplicates (by normalised URL)
    if (!videos.some(v => v.url === normUrl)) {
      videos.unshift(videoObj);
      if (videos.length > 100) videos.length = 100; // keep only recent 100
      chrome.storage.local.set({ detectedVideos: videos });
    }
  });
}

// -------------------------------------------------
// Listen to network requests (webRequest)
// -------------------------------------------------
chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    console.log('🔎 Request started:', details.url);
    if (!details.url || isYouTube(details.url) || isAdUrl(details.url)) return;

    let isVideo = isVideoUrl(details.url);
    let size = 'Unknown';
    let format = 'unknown';

    const ct = details.responseHeaders?.find(h => h.name.toLowerCase() === 'content-type');
    if (ct && ct.value && ct.value.startsWith('video/')) isVideo = true;
    if (ct && ct.value && (ct.value.includes('mpegurl') || ct.value.includes('x-mpegURL'))) isVideo = true;

    if (isVideo) {
      const cl = details.responseHeaders?.find(h => h.name.toLowerCase() === 'content-length');
      if (cl && cl.value) {
        const bytes = parseInt(cl.value, 10);
        if (!isNaN(bytes)) size = formatBytes(bytes);
      }

      if (details.url.includes('.m3u8') || (ct && ct.value && ct.value.includes('mpegurl'))) {
        format = 'HLS (.m3u8)';
      } else if (ct && ct.value) {
        format = ct.value.split('/')[1] || format;
      } else {
        const m = details.url.match(/\.(mp4|webm|m3u8)/i);
        if (m) format = m[1];
      }

      const video = {
        url: details.url,
        format: format.toUpperCase(),
        size,
        timestamp: Date.now()
      };
      addVideoToStorage(video);
      console.log('✅ Video detected and stored:', video);
    }
  },
  { urls: ['<all_urls>'] },
  ['responseHeaders', 'extraHeaders']
);

// -------------------------------------------------
// Receive messages from the content script (DOM detection)
// -------------------------------------------------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'videoDetected' && msg.video?.url && !isAdUrl(msg.video.url)) {
    console.log('📦 Message from content script →', msg.video);
    addVideoToStorage(msg.video);
    sendResponse({ received: true });
  }
  return false; // synchronous response
});
