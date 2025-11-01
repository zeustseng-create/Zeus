// 演示版遊戲 - 不需要服務器的單機版本
class DemoGame {
    constructor() {
        this.currentScreen = 'mainMenu';
        this.gameState = 'menu';
        
        // 遊戲畫布和上下文
        this.canvas = null;
        this.ctx = null;
        
        // 遊戲數據
        this.gameData = {
            health: 100,
            kills: 0,
            gameTime: 0
        };
        
        // 遊戲物件
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.obstacles = [];
        
        // 輸入處理
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        // 遊戲設定
        this.gameConfig = {
            playerSpeed: 5,
            bulletSpeed: 10,
            fireRate: 200,
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
    }
    
    setupEventListeners() {
        // 主選單按鈕
        document.getElementById('createRoomBtn').addEventListener('click', () => {
            this.showScreen('createRoomScreen');
        });
        
        document.getElementById('joinRoomBtn').addEventListener('click', () => {
            this.showScreen('joinRoomScreen');
        });
        
        document.getElementById('demoBtn').addEventListener('click', () => {
            this.startDemo();
        });
        
        // 返回按鈕
        document.getElementById('backToMenuBtn1').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        document.getElementById('backToMenuBtn2').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.endDemo();
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
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
    
    startDemo() {
        this.gameState = 'playing';
        this.showScreen('demoScreen');
        this.initGame();
    }
    
    endDemo() {
        this.gameState = 'menu';
        this.showScreen('mainMenu');
    }
    
    initGame() {
        this.gameStartTime = Date.now();
        this.gameData = {
            health: 100,
            kills: 0,
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
        
        // 初始化敵人（AI）
        this.enemies = [
            {
                id: 'ai1',
                name: 'AI 機器人 1',
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                angle: 0,
                health: 100,
                color: '#ff6b6b',
                lastMove: 0,
                target: { x: 200, y: 200 }
            },
            {
                id: 'ai2',
                name: 'AI 機器人 2',
                x: 600,
                y: 400,
                width: 30,
                height: 30,
                angle: 0,
                health: 100,
                color: '#4ecdc4',
                lastMove: 0,
                target: { x: 500, y: 300 }
            }
        ];
        
        // 清空遊戲物件
        this.bullets = [];
        
        // 生成障礙物
        this.generateObstacles();
        
        // 開始遊戲循環
        this.gameLoop();
    }
    
    generateObstacles() {
        this.obstacles = [];
        
        const obstacleTypes = [
            { emoji: '🟫', size: 40 },
            { emoji: '🌳', size: 35 },
            { emoji: '🪨', size: 30 },
            { emoji: '🏠', size: 45 }
        ];
        
        for (let i = 0; i < 8; i++) {
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
        
        // 更新玩家
        this.updatePlayer();
        
        // 更新敵人 AI
        this.updateEnemies();
        
        // 更新子彈
        this.updateBullets();
        
        // 檢查碰撞
        this.checkCollisions();
        
        // 更新UI
        this.updateGameUI();
    }
    
    updatePlayer() {
        // 移動
        const moveData = {
            up: this.keys['w'] || this.keys['arrowup'],
            down: this.keys['s'] || this.keys['arrowdown'],
            left: this.keys['a'] || this.keys['arrowleft'],
            right: this.keys['d'] || this.keys['arrowright']
        };
        
        if (moveData.up) this.player.y = Math.max(0, this.player.y - this.player.speed);
        if (moveData.down) this.player.y = Math.min(this.gameConfig.mapHeight - this.player.height, this.player.y + this.player.speed);
        if (moveData.left) this.player.x = Math.max(0, this.player.x - this.player.speed);
        if (moveData.right) this.player.x = Math.min(this.gameConfig.mapWidth - this.player.width, this.player.x + this.player.speed);
        
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
        
        const bullet = {
            x: this.player.x + this.player.width / 2,
            y: this.player.y + this.player.height / 2,
            vx: Math.cos(this.player.angle) * this.gameConfig.bulletSpeed,
            vy: Math.sin(this.player.angle) * this.gameConfig.bulletSpeed,
            owner: 'player',
            damage: 25,
            size: 4
        };
        
        this.bullets.push(bullet);
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            const now = Date.now();
            
            // 簡單 AI：朝目標移動
            if (now - enemy.lastMove > 100) {
                const dx = enemy.target.x - enemy.x;
                const dy = enemy.target.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 50) {
                    enemy.x += (dx / distance) * 2;
                    enemy.y += (dy / distance) * 2;
                } else {
                    // 到達目標，選擇新目標
                    enemy.target.x = Math.random() * (this.gameConfig.mapWidth - enemy.width);
                    enemy.target.y = Math.random() * (this.gameConfig.mapHeight - enemy.height);
                }
                
                enemy.lastMove = now;
            }
            
            // AI 射擊
            if (Math.random() < 0.01) {
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                enemy.angle = Math.atan2(dy, dx);
                
                this.bullets.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: Math.cos(enemy.angle) * this.gameConfig.bulletSpeed,
                    vy: Math.sin(enemy.angle) * this.gameConfig.bulletSpeed,
                    owner: enemy.id,
                    damage: 20,
                    size: 3
                });
            }
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
    
    checkCollisions() {
        this.bullets.forEach((bullet, bulletIndex) => {
            // 子彈與玩家碰撞
            if (bullet.owner !== 'player' && this.isColliding(bullet, this.player)) {
                this.gameData.health -= bullet.damage;
                this.bullets.splice(bulletIndex, 1);
                
                if (this.gameData.health <= 0) {
                    this.gameData.health = 100;
                    // 重生
                    this.player.x = Math.random() * (this.gameConfig.mapWidth - this.player.width);
                    this.player.y = Math.random() * (this.gameConfig.mapHeight - this.player.height);
                }
            }
            
            // 子彈與敵人碰撞
            if (bullet.owner === 'player') {
                this.enemies.forEach(enemy => {
                    if (this.isColliding(bullet, enemy)) {
                        enemy.health -= bullet.damage;
                        this.bullets.splice(bulletIndex, 1);
                        
                        if (enemy.health <= 0) {
                            this.gameData.kills++;
                            enemy.health = 100;
                            // 重生敵人
                            enemy.x = Math.random() * (this.gameConfig.mapWidth - enemy.width);
                            enemy.y = Math.random() * (this.gameConfig.mapHeight - enemy.height);
                        }
                    }
                });
            }
            
            // 子彈與障礙物碰撞
            if (this.obstacles.some(obstacle => this.isColliding(bullet, obstacle))) {
                this.bullets.splice(bulletIndex, 1);
            }
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + (obj1.size || obj1.width || 5) > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + (obj1.size || obj1.height || 5) > obj2.y;
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
        
        // 繪製敵人
        this.enemies.forEach(enemy => {
            this.drawEnemy(enemy);
        });
        
        // 繪製子彈
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.owner === 'player' ? '#4ecdc4' : '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
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
        this.ctx.fillText('你', 
                         this.player.x + this.player.width / 2, 
                         this.player.y - 8);
    }
    
    drawEnemy(enemy) {
        this.ctx.save();
        this.ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        this.ctx.rotate(enemy.angle);
        
        // 繪製敵人身體
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
        
        // 繪製武器
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(enemy.width / 2, -3, 25, 6);
        
        this.ctx.restore();
        
        // 繪製敵人名稱
        this.ctx.fillStyle = enemy.color;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(enemy.name, enemy.x + enemy.width / 2, enemy.y - 8);
        
        // 繪製血條
        const barWidth = 40;
        const barHeight = 4;
        const healthPercent = enemy.health / 100;
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(enemy.x + (enemy.width - barWidth) / 2, enemy.y - 18, barWidth, barHeight);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(enemy.x + (enemy.width - barWidth) / 2, enemy.y - 18, 
                         barWidth * healthPercent, barHeight);
    }
    
    updateGameUI() {
        // 更新血條
        const healthBar = document.getElementById('healthBar');
        healthBar.style.width = `${this.gameData.health}%`;
        
        // 更新統計
        document.getElementById('killCount').textContent = this.gameData.kills;
        
        // 更新時間
        const minutes = Math.floor(this.gameData.gameTime / 60);
        const seconds = this.gameData.gameTime % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// 初始化演示遊戲
const demoGame = new DemoGame();