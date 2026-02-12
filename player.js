// Enhanced Player with HLS.js Support, Server Selector with Checkboxes
// This file extends the main app.js with advanced player features

// Track selected server
window._selectedServerIndex = 0;
window._selectedEpisodeIndex = 0;

// Override the playEpisode function with enhanced version
window.playEpisode = (embedUrl, episodeName, serverIndex = 0, episodeIndex = 0) => {
    const els = {
        movieModal: document.getElementById('movieModal'),
        playerModal: document.getElementById('playerModal'),
        playerContainer: document.getElementById('playerContainer')
    };

    els.movieModal.classList.remove('active');
    els.playerModal.classList.add('active');

    const movie = window.state?.currentMovie;

    // Validate movie data
    if (!movie) {
        els.playerContainer.innerHTML = `
            <div class="player-error">
                <p>Không tìm thấy thông tin phim. Vui lòng thử lại.</p>
                <button onclick="closePlayer()" class="btn btn-primary">Đóng</button>
            </div>
        `;
        return;
    }

    if (!movie.episodes || !Array.isArray(movie.episodes) || movie.episodes.length === 0) {
        els.playerContainer.innerHTML = `
            <div class="player-error">
                <p>Phim này chưa có tập nào để xem.</p>
                <button onclick="closePlayer()" class="btn btn-primary" style="margin-top: 20px;">Đóng</button>
            </div>
        `;
        return;
    }

    // Validate server/episode index
    if (!movie.episodes[serverIndex]) serverIndex = 0;
    const currentServer = movie.episodes[serverIndex];
    if (!currentServer.server_data || currentServer.server_data.length === 0) {
        els.playerContainer.innerHTML = `
            <div class="player-error">
                <p>Server này không có dữ liệu phim.</p>
                <button onclick="closePlayer()" class="btn btn-primary" style="margin-top: 20px;">Đóng</button>
            </div>
        `;
        return;
    }
    if (episodeIndex >= currentServer.server_data.length) episodeIndex = 0;

    // Save selected indices
    window._selectedServerIndex = serverIndex;
    window._selectedEpisodeIndex = episodeIndex;

    const currentEpisode = currentServer.server_data[episodeIndex];
    const m3u8Url = currentEpisode.link_m3u8;
    const actualEmbedUrl = currentEpisode.link_embed || embedUrl;

    // ===== BUILD SERVER SELECTOR WITH CHECKBOXES =====
    // Group servers by language type
    const serverGroups = {};
    movie.episodes.forEach((server, idx) => {
        const name = server.server_name || `Server ${idx + 1}`;
        let type = 'other';
        const nameLower = name.toLowerCase();
        if (nameLower.includes('vietsub')) type = 'vietsub';
        else if (nameLower.includes('lồng tiếng') || nameLower.includes('long tieng') || nameLower.includes('lồng')) type = 'longtien';
        else if (nameLower.includes('thuyết minh') || nameLower.includes('thuyet minh')) type = 'thuyetminh';

        if (!serverGroups[type]) serverGroups[type] = [];
        serverGroups[type].push({ name, idx, server });
    });

    const typeLabels = {
        vietsub: { label: 'Vietsub', icon: '🇻🇳', color: '#10b981' },
        longtien: { label: 'Lồng Tiếng', icon: '🎙️', color: '#f59e0b' },
        thuyetminh: { label: 'Thuyết Minh', icon: '🗣️', color: '#3b82f6' },
        other: { label: 'Server khác', icon: '🎬', color: '#8b5cf6' },
    };

    let serverSelectorHTML = '<div class="server-groups">';
    for (const [type, servers] of Object.entries(serverGroups)) {
        const info = typeLabels[type] || typeLabels.other;
        serverSelectorHTML += `
            <div class="server-group">
                <div class="server-group-header" style="--group-color: ${info.color}">
                    <span class="group-icon">${info.icon}</span>
                    <span class="group-label">${info.label}</span>
                    <span class="group-count">${servers.length} server</span>
                </div>
                <div class="server-group-items">
                    ${servers.map(s => `
                        <label class="server-radio-item ${s.idx === serverIndex ? 'selected' : ''}" data-server-idx="${s.idx}">
                            <input type="radio" name="serverSelect" value="${s.idx}" 
                                   ${s.idx === serverIndex ? 'checked' : ''}
                                   onchange="switchServer(${s.idx}, 0)">
                            <span class="radio-custom" style="--radio-color: ${info.color}"></span>
                            <span class="server-label">${s.name}</span>
                            ${s.idx === serverIndex ? '<span class="now-playing-badge">▶ Đang phát</span>' : ''}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    serverSelectorHTML += '</div>';

    // ===== BUILD EPISODE LIST =====
    const totalEpisodes = currentServer.server_data.length;
    const hasPrev = episodeIndex > 0;
    const hasNext = episodeIndex < totalEpisodes - 1;

    const episodeList = currentServer.server_data.map((ep, idx) => `
        <button class="ep-chip ${idx === episodeIndex ? 'active' : ''}" 
                onclick="switchEpisode(${serverIndex}, ${idx})"
                title="Xem ${ep.name}">
            ${idx === episodeIndex ? '▶ ' : ''}${ep.name}
        </button>
    `).join('');

    // ===== BUILD VIDEO PLAYER =====
    let videoHTML;
    if (m3u8Url && m3u8Url.trim() !== '') {
        videoHTML = `
            <div class="video-container" id="videoPlayerContainer">
                <video id="hlsVideoPlayer" controls autoplay playsinline>
                    Your browser does not support the video tag.
                </video>
                <div id="playerLoading" class="player-loading">
                    <div class="loading-spinner"></div>
                    <p>Đang tải phim...</p>
                </div>
            </div>
        `;
    } else {
        videoHTML = `
            <div class="video-container" id="videoPlayerContainer">
                <iframe src="${actualEmbedUrl}" allowfullscreen 
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    frameborder="0" scrolling="no"></iframe>
            </div>
        `;
    }

    // ===== PLAYER MODE TOGGLE =====
    const playerModeHTML = (m3u8Url && m3u8Url.trim() !== '') ? `
        <div class="player-mode-bar">
            <button class="pmode-btn active" id="hlsMode" onclick="setPlayerMode('hls', ${serverIndex}, ${episodeIndex})">
                ▶ HLS Player
            </button>
            <button class="pmode-btn" id="embedMode" onclick="setPlayerMode('embed', ${serverIndex}, ${episodeIndex})">
                🔗 Embed Player
            </button>
            <span class="pmode-hint">Nếu không xem được, thử chuyển sang Embed</span>
        </div>
    ` : '';

    // ===== ASSEMBLE PLAYER =====
    els.playerContainer.innerHTML = `
        <div class="player-wrap">
            <div class="player-top-bar">
                <div class="player-movie-info">
                    <h3 class="player-movie-name">${movie.name}</h3>
                    <span class="player-ep-badge">${episodeName}</span>
                </div>
                <button class="player-close-btn" onclick="closePlayer()" title="Đóng">✕</button>
            </div>

            ${videoHTML}
            ${playerModeHTML}

            <div class="player-nav-bar">
                <button class="nav-ep-btn" ${!hasPrev ? 'disabled' : ''} 
                        onclick="${hasPrev ? `switchEpisode(${serverIndex}, ${episodeIndex - 1})` : ''}">
                    ⏮ Tập trước
                </button>
                <span class="nav-ep-current">Tập ${episodeIndex + 1} / ${totalEpisodes}</span>
                <button class="nav-ep-btn" ${!hasNext ? 'disabled' : ''} 
                        onclick="${hasNext ? `switchEpisode(${serverIndex}, ${episodeIndex + 1})` : ''}">
                    Tập sau ⏭
                </button>
            </div>

            <div class="player-panel">
                <div class="panel-section">
                    <h4 class="panel-title">🖥️ Chọn nguồn phát</h4>
                    ${serverSelectorHTML}
                </div>
                
                <div class="panel-section">
                    <h4 class="panel-title">📋 Danh sách tập <span class="ep-total">(${totalEpisodes} tập)</span></h4>
                    <div class="ep-chip-grid">${episodeList}</div>
                </div>
            </div>

            <div class="player-meta-bar">
                <div class="meta-chip"><strong>Server:</strong> ${currentServer.server_name}</div>
                <div class="meta-chip"><strong>Tập:</strong> ${episodeName}</div>
                <div class="meta-chip"><strong>Chất lượng:</strong> ${movie.quality || 'HD'}</div>
                <div class="meta-chip"><strong>Ngôn ngữ:</strong> ${movie.lang || 'Vietsub'}</div>
            </div>
        </div>
    `;

    // Initialize HLS player if using m3u8
    if (m3u8Url && m3u8Url.trim() !== '') {
        initHLSPlayer(m3u8Url);
    }

    els.playerModal.scrollTop = 0;
};

// ===== HLS PLAYER =====
function initHLSPlayer(m3u8Url) {
    const video = document.getElementById('hlsVideoPlayer');
    const loading = document.getElementById('playerLoading');
    if (!video) return;

    if (typeof Hls !== 'undefined') {
        if (Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60, startLevel: -1 });
            hls.loadSource(m3u8Url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (loading) loading.style.display = 'none';
                video.play().catch(() => { if (loading) loading.style.display = 'none'; });
            });
            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
                    else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
                    else { hls.destroy(); fallbackToEmbed(); }
                }
            });
            window._currentHls = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = m3u8Url;
            video.addEventListener('loadedmetadata', () => {
                if (loading) loading.style.display = 'none';
                video.play().catch(() => { });
            });
        }
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.onload = () => initHLSPlayer(m3u8Url);
        script.onerror = () => fallbackToEmbed();
        document.head.appendChild(script);
    }
}

