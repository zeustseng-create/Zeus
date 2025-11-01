# 🚀 Railway 部署指南

## 快速部署步驟

### 1. 準備 GitHub 倉庫
```bash
# 初始化 Git 倉庫
git init

# 添加所有檔案
git add .

# 提交代碼
git commit -m "🎃 萬聖節射擊遊戲 - 初始版本"

# 連接到你的 GitHub 倉庫
git remote add origin https://github.com/你的用戶名/halloween-shooter-game.git

# 推送代碼
git push -u origin main
```

### 2. Railway 部署
1. 訪問 [Railway.app](https://railway.app)
2. 使用 GitHub 帳號登入
3. 點擊 **"New Project"**
4. 選擇 **"Deploy from GitHub repo"**
5. 選擇你剛才創建的倉庫
6. Railway 會自動檢測到 Node.js 專案並開始部署

### 3. 部署完成
- 部署完成後，Railway 會提供一個 URL
- 點擊 URL 即可訪問你的萬聖節射擊遊戲
- 分享 URL 給朋友一起遊戲！

## 🔧 自訂設定

### 環境變數
在 Railway 專案設定中，你可以添加以下環境變數：

- `PORT`: 服務器端口（Railway 會自動設定，通常不需要手動設定）

### 自訂域名
1. 在 Railway 專案中點擊 **"Settings"**
2. 找到 **"Domains"** 部分
3. 點擊 **"Custom Domain"** 添加你的域名

## 📊 監控和日誌

### 查看日誌
1. 在 Railway 專案頁面點擊 **"Deployments"**
2. 點擊最新的部署
3. 查看 **"Build Logs"** 和 **"Deploy Logs"**

### 監控性能
- Railway 提供基本的 CPU 和記憶體使用監控
- 在專案頁面可以查看即時指標

## 🎮 遊戲功能測試

部署完成後，測試以下功能：

1. **房間系統**
   - 創建房間
   - 加入房間
   - 房間列表顯示

2. **多人連線**
   - 多個瀏覽器標籤頁測試
   - 不同設備連線測試

3. **遊戲玩法**
   - 移動同步
   - 射擊同步
   - 血量同步
   - 排行榜更新

## 🐛 常見問題

### 部署失敗
- 檢查 `package.json` 中的依賴是否正確
- 確保 Node.js 版本兼容（建議 16+）

### 連線問題
- 確保 Socket.IO 正常工作
- 檢查瀏覽器控制台是否有錯誤

### 性能問題
- Railway 免費方案有資源限制
- 考慮升級到付費方案以獲得更好性能

## 🎯 後續優化

1. **添加更多遊戲模式**
2. **實現玩家等級系統**
3. **添加更多萬聖節元素**
4. **優化移動端體驗**
5. **添加音效和背景音樂**

---

**祝你部署順利！🎃 萬聖節快樂！**