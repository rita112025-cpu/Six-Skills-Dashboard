# Six-Skills-Dashboard 🧰

一頁式 worklog 風格的 **Agent Skill 總覽儀表板**：16 個 skill（6 核心 + 10 堆疊）集中管理，支援互動評分、階段篩選、一鍵複製安裝路徑。交付檔為單檔 HTML、零依賴，丟上 GitHub Pages 即可上線。

樣式為 **zinc + violet 雙主題**（Inter / Noto Sans TC / JetBrains Mono，macOS terminal 視窗風格），右上角可切換 **暗版 / 亮版**。

## ✨ 功能

- 🌓 **暗版 / 亮版可切換**：存 `localStorage`（key: `skills:theme`），重新載入前先套用、不閃屏；階段配色暗亮各一組
- 🃏 **16 張 skill 卡**：emoji、GitHub 來源連結、階段標籤、建議度（★）、3 行說明、安裝路徑
- ⭐ **互動評分**：存瀏覽器本機 `localStorage`（key: `skills:ratings`），重新整理保留、不同裝置不同步；點同一顆星可清除
- 🏷️ **階段篩選 pills**：與 📍 Showing N of 16 即時連動，0 張卡的階段自動隱藏
- 📋 **一鍵複製安裝路徑**
- 🗺️ **7 步工作流程圖**：需求 → 開發 → UI → SEO → 驗收 → 發布 → 工具
- 🚫 暫不裝清單（附原因）、✅ 自我驗證清單、🧹 一鍵清除全部評分
- 📱 響應式：手機 390px 自動單欄

## 📦 Skill 清單

### 核心 6 個

| Skill | 階段 | 來源 |
|---|---|---|
| grill-with-docs | 01-需求 | [exinfinite/mattpocock-skills](https://github.com/exinfinite/mattpocock-skills) |
| brainstorming | 01-需求 | [obra/superpowers](https://github.com/obra/superpowers) |
| vercel-react-best-practices | 02-開發 | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| ui-ux-pro-max | 03-UI | 自建 |
| impeccable | 03-UI | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| seo-audit | 04-SEO | [skills.sh](https://www.skills.sh/coreyhaines31/marketingskills/seo-audit) |

### 堆疊 10 個（🟢 NEW · 801 萬下載堆疊）

| Skill | 階段 | 來源 |
|---|---|---|
| find-skills | 01-需求 | [vercel-labs/skills](https://github.com/vercel-labs/skills) |
| grill-me | 01-需求 | [mattpocock/skills](https://github.com/mattpocock/skills) |
| prototype | 02-開發 | [mattpocock/skills](https://github.com/mattpocock/skills) |
| diagnosing-bugs | 02-開發 | [mattpocock/skills](https://github.com/mattpocock/skills) |
| subagent-driven-development | 02-開發 | [obra/superpowers](https://github.com/obra/superpowers) |
| frontend-design | 03-UI | [anthropics/skills](https://github.com/anthropics/skills) |
| image-to-code | 03-UI | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) |
| agent-browser | 05-驗收 | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| skill-creator | 07-工具 | [anthropics/skills](https://github.com/anthropics/skills) |
| mcp-builder | 07-工具 | [anthropics/skills](https://github.com/anthropics/skills) |

## 🚀 本機執行

```bash
bun install        # 或 npm install
bun run dev        # http://localhost:3000
```

主頁 `/`（`src/app/page.tsx`）以全螢幕 iframe 載入 `public/showcase.html`，所見即交付檔。

### 部署到 GitHub Pages

`public/showcase.html` 是單檔零依賴，改名 `index.html` 放進任何靜態空間即上線，不需要 Node。

## 🛠️ 維護方式

所有內容都是 `public/showcase.html` 內的資料陣列，**改一個物件即可，互動邏輯不用動**：

| 陣列 / 區塊 | 用途 |
|---|---|
| `SKILLS` | 加 / 改 skill（`badge` 為選填欄位；Showing N、pill 計數、階段配色自動推導） |
| `STAGES` | 階段 id → 標籤 + CSS 變數色 |
| `WORKFLOW` | 流程圖各步 |
| `NOT_INSTALLED` | 暫不裝清單（`tag` 為右上小標籤） |
| `CHECKLIST` | 自我驗證清單 |

主題色在 CSS 的 `:root[data-theme="dark"]` / `:root[data-theme="light"]` 兩個 token 區塊（含 `--st-01` ~ `--st-07` 階段色各一組）。

## 📁 專案結構

```
src/app/page.tsx        # 主頁：全螢幕 iframe 載入 showcase.html
public/showcase.html    # 交付檔（單檔零依賴，zinc + violet 雙主題）
index.html              # GitHub Pages 首頁：轉址到 public/showcase.html
worklog.md              # 開發記錄
```

> 字體（Inter / Noto Sans TC / JetBrains Mono）由 Google Fonts 載入，離線時自動退回系統字體，功能不受影響。
