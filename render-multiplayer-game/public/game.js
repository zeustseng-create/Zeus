// 多人線上射擊遊戲主程式
class MultiplayerShooterGame {
    constructor() {
        this.currentScreen = 'mainMenu';
        this.gameState = 'menu'; // menu, waiting, playing, gameOver
        this.socket = null;
        this.roomId = null;
        this.playerId = null;
        this.playerName = '';
        this.currentRoom = null;
        
        // 遊戲畫布和上下文
        this.canvas = null;
        this.ctx = null;
        
        // 遊戲數據
        this.gameData = {
            health: 100,
            kills: 0,
            deaths: 0,
            gameTime: 0
        };
        
        // 遊戲物件
        this.player = null;
        this.otherPlayers = [];
        this.serverBullets = [];
        this.obstacles = [];
        
        // 輸入處理
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        // 遊戲設定
        this.gameConfig = {
            playerSpeed: 5,
            bulletSpeed: 10,
            fireRate: 200, // 毫秒
            gameTime: 180, // 3分鐘
            mapWidth: 800,
            mapHeight: 600
        };
        
        this.lastFireTime = 0;
        this.gameStartTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.showScreen('mainMenu');
        this.setupWebSocket();
    }
    
    setupEventListeners() {
        // 主選單按鈕
        document.getElementById('createRoomBtn').addEventListener('click', () => {
            this.showScreen('createRoomScreen');
        });
        
        document.getElementById('joinRoomBtn').addEventListener('click', () => {
            this.showScreen('joinRoomScreen');
            this.loadAvailableRooms();
        });
        
        // 創建房間
        document.getElementById('createRoomConfirmBtn').addEventListener('click', () => {
            this.createRoom();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        // 加入房間
        document.getElementById('joinRoomConfirmBtn').addEventListener('click', () => {
            this.joinRoom();
        });
        
        document.getElementById('backToMenuBtn2').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        // 房間等待
        document.getElementById('readyBtn').addEventListener('click', () => {
            this.toggleReady();
        });
        
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('leaveRoomBtn').addEventListener('click', () => {
            this.leaveRoom();
        });
        
        // 聊天
        document.getElementById('sendChatBtn').addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        // 遊戲控制
        document.getElementById('exitGameBtn').addEventListener('click', () => {
            this.exitGame();
        });
        
        // 遊戲結束
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.showScreen('roomWaitingScreen');
        });
        
        document.getElementById('backToMenuBtn3').addEventListener('click', () => {
            this.leaveRoom();
            this.showScreen('mainMenu');
        });
        
        // 鍵盤事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 滑鼠事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', () => {
            this.mouse.pressed = true;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
    }
    
    setupWebSocket() {
        // 連接到 Socket.IO 服務器
        const serverUrl = window.location.origin;
        this.socket = io(serverUrl);
        
        // 連接事件
        this.socket.on('connect', () => {
            console.log('已連接到遊戲服務器');
            this.updateConnectionStatus('connected');
        });
        
        this.socket.on('disconnect', () => {
            console.log('與服務器斷開連接');
            this.updateConnectionStatus('disconnected');
        });
        
        // 房間事件
        this.socket.on('roomCreated', (data) => {
            this.roomId = data.roomId;
            this.currentRoom = data.room;
            this.showScreen('roomWaitingScreen');
            this.updateRoomInfo();
        });
        
        this.socket.on('roomJoined', (data) => {
            this.roomId = data.room.id;
            this.currentRoom = data.room;
            this.showScreen('roomWaitingScreen');
            this.updateRoomInfo();
        });
        
        this.socket.on('joinError', (data) => {
            alert(data.message);
        });
        
        this.socket.on('roomList', (rooms) => {
            this.displayRoomList(rooms);
        });
        
        this.socket.on('playerJoined', (data) => {
            if (this.currentRoom) {
                this.currentRoom.players.push(data.player);
                this.updateRoomInfo();
            }
        });
        
        this.socket.on('playerReadyUpdate', (data) => {
            if (this.currentRoom) {
                const player = this.currentRoom.players.find(p => p.id === data.playerId);
                if (player) {
                    player.ready = data.ready;
                    this.updateRoomInfo();
                }
            }
        });
        
        // 遊戲事件
        this.socket.on('gameStarted', () => {
            this.gameState = 'playing';
            this.showScreen('gameScreen');
            this.initGame();
        });
        
        this.socket.on('gameState', (gameState) => {
            this.updateGameFromServer(gameState);
        });
        
        this.socket.on('gameEnded', (data) => {
            this.endGameWithResults(data.rankings);
        });
        
        // 聊天事件
        this.socket.on('chatMessage', (data) => {
            this.displayChatMessage(data);
        });
    }
    
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        const statusText = document.getElementById('statusText');
        
