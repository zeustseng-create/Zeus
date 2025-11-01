const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 遊戲狀態管理
class GameServer {
    constructor() {
        this.rooms = new Map();
        this.players = new Map();
        this.gameLoops = new Map();
    }

    createRoom(roomData) {
        const roomId = this.generateRoomId();
        const room = {
            id: roomId,
            name: roomData.name,
            maxPlayers: roomData.maxPlayers || 4,
            players: new Map(),
            gameState: 'waiting', // waiting, playing, finished
            gameData: {
                startTime: null,
                duration: 180, // 3分鐘
                bullets: [],
                powerUps: [],
                obstacles: this.generateObstacles()
            },
            host: roomData.hostId
        };
        
        this.rooms.set(roomId, room);
        console.log(`房間已創建: ${roomId} - ${roomData.name}`);
        return room;
    }

    joinRoom(roomId, playerData) {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        
        if (room.players.size >= room.maxPlayers) {
            return { error: '房間已滿' };
        }

        const player = {
            id: playerData.id,
            name: playerData.name,
            socketId: playerData.socketId,
            ready: false,
            gameData: {
                x: Math.random() * 740 + 30,
                y: Math.random() * 540 + 30,
                health: 100,
                kills: 0,
                deaths: 0,
                angle: 0,
                lastShot: 0,
                color: this.getPlayerColor(room.players.size)
            }
        };

        room.players.set(playerData.id, player);
        this.players.set(playerData.socketId, { roomId, playerId: playerData.id });
        
        console.log(`玩家 ${playerData.name} 加入房間 ${roomId}`);
        return room;
    }

    getPlayerColor(playerIndex) {
        const colors = ['#ff6600', '#0066ff', '#00ff66', '#ff0066', '#ffff00', '#ff00ff'];
        return colors[playerIndex % colors.length];
    }

    leaveRoom(socketId) {
        const playerInfo = this.players.get(socketId);
        if (!playerInfo) return;

        const room = this.rooms.get(playerInfo.roomId);
        if (room) {
            room.players.delete(playerInfo.playerId);
            
            // 如果房間空了，刪除房間
            if (room.players.size === 0) {
                this.stopGameLoop(playerInfo.roomId);
                this.rooms.delete(playerInfo.roomId);
                console.log(`房間 ${playerInfo.roomId} 已刪除`);
            } else {
                // 如果離開的是房主，轉移房主權限
                if (room.host === playerInfo.playerId) {
                    const newHost = Array.from(room.players.keys())[0];
                    room.host = newHost;
                }
            }
        }
        
        this.players.delete(socketId);
    }

    startGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room || room.gameState !== 'waiting') return false;

        room.gameState = 'playing';
        room.gameData.startTime = Date.now();
        
        // 重置玩家位置和狀態
        room.players.forEach(player => {
            player.gameData.x = Math.random() * 740 + 30;
            player.gameData.y = Math.random() * 540 + 30;
            player.gameData.health = 100;
            player.gameData.kills = 0;
            player.gameData.deaths = 0;
        });

        // 清空子彈
        room.gameData.bullets = [];
        
        // 開始遊戲循環
        this.startGameLoop(roomId);
        
        console.log(`遊戲開始: 房間 ${roomId}`);
        return true;
    }

    startGameLoop(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        const gameLoop = setInterval(() => {
            this.updateGame(roomId);
        }, 1000 / 60); // 60 FPS

        this.gameLoops.set(roomId, gameLoop);

        // 設定遊戲結束計時器
        setTimeout(() => {
            this.endGame(roomId);
        }, room.gameData.duration * 1000);
    }

    stopGameLoop(roomId) {
        const gameLoop = this.gameLoops.get(roomId);
        if (gameLoop) {
            clearInterval(gameLoop);
            this.gameLoops.delete(roomId);
        }
    }

    updateGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room || room.gameState !== 'playing') return;

        // 更新子彈位置
        room.gameData.bullets = room.gameData.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;

            // 檢查邊界
            if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600) {
                return false;
            }

            // 檢查與玩家碰撞
            let hit = false;
            room.players.forEach(player => {
                if (player.id !== bullet.ownerId && player.gameData.health > 0) {
                    const dx = bullet.x - (player.gameData.x + 15);
                    const dy = bullet.y - (player.gameData.y + 15);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 20) {
                        player.gameData.health -= bullet.damage;
                        hit = true;
                        
                        if (player.gameData.health <= 0) {
                            player.gameData.deaths++;
                            player.gameData.health = 100;
                            
                            // 增加射擊者擊殺數
                            const shooter = room.players.get(bullet.ownerId);
                            if (shooter) {
                                shooter.gameData.kills++;
                            }
                            
                            // 重生
                            player.gameData.x = Math.random() * 740 + 30;
                            player.gameData.y = Math.random() * 540 + 30;
                        }
                    }
                }
            });

            // 檢查與障礙物碰撞
            const hitObstacle = room.gameData.obstacles.some(obstacle => {
                return bullet.x >= obstacle.x && bullet.x <= obstacle.x + obstacle.width &&
                       bullet.y >= obstacle.y && bullet.y <= obstacle.y + obstacle.height;
            });

            return !hit && !hitObstacle;
        });

        // 廣播遊戲狀態
        this.broadcastGameState(roomId);
    }

    endGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.gameState = 'finished';
        this.stopGameLoop(roomId);
        
        // 計算最終排名
        const rankings = Array.from(room.players.values())
            .sort((a, b) => {
                const aKD = a.gameData.deaths > 0 ? a.gameData.kills / a.gameData.deaths : a.gameData.kills;
                const bKD = b.gameData.deaths > 0 ? b.gameData.kills / b.gameData.deaths : b.gameData.kills;
                return bKD - aKD;
            });

        io.to(roomId).emit('gameEnded', { rankings });
        console.log(`遊戲結束: 房間 ${roomId}`);
    }

    handlePlayerAction(socketId, action) {
        const playerInfo = this.players.get(socketId);
        if (!playerInfo) return;

        const room = this.rooms.get(playerInfo.roomId);
        const player = room?.players.get(playerInfo.playerId);
        
        if (!room || !player || room.gameState !== 'playing') return;

        switch (action.type) {
            case 'move':
                this.handlePlayerMove(player, action.data);
                break;
            case 'shoot':
                this.handlePlayerShoot(room, player, action.data);
                break;
            case 'updateAngle':
                player.gameData.angle = action.data.angle;
                break;
        }
    }

    handlePlayerMove(player, moveData) {
        const speed = 5;
        let newX = player.gameData.x;
        let newY = player.gameData.y;

        if (moveData.up) newY = Math.max(0, newY - speed);
        if (moveData.down) newY = Math.min(570, newY + speed);
        if (moveData.left) newX = Math.max(0, newX - speed);
        if (moveData.right) newX = Math.min(770, newX + speed);

        player.gameData.x = newX;
        player.gameData.y = newY;
    }

    handlePlayerShoot(room, player, shootData) {
        const now = Date.now();
        if (now - player.gameData.lastShot < 200) return; // 射擊冷卻

        player.gameData.lastShot = now;

        const bullet = {
            id: Math.random().toString(36).substring(2, 11),
            x: player.gameData.x + 15,
            y: player.gameData.y + 15,
            vx: Math.cos(shootData.angle) * 10,
            vy: Math.sin(shootData.angle) * 10,
            ownerId: player.id,
            damage: 25,
            createdAt: now
        };

        room.gameData.bullets.push(bullet);
    }

    broadcastGameState(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        const gameState = {
            players: Array.from(room.players.values()).map(p => ({
                id: p.id,
                name: p.name,
                x: p.gameData.x,
                y: p.gameData.y,
                health: p.gameData.health,
                kills: p.gameData.kills,
                deaths: p.gameData.deaths,
                angle: p.gameData.angle,
                color: p.gameData.color
            })),
            bullets: room.gameData.bullets,
            obstacles: room.gameData.obstacles,
            gameTime: room.gameData.startTime ? 
                Math.floor((Date.now() - room.gameData.startTime) / 1000) : 0
        };

        io.to(roomId).emit('gameState', gameState);
    }

    generateObstacles() {
        const obstacles = [];
        const obstacleTypes = [
            { emoji: '🟫', size: 40 },
            { emoji: '🌳', size: 35 },
            { emoji: '🪨', size: 30 },
            { emoji: '🏠', size: 45 }
        ];

        for (let i = 0; i < 12; i++) {
            const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            obstacles.push({
                x: Math.random() * (800 - type.size),
                y: Math.random() * (600 - type.size),
                width: type.size,
                height: type.size,
                emoji: type.emoji
            });
        }

        return obstacles;
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    getRoomList() {
        return Array.from(this.rooms.values())
            .filter(room => room.gameState === 'waiting' && room.players.size < room.maxPlayers)
            .map(room => ({
                id: room.id,
                name: room.name,
                players: room.players.size,
                maxPlayers: room.maxPlayers
            }));
    }
}

