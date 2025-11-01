# 🚀 快速啟動指南

## 📦 項目概述

這是一個基於 Node.js + Socket.IO 的多人線上射擊遊戲，參考了 Halloween Shot Game 的架構設計，專為 Render 平台部署而優化。

## 🎯 遊戲特色

- ✅ **即時多人對戰** - 最多 6 人同時遊戲
- ✅ **房間系統** - 創建/加入遊戲房間
- ✅ **即時聊天** - 房間內聊天功能
- ✅ **流暢操作** - WASD 移動，滑鼠瞄準射擊
- ✅ **即時排行榜** - 擊殺/死亡統計
- ✅ **響應式設計** - 支援桌面和移動設備
- ✅ **Render 優化** - 針對 Render 平台優化

## 📁 項目結構

```
render-multiplayer-game/
├── server.js              # Node.js 服務器（Socket.IO + Express）
├── package.json           # 項目依賴和腳本
├── render.yaml           # Render 部署配置
├── .gitignore            # Git 忽略文件
├── README.md             # 詳細說明文檔
├── DEPLOY-GUIDE.md       # 完整部署指南
├── QUICK-START.md        # 本文件
├── test-local.js         # 本地測試腳本
└── public/               # 前端資源
    ├── index.html        # 遊戲主頁面
    ├── style.css         # 響應式樣式
    └── game.js           # 遊戲邏輯（Socket.IO 客戶端）
```

## 🛠️ 技術棧

### 後端
- **Node.js** - 服務器運行環境
- **Express.js** - Web 框架
- **Socket.IO** - 即時雙向通訊
- **CORS** - 跨域資源共享

### 前端
- **HTML5 Canvas** - 遊戲渲染引擎
- **Socket.IO Client** - 即時通訊客戶端
- **CSS3** - 現代響應式設計
- **Vanilla JavaScript** - 純 JavaScript 遊戲邏輯

## 🚀 本地開發

### 前置需求
- Node.js 18+ 
- npm 或 yarn

### 安裝步驟

1. **安裝 Node.js**（如果尚未安裝）
   - 訪問 [nodejs.org](https://nodejs.org)
   - 下載並安裝 LTS 版本

2. **安裝項目依賴**
```bash
npm install
```

3. **啟動開發服務器**
```bash
npm run dev
```

4. **啟動生產服務器**
```bash
npm start
```

5. **測試服務器**
```bash
npm test
```

6. **訪問遊戲**
```
http://localhost:3000
```

## ☁️ 部署到 Render

### 快速部署（推薦）

1. **推送到 GitHub**
```bash
git init
git add .
git commit -m "🎮 多人射擊遊戲"
git remote add origin https://github.com/你的用戶名/multiplayer-game.git
git push -u origin main
```

2. **在 Render 部署**
   - 訪問 [render.com](https://render.com)
   - 點擊 "New +" → "Web Service"
   - 連接 GitHub 倉庫
   - Render 會自動檢測 `render.yaml` 配置
   - 點擊 "Create Web Service"

3. **等待部署完成**
   - 通常需要 2-5 分鐘
   - 獲得類似 `https://multiplayer-game-xxxx.onrender.com` 的 URL

### 詳細部署指南
請參考 `DEPLOY-GUIDE.md` 獲得完整的部署說明。

## 🎮 遊戲玩法

### 基本操作
- **移動**: WASD 或方向鍵
- **瞄準**: 滑鼠移動
- **射擊**: 滑鼠左鍵持續按住
- **聊天**: 在房間等待畫面輸入訊息

### 遊戲流程
1. 輸入玩家名稱
2. 創建房間或加入現有房間
3. 等待其他玩家加入
4. 所有玩家點擊「準備」
5. 房主點擊「開始遊戲」
6. 3 分鐘即時對戰
7. 查看最終排名

### 勝利條件
- 擊殺/死亡比例最高的玩家獲勝
- 擊殺敵人獲得分數
- 被擊殺會立即在隨機位置重生

## 🔧 自定義配置

### 遊戲參數（server.js）
```javascript
gameData: {
    duration: 180,        // 遊戲時長（秒）
    bullets: [],
    powerUps: [],
    obstacles: []         // 障礙物數量
}
```

### 玩家設定（game.js）
```javascript
gameConfig: {
    playerSpeed: 5,       // 移動速度
    bulletSpeed: 10,      // 子彈速度
    fireRate: 200,        // 射擊冷卻時間（毫秒）
    mapWidth: 800,        // 地圖寬度
    mapHeight: 600        // 地圖高度
}
```

## 🐛 故障排除

### 常見問題

1. **npm 命令找不到**
   - 確保已安裝 Node.js
   - 重新啟動終端

2. **端口被佔用**
   - 修改 `server.js` 中的 PORT
   - 或終止佔用端口的程序

3. **Socket.IO 連線失敗**
   - 檢查防火牆設定
   - 確認服務器正常運行

4. **遊戲畫面空白**
   - 檢查瀏覽器控制台錯誤
   - 確認 Canvas 支援

## 📈 性能優化

### 服務器端
- 60 FPS 遊戲循環
- 自動清理無效房間
- 優化碰撞檢測

### 客戶端
- Canvas 渲染優化
- 減少網路請求頻率
- 響應式設計

## 🔮 擴展功能

可以考慮添加的功能：
- [ ] 更多武器類型
- [ ] 不同遊戲模式
- [ ] 玩家等級系統
- [ ] 音效和背景音樂
- [ ] 地圖編輯器
- [ ] 觀戰模式
- [ ] 團隊對戰
- [ ] 道具系統

## 📞 支援

如果遇到問題：
1. 查看 `README.md` 詳細文檔
2. 參考 `DEPLOY-GUIDE.md` 部署指南
3. 檢查瀏覽器控制台錯誤
4. 查看服務器日誌

---

## 🎉 開始遊戲！

現在你已經準備好啟動這個多人射擊遊戲了！

**本地測試**: `npm start` → `http://localhost:3000`
**線上部署**: 推送到 GitHub → 在 Render 部署

🎮 **祝你遊戲愉快！**