        statusElement.className = `connection-status ${status}`;
        
        switch (status) {
            case 'connected':
                statusText.textContent = '已連線';
                break;
            case 'disconnected':
                statusText.textContent = '連線中斷';
                break;
            default:
                statusText.textContent = '連線中...';
        }
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
    
    createRoom() {
        const roomName = document.getElementById('roomNameInput').value.trim();
        const playerName = document.getElementById('playerNameInput').value.trim();
        const maxPlayers = document.getElementById('maxPlayersSelect').value;
        
        if (!roomName || !playerName) {
            alert('請填寫房間名稱和玩家名稱！');
            return;
        }
        
        this.playerName = playerName;
        this.playerId = this.generatePlayerId();
        
        this.socket.emit('createRoom', {
            roomName: roomName,
            playerName: playerName,
            maxPlayers: parseInt(maxPlayers),
            playerId: this.playerId
        });
    }
    
    joinRoom() {
        const roomId = document.getElementById('roomIdInput').value.trim();
        const playerName = document.getElementById('joinPlayerNameInput').value.trim();
        
        if (!playerName) {
            alert('請填寫玩家名稱！');
            return;
        }
        
        this.playerName = playerName;
        this.playerId = this.generatePlayerId();
        
        this.socket.emit('joinRoom', {
            roomId: roomId,
            playerName: playerName,
            playerId: this.playerId
        });
    }
    
    loadAvailableRooms() {
        const roomsContainer = document.getElementById('availableRooms');
        roomsContainer.innerHTML = '<div class="loading">搜尋房間中...</div>';
        
        // 請求房間列表
        this.socket.emit('getRoomList');
    }
    
    displayRoomList(rooms) {
        const roomsContainer = document.getElementById('availableRooms');
        
        if (rooms.length === 0) {
            roomsContainer.innerHTML = '<div class="loading">目前沒有可用房間</div>';
            return;
        }
        
        roomsContainer.innerHTML = rooms.map(room => `
            <div class="room-item" onclick="game.quickJoinRoom('${room.id}')">
                <div><strong>🎮 ${room.name}</strong></div>
                <div>玩家: ${room.players}/${room.maxPlayers} | ID: ${room.id}</div>
            </div>
        `).join('');
    }
    
    quickJoinRoom(roomId) {
        document.getElementById('roomIdInput').value = roomId;
        const playerName = document.getElementById('joinPlayerNameInput').value.trim();
        if (!playerName) {
            document.getElementById('joinPlayerNameInput').focus();
            return;
        }
        this.joinRoom();
    }
    
    updateRoomInfo() {
        if (!this.currentRoom) return;
        
        document.getElementById('currentRoomId').textContent = this.roomId;
        document.getElementById('roomTitle').textContent = `房間: ${this.currentRoom.name}`;
        document.getElementById('currentPlayerCount').textContent = this.currentRoom.players.length;
        document.getElementById('maxPlayerCount').textContent = this.currentRoom.maxPlayers;
        
        // 更新玩家列表
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = this.currentRoom.players.map(player => `
            <div class="player-item">
                <span>${player.name}${player.id === this.playerId ? ' (你)' : ''}</span>
                <span class="${player.ready ? 'player-ready' : 'player-waiting'}">
                    ${player.ready ? '✅ 準備就緒' : '⏳ 等待中'}
                </span>
            </div>
        `).join('');
        
        // 檢查是否可以開始遊戲
        const myPlayer = this.currentRoom.players.find(p => p.id === this.playerId);
        const isHost = myPlayer && this.currentRoom.players[0].id === this.playerId;
        const allReady = this.currentRoom.players.length >= 2 && 
                        this.currentRoom.players.every(p => p.ready);
        
        document.getElementById('startGameBtn').disabled = !isHost || !allReady;
        
        // 更新準備按鈕狀態
        const readyBtn = document.getElementById('readyBtn');
        if (myPlayer) {
            readyBtn.textContent = myPlayer.ready ? '取消準備' : '準備';
            readyBtn.className = myPlayer.ready ? 'btn secondary' : 'btn primary';
        }
    }
    
    toggleReady() {
        if (this.currentScreen === 'roomWaitingScreen' && this.currentRoom) {
            const player = this.currentRoom.players.find(p => p.id === this.playerId);
            if (player) {
                const newReadyState = !player.ready;
                this.socket.emit('playerReady', { ready: newReadyState });
            }
        }
    }
    