const gameServer = new GameServer();

// Socket.IO 連接處理
io.on('connection', (socket) => {
    console.log(`玩家連接: ${socket.id}`);

    // 創建房間
    socket.on('createRoom', (data) => {
        const roomData = {
            name: data.roomName,
            maxPlayers: data.maxPlayers,
            hostId: data.playerId
        };
        
        const room = gameServer.createRoom(roomData);
        
        // 房主自動加入房間
        const playerData = {
            id: data.playerId,
            name: data.playerName,
            socketId: socket.id
        };
        
        gameServer.joinRoom(room.id, playerData);
        socket.join(room.id);
        
        socket.emit('roomCreated', {
            roomId: room.id,
            room: {
                id: room.id,
                name: room.name,
                maxPlayers: room.maxPlayers,
                players: Array.from(room.players.values()).map(p => ({
                    id: p.id,
                    name: p.name,
                    ready: p.ready
                }))
            }
        });
    });

    // 加入房間
    socket.on('joinRoom', (data) => {
        const result = gameServer.joinRoom(data.roomId, {
            id: data.playerId,
            name: data.playerName,
            socketId: socket.id
        });

        if (result && !result.error) {
            socket.join(data.roomId);
            
            const roomData = {
                id: result.id,
                name: result.name,
                maxPlayers: result.maxPlayers,
                players: Array.from(result.players.values()).map(p => ({
                    id: p.id,
                    name: p.name,
                    ready: p.ready
                }))
            };
            
            socket.emit('roomJoined', { room: roomData });
            socket.to(data.roomId).emit('playerJoined', {
                player: {
                    id: data.playerId,
                    name: data.playerName,
                    ready: false
                }
            });
        } else {
            socket.emit('joinError', { message: result?.error || '無法加入房間' });
        }
    });

    // 獲取房間列表
    socket.on('getRoomList', () => {
        socket.emit('roomList', gameServer.getRoomList());
    });

    // 玩家準備
    socket.on('playerReady', (data) => {
        const playerInfo = gameServer.players.get(socket.id);
        if (playerInfo) {
            const room = gameServer.rooms.get(playerInfo.roomId);
            const player = room?.players.get(playerInfo.playerId);
            if (player) {
                player.ready = data.ready;
                io.to(playerInfo.roomId).emit('playerReadyUpdate', {
                    playerId: playerInfo.playerId,
                    ready: data.ready
                });
            }
        }
    });

    // 開始遊戲
    socket.on('startGame', () => {
        const playerInfo = gameServer.players.get(socket.id);
        if (playerInfo) {
            const room = gameServer.rooms.get(playerInfo.roomId);
            if (room && room.host === playerInfo.playerId) {
                if (gameServer.startGame(playerInfo.roomId)) {
                    io.to(playerInfo.roomId).emit('gameStarted');
                }
            }
        }
    });

    // 玩家動作
    socket.on('playerAction', (action) => {
        gameServer.handlePlayerAction(socket.id, action);
    });

    // 聊天訊息
    socket.on('chatMessage', (data) => {
        const playerInfo = gameServer.players.get(socket.id);
        if (playerInfo) {
            const room = gameServer.rooms.get(playerInfo.roomId);
            const player = room?.players.get(playerInfo.playerId);
            if (player) {
                io.to(playerInfo.roomId).emit('chatMessage', {
                    playerName: player.name,
                    message: data.message,
                    timestamp: Date.now()
                });
            }
        }
    });

    // 斷線處理
    socket.on('disconnect', () => {
        console.log(`玩家斷線: ${socket.id}`);
        gameServer.leaveRoom(socket.id);
    });
});

// 健康檢查端點
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        rooms: gameServer.rooms.size,
        players: gameServer.players.size
    });
});

// 靜態檔案路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 啟動服務器
server.listen(PORT, () => {
    console.log(`🎮 多人遊戲服務器運行在端口 ${PORT}`);
    console.log(`🌐 訪問: http://localhost:${PORT}`);
});