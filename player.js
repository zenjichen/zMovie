// Enhanced Player with Server Selector and Episode List
// This file extends the main app.js with advanced player features

// Override the playEpisode function with enhanced version
window.playEpisode = (embedUrl, episodeName, serverIndex = 0, episodeIndex = 0) => {
    const elements = {
        movieModal: document.getElementById('movieModal'),
        playerModal: document.getElementById('playerModal'),
        playerContainer: document.getElementById('playerContainer')
    };

    elements.movieModal.classList.remove('active');
    elements.playerModal.classList.add('active');

    const movie = window.state?.currentMovie;

    // Debug logging
    console.log('Player - Current Movie:', movie);
    console.log('Player - Episodes:', movie?.episodes);

    // Validate movie data
    if (!movie) {
        elements.playerContainer.innerHTML = `
            <div class="player-error">
                <p>Không tìm thấy thông tin phim. Vui lòng thử lại.</p>
                <button onclick="closePlayer()" class="btn btn-primary">Đóng</button>
            </div>
        `;
        return;
    }

    if (!movie.episodes || !Array.isArray(movie.episodes) || movie.episodes.length === 0) {
        elements.playerContainer.innerHTML = `
            <div class="player-error">
                <p>Phim này chưa có tập nào để xem.</p>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 10px;">
                    Vui lòng thử lại sau hoặc chọn phim khác.
                </p>
                <button onclick="closePlayer()" class="btn btn-primary" style="margin-top: 20px;">Đóng</button>
            </div>
        `;
        return;
    }

    // Validate server index
    if (!movie.episodes[serverIndex]) {
        console.error('Invalid server index:', serverIndex);
        serverIndex = 0;
    }

    const currentServer = movie.episodes[serverIndex];

    // Validate server data
    if (!currentServer.server_data || !Array.isArray(currentServer.server_data) || currentServer.server_data.length === 0) {
        elements.playerContainer.innerHTML = `
            <div class="player-error">
                <p>Server này không có dữ liệu phim.</p>
                <button onclick="closePlayer()" class="btn btn-primary" style="margin-top: 20px;">Đóng</button>
            </div>
        `;
        return;
    }

    // Validate episode index
    if (episodeIndex >= currentServer.server_data.length) {
        episodeIndex = 0;
    }

    // Build server tabs
    const serverTabs = movie.episodes.map((server, idx) => `
        <button class="server-tab ${idx === serverIndex ? 'active' : ''}" 
                onclick="switchServer(${idx}, 0)"
                title="${server.server_name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
            ${server.server_name}
        </button>
    `).join('');

    // Build episode list for current server
    const episodeList = currentServer.server_data.map((ep, idx) => `
        <button class="episode-item ${idx === episodeIndex ? 'active' : ''}" 
                onclick="playEpisode('${ep.link_embed.replace(/'/g, "\\'")}', '${ep.name.replace(/'/g, "\\'")}', ${serverIndex}, ${idx})"
                title="Xem ${ep.name}">
            ${ep.name}
        </button>
    `).join('');

    // Calculate episode navigation
    const totalEpisodes = currentServer.server_data.length;
    const hasPrev = episodeIndex > 0;
    const hasNext = episodeIndex < totalEpisodes - 1;

    elements.playerContainer.innerHTML = `
        <div class="player-wrapper">
            <div class="player-header">
                <div class="player-title">
                    <h3>${movie.name}</h3>
                    <span class="episode-badge">${episodeName}</span>
                </div>
                <button class="close-player" onclick="closePlayer()" title="Đóng">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            
            <div class="video-container">
                <iframe 
                    src="${embedUrl}" 
                    allowfullscreen 
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    frameborder="0"
                    scrolling="no">
                </iframe>
            </div>
            
            <div class="player-controls">
                <button class="control-btn" ${!hasPrev ? 'disabled' : ''} 
                        onclick="${hasPrev ? `playEpisode('${currentServer.server_data[episodeIndex - 1].link_embed.replace(/'/g, "\\'")}', '${currentServer.server_data[episodeIndex - 1].name.replace(/'/g, "\\'")}', ${serverIndex}, ${episodeIndex - 1})` : 'return false'}"
                        title="Tập trước">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                    Tập trước
                </button>
                
                <div class="episode-info">
                    <span>Tập ${episodeIndex + 1}/${totalEpisodes}</span>
                </div>
                
                <button class="control-btn" ${!hasNext ? 'disabled' : ''}
                        onclick="${hasNext ? `playEpisode('${currentServer.server_data[episodeIndex + 1].link_embed.replace(/'/g, "\\'")}', '${currentServer.server_data[episodeIndex + 1].name.replace(/'/g, "\\'")}', ${serverIndex}, ${episodeIndex + 1})` : 'return false'}"
                        title="Tập sau">
                    Tập sau
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 18h2V6h-2zm-11-6l8.5-6v12z"/>
                    </svg>
                </button>
            </div>
            
            <div class="server-selector">
                <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    Chọn Server
                </h4>
                <div class="server-tabs">${serverTabs}</div>
            </div>
            
            <div class="episode-selector">
                <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                    </svg>
                    Danh sách tập (${totalEpisodes} tập)
                </h4>
                <div class="episode-grid">${episodeList}</div>
            </div>
            
            <div class="player-info">
                <div class="info-item">
                    <strong>Server:</strong> ${currentServer.server_name}
                </div>
                <div class="info-item">
                    <strong>Tập hiện tại:</strong> ${episodeName}
                </div>
                <div class="info-item">
                    <strong>Chất lượng:</strong> ${movie.quality || 'HD'}
                </div>
                <div class="info-item">
                    <strong>Ngôn ngữ:</strong> ${movie.lang || 'Vietsub'}
                </div>
            </div>
        </div>
    `;

    // Scroll to top of player
    elements.playerModal.scrollTop = 0;
};

// Switch Server function
window.switchServer = (serverIndex, episodeIndex = 0) => {
    const movie = window.state?.currentMovie;
    if (!movie || !movie.episodes || !movie.episodes[serverIndex]) {
        console.error('Invalid server index');
        return;
    }

    const server = movie.episodes[serverIndex];
    if (!server.server_data || !server.server_data[episodeIndex]) {
        console.error('Invalid episode index');
        return;
    }

    const episode = server.server_data[episodeIndex];
    playEpisode(episode.link_embed, episode.name, serverIndex, episodeIndex);
};

// Close Player function
window.closePlayer = () => {
    const playerModal = document.getElementById('playerModal');
    const movieModal = document.getElementById('movieModal');

    playerModal.classList.remove('active');
    movieModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

console.log('Enhanced player loaded successfully');
