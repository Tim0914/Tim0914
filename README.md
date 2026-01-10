<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 抽籤小幫手 (Lucky Helper)

這是一個簡單易用的抽籤工具應用程式，幫助您輕鬆進行隨機抽籤。

## ✨ 功能特色 (Features)

*   **隨機抽籤**：快速產生隨機結果。
*   **群組管理**：支援群組功能 (TODO: 依實際功能補充)。
*   **響應式設計**：支援桌面與行動裝置瀏覽。

## 🛠️ 技術堆疊 (Tech Stack)

*   **框架**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **語言**: [TypeScript](https://www.typescriptlang.org/)
*   **樣式**: CSS / Tailwind (依實際專案確認)
*   **動畫**: Framer Motion
*   **測試**: Vitest + React Testing Library

## 🚀 本機執行 (Run Locally)

**前置需求:** Node.js (建議 v18 或以上)

1.  **複製專案並安裝套件**:
    ```bash
    npm install
    ```

2.  **設定環境變數**:
    將 `.env.local` 中的 `GEMINI_API_KEY` 設定為您的 API Key (如果需要)。

3.  **啟動開發伺服器**:
    ```bash
    npm run dev
    ```
    應用程式將於 `http://localhost:3000` 啟動。

4.  **執行測試**:
    ```bash
    npm test
    ```

## 📦 部署 (Deployment)

本專案已設定 **GitHub Actions** 自動部署。
當推送到 `main` 分支時，會自動建置並部署至 **GitHub Pages**。

若要手動建置：
```bash
npm run build
```
建置檔案位於 `dist` 資料夾。
