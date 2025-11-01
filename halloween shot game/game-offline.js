// 萬聖節射擊遊戲 - 離線版本（用於測試）
class HalloweenShooterGameOffline {
    constructor() {
        this.currentScreen = 'mainMenu';
        this.gameState = 'menu';
        this.roomId = null;
        this.playerId = null;
        this.playerName = '';
        this.currentRoom = null;
        
        // 模擬其他玩家
        this.mockPlayers = [
            { id: 'bot1', name: '幽靈獵人', ready: false },
            { id: 'bot2', name: '南瓜騎士', ready: false }
        ];
        
        this.gameData = {
            health: 100,
            kills: 0,
            deaths: 0,
            gameTime: 0
        };
        
        this.canvas = null;
        this.ctx = null;
        this.bullets = [];
        this.obstacles = [];
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        this.gameConfig = {
            playerSpeed: 5,
            bulletSpeed: 10,
            fireRate: 200,
            gameTime: 300,
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
        console.log('🎃 萬聖節射擊遊戲 - 離線模式啟動');
    }
    
    setupEventListeners() {
        // 主選單
        document.getElementById('createRoomBtn').addEventListener('click', () => {
            this.showScreen('createRoomScreen');
        });
        
        document.getElementById('joinRoomBtn').addEventListener('click', () => {
            this.showScreen('joinRoomScreen');
            this.loadMockRooms();
        });
        
        // 創建房間
        document.getElementById('createRoomConfirmBtn').addEventListener('click', () => {
            this.createMockRoom();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        // 加入房間
        document.getElementById('joinRoomConfirmBtn').addEventListener('click', () => {
            this.joinMockRoom();
        });
        
        document.getElementById('backToMenuBtn2').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        // 房間等待
        document.getElementById('readyBtn').addEventListener('click', () => {
            this.toggleMockReady();
        });
        
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startMockGame();
        });
        
        document.getElementById('leaveRoomBtn').addEventListener('click', () => {
            this.leaveRoom();
        });
        
        // 聊天
        document.getElementById('sendChatBtn').addEventListener('click', () => {
            this.sendMockChat();
        });
        
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMockChat();
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
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
    
    createMockRoom() {
        const roomName = document.getElementById('roomNameInput').value.trim();
        const playerName = document.getElementById('playerNameInput').value.trim();
        const maxPlayers = document.getElementById('maxPlayersSelect').value;
        
        if (!roomName || !playerName) {
            alert('請填寫房間名稱和玩家名稱！');
            return;
        }
        
        this.playerName = playerName;
        this.playerId = 'player1';
        this.roomId = this.generateRoomId();
        
        this.currentRoom = {
            id: this.roomId,
            name: roomName,
            maxPlayers: parseInt(maxPlayers),
            players: [
                { id: this.playerId, name: this.playerName, ready: false }
            ]
        };
        
        this.showScreen('roomWaitingScreen');
        this.updateRoomInfo();
        
        // 模擬其他玩家加入
        setTimeout(() => {
            this.currentRoom.players.push({ id: 'bot1', name: '幽靈獵人', ready: false });
            this.updateRoomInfo();
            this.addMockChatMessage('系統', '幽靈獵人 加入了房間');
        }, 2000);
    }
    
    joinMockRoom() {
        const playerName = document.getElementById('joinPlayerNameInput').value.trim();
        
        if (!playerName) {
            alert('請填寫玩家名稱！');
            return;
        }
        
        this.playerName = playerName;
        this.playerId = 'player1';
        this.roomId = 'DEMO123';
        
        this.currentRoom = {
            id: this.roomId,
            name: '萬聖節大戰',
            maxPlayers: 4,
            players: [
                { id: this.playerId, name: this.playerName, ready: false },
                { id: 'bot1', name: '幽靈獵人', ready: true }
            ]
        };
        
        this.showScreen('roomWaitingScreen');
        this.updateRoomInfo();
    }
    
    loadMockRooms() {
        const roomsContainer = document.getElementById('availableRooms');
        
        setTimeout(() => {
            roomsContainer.innerHTML = `
                <div class="room-item" onclick="gameOffline.quickJoinMockRoom('DEMO123')">
                    <div><strong>🎃 萬聖節大戰</strong></div>
                    <div>玩家: 1/4 | ID: DEMO123</div>
                </div>
                <div class="room-item" onclick="gameOffline.quickJoinMockRoom('SPOOK456')">
                    <div><strong>👻 幽靈射擊</strong></div>
                    <div>玩家: 2/6 | ID: SPOOK456</div>
                </div>
            `;
        }, 500);
    }
    
    quickJoinMockRoom(roomId) {
        document.getElementById('roomIdInput').value = roomId;
        const playerName = document.getElementById('joinPlayerNameInput').value.trim();
        if (!playerName) {
            document.getElementById('joinPlayerNameInput').focus();
            return;
        }
        this.joinMockRoom();
    }
    
    updateRoomInfo() {
        if (!this.currentRoom) return;
        
        document.getElementById('currentRoomId').textContent = this.roomId;
        document.getElementById('roomTitle').textContent = `房間: ${this.currentRoom.name}`;
        document.getElementById('currentPlayerCount').textContent = this.currentRoom.players.length;
        document.getElementById('maxPlayerCount').textContent = this.currentRoom.maxPlayers;
        
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = this.currentRoom.players.map(player => `
            <div class="player-item">
                <span>${player.name}${player.id === this.playerId ? ' (你)' : ''}</span>
                <span class="${player.ready ? 'player-ready' : 'player-waiting'}">
                    ${player.ready ? '準備就緒' : '等待中'}
                </span>
            </div>
        `).join('');
        
        // 更新準備按鈕
        const myPlayer = this.currentRoom.players.find(p => p.id === this.playerId);
        const readyBtn = document.getElementById('readyBtn');
        if (myPlayer) {
            readyBtn.textContent = myPlayer.ready ? '取消準備' : '準備';
            readyBtn.style.backgroundColor = myPlayer.ready ? '#ff6600' : '';
        }
        
        // 檢查是否可以開始遊戲
        const allReady = this.currentRoom.players.length >= 2 && 
                        this.currentRoom.players.every(p => p.ready);
        document.getElementById('startGameBtn').disabled = !allReady;
    }
    
    toggleMockReady() {
        const myPlayer = this.currentRoom.players.find(p => p.id === this.playerId);
        if (myPlayer) {
            myPlayer.ready = !myPlayer.ready;
            this.updateRoomInfo();
            
            // 模擬其他玩家也準備
            if (myPlayer.ready) {
                setTimeout(() => {
                    this.currentRoom.players.forEach(p => {
                        if (p.id !== this.playerId) {
                            p.ready = true;
                        }
                    });
                    this.updateRoomInfo();
                    this.addMockChatMessage('系統', '所有玩家已準備就緒！');
                }, 1000);
            }
        }
    }
    
    sendMockChat() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMockChatMessage(this.playerName, message);
            input.value = '';
            
            // 模擬其他玩家回應
            setTimeout(() => {
                const responses = [
                    '準備好了！',
                    '萬聖節快樂！🎃',
                    '讓我們開始戰鬥吧！',
                    '這次我一定要贏！'
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addMockChatMessage('幽靈獵人', randomResponse);
            }, 1000);
        }
    }
    
    addMockChatMessage(playerName, message) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML += `
            <div style="margin-bottom: 5px;">
                <strong style="color: #ff9900;">${playerName}:</strong> ${message}
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    startMockGame() {
        this.gameState = 'playing';
        this.showScreen('gameScreen');
        this.initGame();
    }
    
    leaveRoom() {
        this.roomId = null;
        this.playerId = null;
        this.currentRoom = null;
        this.showScreen('mainMenu');
    }
    
    initGame() {
        this.gameStartTime = Date.now();
        this.gameData = {
            health: 100,
            kills: 0,
            deaths: 0,
            gameTime: 0
        };
        
        this.player = {
            x: this.gameConfig.mapWidth / 2,
            y: this.gameConfig.mapHeight / 2,
            width: 30,
            height: 30,
            angle: 0,
            speed: this.gameConfig.playerSpeed
        };
        
        this.bullets = [];
        this.generateObstacles();
        this.gameLoop();
        this.updateGameUI();
    }
    
    generateObstacles() {
        this.obstacles = [];
        const obstacleTypes = [
            { emoji: '🎃', size: 40 },
            { emoji: '👻', size: 35 },
            { emoji: '🕷️', size: 25 },
            { emoji: '🦇', size: 30 }
        ];
        
        for (let i = 0; i < 15; i++) {
            const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            this.obstacles.push({
                x: Math.random() * (this.gameConfig.mapWidth - type.size),
                y: Math.random() * (this.gameConfig.mapHeight - type.size),
                width: type.size,
                height: type.size,
                emoji: type.emoji
            });
        }
    }
    
    gameLoop() {
        if (this.gameState !== 'playing') return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.gameData.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        
        if (this.gameData.gameTime >= this.gameConfig.gameTime) {
            this.endGame();
            return;
        }
        
        this.updatePlayer();
        this.updateBullets();
        this.updateGameUI();
    }
    
    updatePlayer() {
        // 移動控制
        if (this.keys['w'] || this.keys['arrowup']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.player.y = Math.min(this.gameConfig.mapHeight - this.player.height, 
                                   this.player.y + this.player.speed);
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.player.x = Math.min(this.gameConfig.mapWidth - this.player.width, 
                                   this.player.x + this.player.speed);
        }
        
        // 計算瞄準角度
        const dx = this.mouse.x - (this.player.x + this.player.width / 2);
        const dy = this.mouse.y - (this.player.y + this.player.height / 2);
        this.player.angle = Math.atan2(dy, dx);
        
        // 射擊
        if (this.mouse.pressed && Date.now() - this.lastFireTime > this.gameConfig.fireRate) {
            this.shoot();
        }
    }
    
    shoot() {
        this.lastFireTime = Date.now();
        
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        
        this.bullets.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(this.player.angle) * this.gameConfig.bulletSpeed,
            vy: Math.sin(this.player.angle) * this.gameConfig.bulletSpeed,
            owner: 'player'
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            return bullet.x >= 0 && bullet.x <= this.gameConfig.mapWidth &&
                   bullet.y >= 0 && bullet.y <= this.gameConfig.mapHeight;
        });
    }
    
    render() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.gameConfig.mapWidth, this.gameConfig.mapHeight);
        
        this.drawGrid();
        
        // 繪製障礙物
        this.obstacles.forEach(obstacle => {
            this.ctx.font = `${obstacle.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(obstacle.emoji, 
                            obstacle.x + obstacle.width / 2, 
                            obstacle.y + obstacle.height);
        });
        