function fallbackToEmbed() {
    const movie = window.state?.currentMovie;
    const container = document.getElementById('videoPlayerContainer');
    if (!movie || !container) return;
    const si = window._selectedServerIndex || 0;
    const ei = window._selectedEpisodeIndex || 0;
    const ep = movie.episodes?.[si]?.server_data?.[ei];
    if (ep?.link_embed) {
        container.innerHTML = `<iframe src="${ep.link_embed}" allowfullscreen 
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            frameborder="0" scrolling="no"></iframe>`;
    }
}

// ===== PLAYER MODE =====
window.setPlayerMode = (mode, serverIndex, episodeIndex) => {
    const movie = window.state?.currentMovie;
    if (!movie) return;
    const ep = movie.episodes[serverIndex]?.server_data[episodeIndex];
    if (!ep) return;
    const container = document.getElementById('videoPlayerContainer');
    if (!container) return;

    if (window._currentHls) { window._currentHls.destroy(); window._currentHls = null; }

    document.querySelectorAll('.pmode-btn').forEach(b => b.classList.remove('active'));

    if (mode === 'hls' && ep.link_m3u8) {
        document.getElementById('hlsMode')?.classList.add('active');
        container.innerHTML = `
            <video id="hlsVideoPlayer" controls autoplay playsinline>
                Your browser does not support the video tag.
            </video>
            <div id="playerLoading" class="player-loading">
                <div class="loading-spinner"></div>
                <p>Đang tải phim...</p>
            </div>
        `;
        initHLSPlayer(ep.link_m3u8);
    } else {
        document.getElementById('embedMode')?.classList.add('active');
        container.innerHTML = `<iframe src="${ep.link_embed}" allowfullscreen 
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            frameborder="0" scrolling="no"></iframe>`;
    }
};