    startGame() {
        this.socket.emit('startGame');
    }
    
    leaveRoom() {
        this.roomId = null;
        this.playerId = null;
        this.currentRoom = null;
        this.showScreen('mainMenu');
    }
    
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.socket.emit('chatMessage', { message });
            input.value = '';
        }
    }
    
    displayChatMessage(data) {
        const chatMessages = document.getElementById('chatMessages');
        const time = new Date(data.timestamp).toLocaleTimeString('zh-TW', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        chatMessages.innerHTML += `
            <div style="margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <span style="color: #4ecdc4; font-weight: bold;">${data.playerName}</span>
                <span style="color: #ccc; font-size: 0.8rem; margin-left: 10px;">${time}</span>
                <div style="margin-top: 2px;">${data.message}</div>
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    initGame() {
        this.gameStartTime = Date.now();
        this.gameData = {
            health: 100,
            kills: 0,
            deaths: 0,
            gameTime: 0
        };
        
        // 初始化玩家
        this.player = {
            x: this.gameConfig.mapWidth / 2,
            y: this.gameConfig.mapHeight / 2,
            width: 30,
            height: 30,
            angle: 0,
            speed: this.gameConfig.playerSpeed
        };
        
        // 清空遊戲物件
        this.otherPlayers = [];
        this.serverBullets = [];
        this.obstacles = [];
        
        // 開始遊戲循環
        this.gameLoop();
        
        // 更新UI
        this.updateGameUI();
    }
    
    gameLoop() {
        if (this.gameState !== 'playing') return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // 更新玩家輸入
        this.updatePlayerInput();
        
        // 更新UI
        this.updateGameUI();
    }
    
    updatePlayerInput() {
        if (this.gameState !== 'playing') return;
        
        // 收集移動輸入
        const moveData = {
            up: this.keys['w'] || this.keys['arrowup'],
            down: this.keys['s'] || this.keys['arrowdown'],
            left: this.keys['a'] || this.keys['arrowleft'],
            right: this.keys['d'] || this.keys['arrowright']
        };
        
        // 發送移動數據到服務器
        if (moveData.up || moveData.down || moveData.left || moveData.right) {
            this.socket.emit('playerAction', {
                type: 'move',
                data: moveData
            });
        }
        
        // 計算瞄準角度
        const dx = this.mouse.x - (this.player.x + this.player.width / 2);
        const dy = this.mouse.y - (this.player.y + this.player.height / 2);
        this.player.angle = Math.atan2(dy, dx);
        
        // 發送角度更新
        this.socket.emit('playerAction', {
            type: 'updateAngle',
            data: { angle: this.player.angle }
        });
        
        // 射擊
        if (this.mouse.pressed && Date.now() - this.lastFireTime > this.gameConfig.fireRate) {
            this.shoot();
        }
    }
    
    shoot() {
        if (this.gameState !== 'playing') return;
        
        this.lastFireTime = Date.now();
        
        // 發送射擊動作到服務器
        this.socket.emit('playerAction', {
            type: 'shoot',
            data: { angle: this.player.angle }
        });
    }
    
    render() {
        // 清空畫布
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.gameConfig.mapWidth, this.gameConfig.mapHeight);
        
        // 繪製背景網格
        this.drawGrid();
        
        // 繪製障礙物
        this.obstacles.forEach(obstacle => {
            this.ctx.font = `${obstacle.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(obstacle.emoji, 
                            obstacle.x + obstacle.width / 2, 
                            obstacle.y + obstacle.height);
        });
        
        // 繪製玩家
        this.drawPlayer();
        
        // 繪製其他玩家
        this.otherPlayers.forEach(player => {
            this.drawOtherPlayer(player);
        });
        
        // 繪製子彈
        this.serverBullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.ownerId === this.playerId ? '#4ecdc4' : '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.gameConfig.mapWidth; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.gameConfig.mapHeight);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.gameConfig.mapHeight; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.gameConfig.mapWidth, y);
            this.ctx.stroke();
        }
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width / 2, 
                          this.player.y + this.player.height / 2);
        this.ctx.rotate(this.player.angle);
        
        // 繪製玩家身體
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(-this.player.width / 2, -this.player.height / 2, 
                         this.player.width, this.player.height);
        
        // 繪製武器
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.player.width / 2, -3, 25, 6);
        
        this.ctx.restore();
        
        // 繪製玩家名稱
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.playerName, 
                         this.player.x + this.player.width / 2, 
                         this.player.y - 8);
    }
    
    drawOtherPlayer(player) {
        this.ctx.save();
        this.ctx.translate(player.x + 15, player.y + 15);
        this.ctx.rotate(player.angle);
        
        // 繪製玩家身體
        this.ctx.fillStyle = player.color || '#ff6b6b';
        this.ctx.fillRect(-15, -15, 30, 30);
        
        // 繪製武器
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(15, -3, 25, 6);
        
        this.ctx.restore();
        
        // 繪製玩家名稱
        this.ctx.fillStyle = player.color || '#ff6b6b';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, player.x + 15, player.y - 8);
        
        // 繪製血條
        const barWidth = 40;
        const barHeight = 4;
        const healthPercent = player.health / 100;
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(player.x + (30 - barWidth) / 2, player.y - 18, barWidth, barHeight);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(player.x + (30 - barWidth) / 2, player.y - 18, 
                         barWidth * healthPercent, barHeight);
    }
    
    updateGameUI() {
        // 更新血條
        const healthBar = document.getElementById('healthBar');
        healthBar.style.width = `${this.gameData.health}%`;
        
        // 更新統計
        document.getElementById('killCount').textContent = this.gameData.kills;
        document.getElementById('deathCount').textContent = this.gameData.deaths;
        
        // 更新時間
        const minutes = Math.floor(this.gameData.gameTime / 60);
        const seconds = this.gameData.gameTime % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新排行榜
        this.updateLeaderboard();
    }
    
    updateLeaderboard() {
        const leaderboard = document.getElementById('leaderboardList');
        const allPlayers = [
            { name: this.playerName, kills: this.gameData.kills, deaths: this.gameData.deaths },
            ...this.otherPlayers.map(p => ({ name: p.name, kills: p.kills, deaths: p.deaths }))
        ];
        
        allPlayers.sort((a, b) => {
            const aKD = a.deaths > 0 ? a.kills / a.deaths : a.kills;
            const bKD = b.deaths > 0 ? b.kills / b.deaths : b.kills;
            return bKD - aKD;
        });
        
        leaderboard.innerHTML = allPlayers.slice(0, 5).map((player, index) => {
            const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(1) : player.kills;
            return `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; ${player.name === this.playerName ? 'color: #4ecdc4; font-weight: bold;' : ''}">
                    <span>${index + 1}. ${player.name}</span>
                    <span>${player.kills}/${player.deaths} (${kd})</span>
                </div>
            `;
        }).join('');
    }
    
    exitGame() {
        this.gameState = 'menu';
        this.showScreen('roomWaitingScreen');
    }
    
    updateGameFromServer(gameState) {
        if (this.gameState !== 'playing') return;
        
        // 更新其他玩家位置
        this.otherPlayers = gameState.players.filter(p => p.id !== this.playerId);
        
        // 更新自己的位置（服務器權威）
        const myPlayer = gameState.players.find(p => p.id === this.playerId);
        if (myPlayer) {
            this.player.x = myPlayer.x;
            this.player.y = myPlayer.y;
            this.gameData.health = myPlayer.health;
            this.gameData.kills = myPlayer.kills;
            this.gameData.deaths = myPlayer.deaths;
        }
        
        // 更新子彈
        this.serverBullets = gameState.bullets;
        
        // 更新障礙物
        this.obstacles = gameState.obstacles;
        
        // 更新遊戲時間
        this.gameData.gameTime = gameState.gameTime;
    }
    
    endGameWithResults(rankings) {
        this.gameState = 'gameOver';
        this.showScreen('gameOverScreen');
        
        // 顯示排名結果
        const finalResults = document.getElementById('finalResults');
        let resultsHTML = '<h3>🏆 最終排名</h3>';
        
        rankings.forEach((player, index) => {
            const kd = player.gameData.deaths > 0 ? 
                (player.gameData.kills / player.gameData.deaths).toFixed(2) : 
                player.gameData.kills;
            
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
            
            resultsHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; ${player.id === this.playerId ? 'border: 2px solid #4ecdc4;' : ''}">
                    <span style="font-size: 1.2rem;">
                        ${medal} ${index + 1}. ${player.name}${player.id === this.playerId ? ' (你)' : ''}
                    </span>
                    <span style="font-weight: bold;">
                        ${player.gameData.kills}/${player.gameData.deaths} (${kd})
                    </span>
                </div>
            `;
        });
        
        finalResults.innerHTML = resultsHTML;
    }
    
    generatePlayerId() {
        return Math.random().toString(36).substring(2, 11);
    }
}

// 初始化遊戲
const game = new MultiplayerShooterGame();