        this.drawPlayer();
        
        // 繪製子彈
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = '#ff6600';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 102, 0, 0.1)';
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
        
        this.ctx.fillStyle = '#ff9900';
        this.ctx.fillRect(-this.player.width / 2, -this.player.height / 2, 
                         this.player.width, this.player.height);
        
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.player.width / 2, -2, 20, 4);
        
        this.ctx.restore();
        
        this.ctx.fillStyle = '#ffcc00';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.playerName, 
                         this.player.x + this.player.width / 2, 
                         this.player.y - 5);
    }
    
    updateGameUI() {
        const healthBar = document.getElementById('healthBar');
        healthBar.style.width = `${this.gameData.health}%`;
        
        document.getElementById('killCount').textContent = this.gameData.kills;
        document.getElementById('deathCount').textContent = this.gameData.deaths;
        
        const minutes = Math.floor(this.gameData.gameTime / 60);
        const seconds = this.gameData.gameTime % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const leaderboard = document.getElementById('leaderboardList');
        leaderboard.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${this.playerName}</span>
                <span>${this.gameData.kills}/${this.gameData.deaths}</span>
            </div>
        `;
    }
    
    exitGame() {
        this.gameState = 'menu';
        this.showScreen('roomWaitingScreen');
    }
    
    endGame() {
        this.gameState = 'gameOver';
        this.showScreen('gameOverScreen');
        
        const finalResults = document.getElementById('finalResults');
        finalResults.innerHTML = `
            <h3>你的戰績</h3>
            <p>擊殺: ${this.gameData.kills}</p>
            <p>死亡: ${this.gameData.deaths}</p>
            <p>K/D 比: ${this.gameData.deaths > 0 ? (this.gameData.kills / this.gameData.deaths).toFixed(2) : this.gameData.kills}</p>
            <p>遊戲時間: ${Math.floor(this.gameData.gameTime / 60)}:${(this.gameData.gameTime % 60).toString().padStart(2, '0')}</p>
        `;
    }
    
    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}

// 初始化離線遊戲
const gameOffline = new HalloweenShooterGameOffline();