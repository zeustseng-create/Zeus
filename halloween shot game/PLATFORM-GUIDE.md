# 🏥 醫院治療遊戲 - 平台版本指南

我已經為你建立了兩個完全相同的遊戲專案，分別針對 Mac 和 Windows 系統進行了優化。

## 📁 專案結構

```
├── hospital-game-mac/          # Mac 版本
│   ├── assets/
│   │   ├── icon.icns          # Mac 圖標格式
│   │   └── entitlements.mac.plist
│   ├── js/game.js             # 遊戲邏輯 (相同)
│   ├── styles/main.css        # 遊戲樣式 (相同)
│   ├── index.html             # 主頁面 (相同)
│   ├── main.js                # Electron 主程序 (相同)
│   ├── package.json           # Mac 專用配置
│   ├── start.sh               # Mac 啟動腳本
│   ├── build-mac.sh           # Mac 打包腳本
│   └── README-MAC.md          # Mac 專用說明
│
└── hospital-game-windows/      # Windows 版本
    ├── assets/
    │   └── icon.ico           # Windows 圖標格式
    ├── js/game.js             # 遊戲邏輯 (相同)
    ├── styles/main.css        # 遊戲樣式 (相同)
    ├── index.html             # 主頁面 (相同)
    ├── main.js                # Electron 主程序 (相同)
    ├── package.json           # Windows 專用配置
    ├── start.bat              # Windows 啟動腳本
    ├── build-windows.bat      # Windows 打包腳本
    ├── LICENSE.txt            # Windows 授權檔案
    └── README-WINDOWS.md      # Windows 專用說明
```

## 🍎 Mac 版本特色

### 系統整合
- **原生 macOS 選單**: 支援 Cmd+N, Cmd+Q 等快捷鍵
- **Dock 整合**: 圖標顯示在 Dock 中
- **全螢幕支援**: Control+Cmd+F 切換全螢幕
- **Retina 顯示器**: 高解析度螢幕優化
- **通知中心**: 使用 macOS 原生通知

### 打包格式
- `.dmg` 安裝包 (Intel + Apple Silicon)
- `.zip` 壓縮包
- 支援程式碼簽名和公證

### 快速開始
```bash
cd hospital-game-mac
chmod +x start.sh build-mac.sh
./start.sh                    # 啟動遊戲
./build-mac.sh                # 打包應用
```

## 🪟 Windows 版本特色

### 系統整合
- **開始選單**: 自動建立開始選單捷徑
- **桌面捷徑**: 安裝時可選擇建立
- **工作列**: 支援工作列預覽和跳躍清單
- **系統托盤**: 最小化到系統托盤
- **高 DPI 支援**: 自動適應高解析度螢幕

### 打包格式
- `.exe` NSIS 安裝程式 (32/64 位元)
- `.exe` 免安裝版本
- 支援程式碼簽名

### 快速開始
```cmd
cd hospital-game-windows
start.bat                     # 啟動遊戲
build-windows.bat             # 打包應用
```

## 🎮 遊戲內容 (兩版本完全相同)

### 核心玩法
- **病人管理**: 診斷和治療各種病人
- **資源管理**: 管理醫院資金和設備
- **時間管理**: 在限定時間內提升效率
- **成就系統**: 解鎖各種成就挑戰

### 病人類型
1. **感冒患者** 🤧 - $100
2. **發燒病人** 🤒 - $200
3. **腹痛患者** 😰 - $180
4. **外傷病人** 🩹 - $300
5. **心臟病患** 💔 - $500

### 商店物品
- **高級聽診器** ($500) - 提升診斷準確度
- **疫苗套裝** ($300) - 加快治療速度
- **新診療室** ($2000) - 增加診療室
- **效率提升** ($800) - 提升遊戲效率

## 🔧 開發和打包

### 前置需求
- Node.js 16+ 
- npm 或 yarn
- 對應平台的開發環境

### Mac 版本打包
```bash
cd hospital-game-mac
npm install
npm run build                 # 打包 Mac 版本
```

輸出檔案：
- `dist-mac/醫院治療遊戲-1.0.0-arm64.dmg` (Apple Silicon)
- `dist-mac/醫院治療遊戲-1.0.0-x64.dmg` (Intel Mac)

### Windows 版本打包
```cmd
cd hospital-game-windows
npm install
npm run build                 # 打包 Windows 版本
```

輸出檔案：
- `dist-windows/醫院治療遊戲-1.0.0-x64.exe` (64位元)
- `dist-windows/醫院治療遊戲-1.0.0-ia32.exe` (32位元)
- `dist-windows/醫院治療遊戲-1.0.0-portable.exe` (免安裝)

## 🎨 自訂圖標

### Mac 版本 (.icns)
1. 準備 1024x1024 PNG 圖片
2. 使用 `iconutil` 或線上工具轉換為 .icns
3. 放置在 `hospital-game-mac/assets/icon.icns`

### Windows 版本 (.ico)
1. 準備 256x256 PNG 圖片
2. 使用線上工具轉換為 .ico
3. 放置在 `hospital-game-windows/assets/icon.ico`

## 🚀 發布檢查清單

### Mac 版本
- [ ] 在 macOS 上測試運行
- [ ] 準備 .icns 圖標檔案
- [ ] 測試 Intel 和 Apple Silicon 版本
- [ ] 檢查 Gatekeeper 相容性
- [ ] 考慮程式碼簽名和公證

### Windows 版本
- [ ] 在 Windows 上測試運行
- [ ] 準備 .ico 圖標檔案
- [ ] 測試 32 位元和 64 位元版本
- [ ] 檢查防毒軟體相容性
- [ ] 測試安裝和解除安裝流程

## 📞 技術支援

### Mac 版本問題
- 參考 `hospital-game-mac/README-MAC.md`
- 檢查 macOS 版本相容性
- 確認 Xcode Command Line Tools 已安裝

### Windows 版本問題
- 參考 `hospital-game-windows/README-WINDOWS.md`
- 檢查 Visual C++ Redistributable
- 確認 Windows 版本相容性

---

**兩個版本提供完全相同的遊戲體驗，只是針對不同平台進行了優化！** 🎮