// ===== EPISODE / SERVER SWITCH =====
window.switchEpisode = (serverIndex, episodeIndex) => {
    const movie = window.state?.currentMovie;
    if (!movie?.episodes?.[serverIndex]?.server_data?.[episodeIndex]) return;
    if (window._currentHls) { window._currentHls.destroy(); window._currentHls = null; }
    const ep = movie.episodes[serverIndex].server_data[episodeIndex];
    playEpisode(ep.link_embed, ep.name, serverIndex, episodeIndex);
};

window.switchServer = (serverIndex, episodeIndex = 0) => {
    const movie = window.state?.currentMovie;
    if (!movie?.episodes?.[serverIndex]?.server_data?.[episodeIndex]) return;
    if (window._currentHls) { window._currentHls.destroy(); window._currentHls = null; }
    const ep = movie.episodes[serverIndex].server_data[episodeIndex];
    playEpisode(ep.link_embed, ep.name, serverIndex, episodeIndex);
};

// ===== CLOSE PLAYER =====
window.closePlayer = () => {
    if (window._currentHls) { window._currentHls.destroy(); window._currentHls = null; }
    const video = document.getElementById('hlsVideoPlayer');
    if (video) { video.pause(); video.src = ''; }
    document.getElementById('playerModal').classList.remove('active');
    document.getElementById('movieModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('playerContainer').innerHTML = '';
};

console.log('Enhanced player with HLS.js support loaded successfully');
