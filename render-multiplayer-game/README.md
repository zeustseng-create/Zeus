# 🎮 多人線上射擊遊戲

一個基於 Node.js + Socket.IO 的即時多人射擊遊戲，專為 Render 平台部署而設計。

## ✨ 功能特色

- 🎯 **即時多人對戰** - 支援最多 6 人同時遊戲
- 🏠 **房間系統** - 創建或加入遊戲房間
- 💬 **即時聊天** - 房間內聊天功能
- 🎮 **流暢操作** - WASD 移動，滑鼠瞄準射擊
- 📊 **即時排行榜** - 顯示擊殺/死亡統計
- 📱 **響應式設計** - 支援桌面和移動設備
- ☁️ **雲端部署** - 針對 Render 平台優化

## 🚀 快速開始

### 本地開發

1. **安裝依賴**
```bash
npm install
```

2. **啟動開發服務器**
```bash
npm run dev
```

3. **訪問遊戲**
```
http://localhost:3000
```

### 部署到 Render

#### 方法一：使用 GitHub 自動部署

1. **準備 GitHub 倉庫**
```bash
git init
git add .
git commit -m "🎮 多人射擊遊戲 - 初始版本"
git remote add origin https://github.com/你的用戶名/multiplayer-game.git
git push -u origin main
```

2. **在 Render 上部署**
   - 訪問 [render.com](https://render.com)
   - 點擊 "New +" → "Web Service"
   - 連接你的 GitHub 倉庫
   - 選擇這個項目
   - Render 會自動檢測配置並開始部署

#### 方法二：使用 render.yaml 配置

項目已包含 `render.yaml` 配置文件，Render 會自動使用此配置進行部署。

## 🎮 遊戲玩法

### 基本操作
- **移動**: WASD 或方向鍵
- **瞄準**: 滑鼠移動
- **射擊**: 滑鼠左鍵
- **聊天**: 在房間等待時可以聊天

### 遊戲流程
1. **創建或加入房間**
2. **等待其他玩家並準備**
3. **房主開始遊戲**
4. **3分鐘對戰**
5. **查看最終排名**

### 勝利條件
- 遊戲結束時擊殺/死亡比例最高的玩家獲勝
- 擊殺敵人 +1 分
- 被擊殺 -1 分（會立即重生）

## 🛠️ 技術架構

### 後端技術
- **Node.js** - 服務器運行環境
- **Express.js** - Web 框架
- **Socket.IO** - 即時通訊
- **CORS** - 跨域支援

### 前端技術
- **HTML5 Canvas** - 遊戲渲染
- **Socket.IO Client** - 即時通訊
- **CSS3** - 響應式設計
- **Vanilla JavaScript** - 遊戲邏輯

### 部署平台
- **Render** - 雲端託管平台
- **GitHub** - 代碼版本控制

## 📁 項目結構

```
render-multiplayer-game/
├── server.js              # 服務器主文件
├── package.json           # 項目配置
├── render.yaml           # Render 部署配置
├── README.md             # 項目說明
└── public/               # 前端資源
    ├── index.html        # 主頁面
    ├── style.css         # 樣式文件
    └── game.js           # 遊戲邏輯
```

## 🔧 配置說明

### 環境變數
- `PORT` - 服務器端口（Render 自動設定）
- `NODE_ENV` - 運行環境（production/development）

### 遊戲設定
可在 `server.js` 中調整以下參數：
- `duration` - 遊戲時長（預設 180 秒）
- `maxPlayers` - 最大玩家數（預設 4 人）
- `fireRate` - 射擊冷卻時間（預設 200ms）

## 🐛 故障排除

### 常見問題

1. **連線失敗**
   - 檢查網路連線
   - 確認服務器正常運行
   - 查看瀏覽器控制台錯誤

2. **遊戲卡頓**
   - 檢查網路延遲
   - 關閉其他佔用頻寬的應用
   - 嘗試重新整理頁面

3. **無法創建房間**
   - 確認已連接到服務器
   - 檢查房間名稱和玩家名稱是否填寫

### 開發調試

1. **查看服務器日誌**
```bash
npm start
```

2. **查看瀏覽器控制台**
   - 按 F12 打開開發者工具
   - 查看 Console 標籤頁的錯誤信息

## 🚀 性能優化

### 服務器優化
- 使用 60 FPS 遊戲循環
- 定期清理無效房間和玩家
- 優化碰撞檢測算法

### 客戶端優化
- Canvas 渲染優化
- 減少不必要的網路請求
- 響應式設計適配移動設備

## 🔮 未來計劃

- [ ] 添加更多遊戲模式
- [ ] 實現玩家等級系統
- [ ] 添加音效和背景音樂
- [ ] 支援更多武器類型
- [ ] 添加地圖編輯器
- [ ] 實現觀戰模式

## 📄 授權

MIT License - 詳見 LICENSE 文件

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**🎮 開始你的多人射擊之旅吧！**