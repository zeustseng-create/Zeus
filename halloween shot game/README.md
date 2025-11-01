# 🎃 萬聖節射擊大戰

一個萬聖節主題的線上多人射擊遊戲，支援房間系統和即時對戰。

## 🎮 遊戲特色

- **萬聖節主題**: 南瓜、幽靈、蜘蛛等萬聖節元素
- **多人對戰**: 支援 2-8 人同時遊戲
- **房間系統**: 可以創建房間或加入現有房間
- **即時聊天**: 房間內聊天功能
- **排行榜**: 即時顯示玩家戰績

## 🕹️ 遊戲操作

- **移動**: WASD 或方向鍵
- **瞄準**: 滑鼠移動
- **射擊**: 滑鼠左鍵
- **重新裝彈**: R 鍵

## 🚀 如何開始

### 本地開發
1. 安裝依賴: `npm install`
2. 啟動服務器: `npm start`
3. 打開瀏覽器訪問 `http://localhost:3000`

### Railway 部署
1. 將代碼推送到 GitHub
2. 在 Railway 中連接你的 GitHub 倉庫
3. Railway 會自動檢測並部署 Node.js 應用
4. 部署完成後即可開始多人對戰

## 📁 檔案結構

```
├── index.html      # 主頁面
├── style.css       # 樣式檔案
├── game.js         # 遊戲邏輯
└── README.md       # 說明檔案
```

## 🔧 技術特點

- **純前端**: 使用 HTML5 Canvas 和 JavaScript
- **響應式設計**: 支援不同螢幕尺寸
- **模組化程式碼**: 易於擴展和維護
- **萬聖節主題**: 完整的視覺設計

## 🎯 遊戲目標

在限定時間內擊敗其他玩家，獲得最高的 K/D 比率！

## 🌐 部署到 Railway

1. **準備代碼**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Railway 部署**
   - 訪問 [Railway.app](https://railway.app)
   - 使用 GitHub 登入
   - 點擊 "New Project" → "Deploy from GitHub repo"
   - 選擇你的倉庫
   - Railway 會自動檢測 Node.js 並開始部署

3. **環境變數**（可選）
   - `PORT`: 服務器端口（Railway 會自動設定）

## 📝 技術架構

- **前端**: HTML5 Canvas + JavaScript
- **後端**: Node.js + Express + Socket.IO
- **即時通訊**: WebSocket
- **部署**: Railway Platform

---

**萬聖節快樂！🎃👻🦇**