# 🎃 萬聖節射擊遊戲 - 安裝指南

## 🚀 快速開始

### 方法 1: 離線測試版本（立即可用）
如果你想立即測試遊戲功能，可以使用離線版本：

1. 直接打開 `index-offline.html` 檔案
2. 享受單人遊戲體驗（模擬多人功能）

### 方法 2: 完整多人版本（需要 Node.js）

## 📦 安裝 Node.js

### macOS 安裝方法

#### 選項 1: 使用 Homebrew（推薦）
```bash
# 1. 安裝 Homebrew（如果還沒有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安裝 Node.js
brew install node

# 3. 驗證安裝
node --version
npm --version
```

#### 選項 2: 官方安裝包
1. 訪問 [Node.js 官網](https://nodejs.org/)
2. 下載 **LTS 版本**（推薦）
3. 雙擊 `.pkg` 檔案安裝
4. 重新啟動終端

#### 選項 3: 使用 nvm（Node Version Manager）
```bash
# 1. 安裝 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. 重新載入終端配置
source ~/.zshrc

# 3. 安裝最新 LTS 版本
nvm install --lts
nvm use --lts

# 4. 驗證安裝
node --version
npm --version
```

## 🎮 啟動遊戲服務器

安裝 Node.js 後，執行以下命令：

```bash
# 1. 安裝依賴
npm install

# 2. 啟動服務器
npm start
```

看到以下訊息表示成功：
```
🎃 萬聖節射擊遊戲服務器運行在端口 3000
```

## 🌐 訪問遊戲

1. 打開瀏覽器
2. 訪問 `http://localhost:3000`
3. 開始多人對戰！

## 🔧 開發模式

如果你想修改代碼並自動重啟：

```bash
# 安裝 nodemon（如果還沒有）
npm install -g nodemon

# 使用開發模式啟動
npm run dev
```

## 🐛 常見問題

### Q: 顯示 "npm: command not found"
**A:** Node.js 沒有正確安裝，請重新按照上述步驟安裝。

### Q: 端口 3000 被佔用
**A:** 修改 `server.js` 中的 PORT 變數，或者：
```bash
PORT=3001 npm start
```

### Q: 無法連接到遊戲服務器
**A:** 檢查：
1. 服務器是否正在運行
2. 防火牆設定
3. 瀏覽器控制台是否有錯誤

### Q: 遊戲卡頓或延遲
**A:** 
1. 關閉其他佔用資源的程式
2. 使用現代瀏覽器（Chrome、Firefox、Safari）
3. 檢查網路連接

## 📱 多設備測試

要在多個設備上測試：

1. 確保所有設備連接到同一個 WiFi
2. 找到你的 IP 地址：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. 在其他設備上訪問 `http://你的IP:3000`

## 🚀 部署到 Railway

準備部署到線上：

1. 將代碼推送到 GitHub
2. 在 [Railway.app](https://railway.app) 創建新專案
3. 連接你的 GitHub 倉庫
4. 自動部署完成！

## 📞 需要幫助？

如果遇到問題：

1. 檢查 `README.md` 檔案
2. 查看 `DEPLOY.md` 部署指南
3. 檢查瀏覽器開發者工具的控制台錯誤

---

**祝你遊戲愉快！🎃👻🦇**