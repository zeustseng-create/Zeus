# 萬聖節射擊小遊戲（靜態網站範例）

簡單的 Canvas 射擊遊戲，可直接部署為 GitHub Pages 靜態站。

快速啟動（在 dev container 或本機）：

```bash
cd /path/to/Zeus/halloween-shot-static
python3 -m http.server 6000
# 然後在瀏覽器打開 http://localhost:6000
```

部署到 GitHub Pages：
- 建議將 `halloween-shot-static` 資料夾 push 到 repo（或把內容放到 `docs/`），然後在 GitHub Pages 設定中選擇 `main` branch / `docs` folder，或使用 `gh-pages` 封包將 `dist`（此專案不需 build）發佈。

遊戲說明：
- 點擊畫面發射子彈，擊中下落的目標得分。任何目標落到底部遊戲即結束。

如需我把此資料夾自動推到遠端或幫你把它設定為 GitHub Pages，回覆「部署」並給我遠端 repo URL 或授權推送。