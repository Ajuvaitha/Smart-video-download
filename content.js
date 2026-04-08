// Content script – runs on every page (document_idle)

// Helper to decide if a URL is a video we care about
function extractVideoInfo(src) {
  const lower = src.toLowerCase();
  const isM3U8 = lower.includes('.m3u8');
  const isMP4  = lower.includes('.mp4');
  const isWebM = lower.includes('.webm');

  if (!isM3U8 && !isMP4 && !isWebM) return null;

  const format = isM3U8 ? 'HLS (.m3u8)' : isMP4 ? 'MP4' : 'WEBM';
  return {
    url: src,
    format,
    size: 'Unknown',
    timestamp: Date.now()
  };
}

// Scan the page for <video>, <source>, <a>, <link> that point to video files
function scanPageForVideos() {
  const found = [];

  // <video src>
  document.querySelectorAll('video[src]').forEach(v => {
    const info = extractVideoInfo(v.src);
    if (info) found.push(info);
  });

  // <source src> inside <video>
  document.querySelectorAll('video source[src]').forEach(s => {
    const info = extractVideoInfo(s.src);
    if (info) found.push(info);
  });

  // Any <a> or <link> that looks like a video URL
  document.querySelectorAll('a[href], link[href]').forEach(el => {
    const href = el.getAttribute('href');
    const info = extractVideoInfo(href);
    if (info) found.push(info);
  });

  return found;
}

// Send each discovered video to the background script
function reportVideos() {
  const videos = scanPageForVideos();
  videos.forEach(v => {
    chrome.runtime.sendMessage({ type: 'videoDetected', video: v }, () => {});
  });
}

// Run when the page is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  reportVideos();
} else {
  window.addEventListener('load', reportVideos);
}
