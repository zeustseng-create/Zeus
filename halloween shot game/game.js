// 萬聖節射擊遊戲主程式
class HalloweenShooterGame {
    constructor() {
        this.currentScreen = 'mainMenu';
        this.gameState = 'menu'; // menu, waiting, playing, gameOver
        this.socket = null;
        this.roomId = null;
        this.playerId = null;
        this.playerName = '';
        this.players = new Map();
        this.gameData = {
            health: 100,
            kills: 0,
            deaths: 0,
            gameTime: 0
        };
        
        // 遊戲畫布和上下文
        this.canvas = null;
        this.ctx = null;
        
        // 遊戲物件
        this.bullets = [];
        this.powerUps = [];
        this.obstacles = [];
        
        // 輸入處理
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        // 遊戲設定
        this.gameConfig = {
            playerSpeed: 5,
            bulletSpeed: 10,
            fireRate: 200, // 毫秒
            gameTime: 300, // 5分鐘
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
        
        // 模擬 WebSocket 連接（實際部署時需要真實的 WebSocket 服務器）
        this.setupMockWebSocket();
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
            this.showScreen('mainMenu');
        });
        
        // 鍵盤事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'r' && this.gameState === 'playing') {
                this.reload();
            }
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
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            if (this.gameState === 'playing') {
                this.shoot();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
    }
    
    setupMockWebSocket() {
        // 連接到 Socket.IO 服務器
        const serverUrl = window.location.origin;
        this.socket = io(serverUrl);
        
        // 連接事件
        this.socket.on('connect', () => {
            console.log('已連接到遊戲服務器');
        });
        
        this.socket.on('disconnect', () => {
            console.log('與服務器斷開連接');
        });
        
        // 房間事件
        this.socket.on('roomCreated', (data) => {
            this.roomId = data.roomId;
            this.playerId = this.generatePlayerId();
            this.currentRoom = data.room;
            this.showScreen('roomWaitingScreen');
            this.updateRoomInfo();
        });
        
        this.socket.on('roomJoined', (data) => {
            this.roomId = data.room.id;
            this.playerId = this.generatePlayerId();
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
        
        this.socket.emit('createRoom', {
            roomName: roomName,
            playerName: playerName,
            maxPlayers: parseInt(maxPlayers),
            playerId: this.generatePlayerId()
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
        
        this.socket.emit('joinRoom', {
            roomId: roomId,
            playerName: playerName,
            playerId: this.generatePlayerId()
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
                <div><strong>🎃 ${room.name}</strong></div>
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
                    ${player.ready ? '準備就緒' : '等待中'}
                </span>
            </div>
        `).join('');
        
        // 檢查是否可以開始遊戲（房主且所有人準備）
        const isHost = this.currentRoom.players.find(p => p.id === this.playerId)?.id === this.playerId;
        const allReady = this.currentRoom.players.length >= 2 && 
                        this.currentRoom.players.every(p => p.ready);
        
        document.getElementById('startGameBtn').disabled = !isHost || !allReady;
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
        chatMessages.innerHTML += `
            <div style="margin-bottom: 5px;">
                <strong style="color: #ff9900;">${data.playerName}:</strong> ${data.message}
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    startGame() {
        this.socket.emit('startGame', { roomId: this.roomId });
    }
    
    leaveRoom() {
        this.roomId = null;
        this.playerId = null;
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
        
        // 初始化玩家位置
        this.player = {
            x: this.gameConfig.mapWidth / 2,
            y: this.gameConfig.mapHeight / 2,
            width: 30,
            height: 30,
            angle: 0,
            speed: this.gameConfig.playerSpeed
        };
        
        // 初始化敵人（模擬其他玩家）
        this.enemies = [
            {
                id: 'enemy1',
                name: '幽靈獵人',
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                angle: 0,
                health: 100
            }
        ];
        
        // 清空遊戲物件
        this.bullets = [];
        this.powerUps = [];
        
        // 生成障礙物
        this.generateObstacles();
        
        // 開始遊戲循環
        this.gameLoop();
        
        // 更新UI
        this.updateGameUI();
    }
    
    generateObstacles() {
        this.obstacles = [];
        
        // 生成萬聖節主題障礙物
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
        // 更新遊戲時間
        this.gameData.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        
        // 檢查遊戲是否結束
        if (this.gameData.gameTime >= this.gameConfig.gameTime) {
            this.endGame();
            return;
        }
        
        // 更新玩家位置
        this.updatePlayer();
        
        // 更新子彈
        this.updateBullets();
        
        // 更新敵人AI
        this.updateEnemies();
        
        // 檢查碰撞
        this.checkCollisions();
        
        // 更新UI
        this.updateGameUI();
    }
    
    updatePlayer() {
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
        
        // 自動射擊
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
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // 移除超出邊界的子彈
            return bullet.x >= 0 && bullet.x <= this.gameConfig.mapWidth &&
                   bullet.y >= 0 && bullet.y <= this.gameConfig.mapHeight;
        });
    }
    
    updateEnemies() {
        // 簡單的AI：敵人朝玩家移動並射擊
        this.enemies.forEach(enemy => {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 50) {
                // 移動向玩家
                enemy.x += (dx / distance) * 2;
                enemy.y += (dy / distance) * 2;
            }
            
            // 隨機射擊
            if (Math.random() < 0.02) {
                enemy.angle = Math.atan2(dy, dx);
                this.bullets.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: Math.cos(enemy.angle) * this.gameConfig.bulletSpeed,
                    vy: Math.sin(enemy.angle) * this.gameConfig.bulletSpeed,
                    owner: 'enemy',
                    damage: 20
                });
            }
        });
    }
    
    checkCollisions() {
        // 子彈與玩家碰撞
        this.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.owner === 'enemy') {
                if (this.isColliding(bullet, this.player)) {
                    this.gameData.health -= bullet.damage;
                    this.bullets.splice(bulletIndex, 1);
                    
                    if (this.gameData.health <= 0) {
                        this.gameData.deaths++;
                        this.gameData.health = 100;
                        // 重生
                        this.player.x = Math.random() * (this.gameConfig.mapWidth - this.player.width);
                        this.player.y = Math.random() * (this.gameConfig.mapHeight - this.player.height);
                    }
                }
            }
        });
        
        // 子彈與敵人碰撞
        this.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.owner === 'player') {
                this.enemies.forEach((enemy, enemyIndex) => {
                    if (this.isColliding(bullet, enemy)) {
                        enemy.health -= bullet.damage;
                        this.bullets.splice(bulletIndex, 1);
                        
                        if (enemy.health <= 0) {
                            this.gameData.kills++;
                            // 重生敵人
                            enemy.health = 100;
                            enemy.x = Math.random() * (this.gameConfig.mapWidth - enemy.width);
                            enemy.y = Math.random() * (this.gameConfig.mapHeight - enemy.height);
                        }
                    }
                });
            }
        });
        
        // 子彈與障礙物碰撞
        this.bullets = this.bullets.filter(bullet => {
            return !this.obstacles.some(obstacle => this.isColliding(bullet, obstacle));
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + (obj1.width || 5) > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + (obj1.height || 5) > obj2.y;
    }
    
    render() {
        // 清空畫布
        this.ctx.fillStyle = '#0a0a0a';
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
        if (this.otherPlayers) {
            this.otherPlayers.forEach(player => {
                this.drawOtherPlayer(player);
            });
        }
        
        // 繪製服務器子彈
        if (this.serverBullets) {
            this.serverBullets.forEach(bullet => {
                this.ctx.fillStyle = bullet.ownerId === this.playerId ? '#ff6600' : '#ff0066';
                this.ctx.beginPath();
                this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
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
        
        // 繪製玩家身體
        this.ctx.fillStyle = '#ff9900';
        this.ctx.fillRect(-this.player.width / 2, -this.player.height / 2, 
                         this.player.width, this.player.height);
        
        // 繪製武器
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.player.width / 2, -2, 20, 4);
        
        this.ctx.restore();
        
        // 繪製玩家名稱
        this.ctx.fillStyle = '#ffcc00';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.playerName, 
                         this.player.x + this.player.width / 2, 
                         this.player.y - 5);
    }
    
    drawOtherPlayer(player) {
        this.ctx.save();
        this.ctx.translate(player.x + 15, player.y + 15);
        this.ctx.rotate(player.angle);
        
        // 繪製玩家身體
        this.ctx.fillStyle = '#cc0066';
        this.ctx.fillRect(-15, -15, 30, 30);
        
        // 繪製武器
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(15, -2, 20, 4);
        
        this.ctx.restore();
        
        // 繪製玩家名稱
        this.ctx.fillStyle = '#ff6666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, player.x + 15, player.y - 5);
        
        // 繪製血條
        const barWidth = 40;
        const barHeight = 4;
        const healthPercent = player.health / 100;
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(player.x + (30 - barWidth) / 2, player.y - 15, barWidth, barHeight);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(player.x + (30 - barWidth) / 2, player.y - 15, 
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
        const leaderboard = document.getElementById('leaderboardList');
        leaderboard.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${this.playerName}</span>
                <span>${this.gameData.kills}/${this.gameData.deaths}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>幽靈獵人</span>
                <span>2/1</span>
            </div>
        `;
    }
    
    reload() {
        // 重新裝彈動畫或效果
        console.log('重新裝彈！');
    }
    
    exitGame() {
        this.gameState = 'menu';
        this.showScreen('roomWaitingScreen');
    }
    
    endGame() {
        this.gameState = 'gameOver';
        this.showScreen('gameOverScreen');
        
        // 顯示最終結果
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
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }
    
    generatePlayerId() {
        return Math.random().toString(36).substr(2, 9);
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
        let resultsHTML = '<h3>最終排名</h3>';
        
        rankings.forEach((player, index) => {
            const kd = player.gameData.deaths > 0 ? 
                (player.gameData.kills / player.gameData.deaths).toFixed(2) : 
                player.gameData.kills;
            
            resultsHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; ${player.id === this.playerId ? 'color: #ff9900; font-weight: bold;' : ''}">
                    <span>${index + 1}. ${player.name}${player.id === this.playerId ? ' (你)' : ''}</span>
                    <span>${player.gameData.kills}/${player.gameData.deaths} (${kd})</span>
                </div>
            `;
        });
        
        finalResults.innerHTML = resultsHTML;
    }
    
    // 添加準備按鈕功能
    toggleReady() {
        if (this.currentScreen === 'roomWaitingScreen') {
            const player = this.currentRoom.players.find(p => p.id === this.playerId);
            if (player) {
                const newReadyState = !player.ready;
                this.socket.emit('playerReady', { ready: newReadyState });
            }
        }
    }
}

// 初始化遊戲
const game = new HalloweenShooterGame();