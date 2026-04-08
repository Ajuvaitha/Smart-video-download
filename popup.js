document.addEventListener('DOMContentLoaded', () => {
  const videoList = document.getElementById('video-list');
  const emptyState = document.getElementById('empty-state');
  const clearBtn = document.getElementById('clearBtn');
  const loading = document.getElementById('loading');

  // Load videos from storage
  function loadVideos() {
    videoList.classList.add('hidden');
    emptyState.classList.add('hidden');
    loading.classList.remove('hidden');

    chrome.storage.local.get(['detectedVideos'], (result) => {
      loading.classList.add('hidden');
      const videos = result.detectedVideos || [];
      
      if (videos.length === 0) {
        emptyState.classList.remove('hidden');
        videoList.classList.add('hidden');
      } else {
        emptyState.classList.add('hidden');
        videoList.classList.remove('hidden');
        renderVideos(videos);
      }
    });
  }

  function renderVideos(videos) {
    videoList.innerHTML = '';
    
    videos.forEach((video, index) => {
      const li = document.createElement('li');
      li.className = 'video-item';
      
      const shortUrl = video.url.length > 50 ? video.url.substring(0, 47) + '...' : video.url;
      const fileName = extractFileName(video.url) || `video_${index + 1}.${video.format.toLowerCase()}`;
      
      li.innerHTML = `
        <div class="video-info">
          <div class="video-badges">
            <span class="badge format">${video.format}</span>
            <span class="badge size">${video.size || 'Unknown size'}</span>
          </div>
          <div class="video-url" title="${video.url}">${shortUrl}</div>
        </div>
        <button class="download-btn" data-url="${video.url}" data-filename="${fileName}" ${video.format === 'HLS (.M3U8)' ? 'disabled title="Direct download of HLS streams not supported. Use external tool."' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
      `;
      
      videoList.appendChild(li);
    });

    // Add download event listeners
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        if (target.disabled) return;
        
        const url = target.getAttribute('data-url');
        const filename = target.getAttribute('data-filename');
        
        target.classList.add('downloading');
        
        chrome.downloads.download({
          url: url,
          filename: filename,
          saveAs: true
        }, (downloadId) => {
          setTimeout(() => {
            target.classList.remove('downloading');
          }, 1000);
        });
      });
    });
  }

  function extractFileName(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.includes('.')) {
        return lastPart;
      }
      return null;
    } catch {
      return null;
    }
  }

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.set({ detectedVideos: [] }, () => {
      loadVideos();
    });
  });

  // Initial load
  loadVideos();

  // Listen for changes in storage (real-time updates)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.detectedVideos) {
      loadVideos();
    }
  });
});
