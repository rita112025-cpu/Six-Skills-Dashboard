---
Task ID: 1
Agent: Z.ai Code (main)
Task: 製作一頁式 worklog 風格的「6 個核心 Skill 總覽」單檔 HTML（零依賴、可直接丟 GitHub Pages），含可互動評分 / 篩選 pills / Showing N of 6 / 工作流程圖 / 暫不裝清單 / 驗證清單。重點要求：好維護。

Work Log:
- 讀 worklog.md（空）、dev.log（dev server 3000 正常）、確認 src/app/page.tsx 是預設 placeholder。
- 設計：把所有內容抽成資料陣列（SKILLS / STAGES / WORKFLOW / NOT_INSTALLED / CHECKLIST），加 skill 只改一個物件，篩選計數/Showing N/階段配色全自動推導。JS 只負責互動。
- 寫 standalone 檔 /home/z/my-project/public/showcase.html（單檔零依賴，深色 worklog 主題，emoji 標題、✅ 說明、⭐ 評分、🏷️ pills、📍 Showing N、🚫 空狀態、🗺️ 流程圖、🚫 暫不裝、✅ 驗證清單 + 🧹 清除鈕、sticky footer、toast）。
- 改 src/app/page.tsx 為全螢幕 iframe 指向 /showcase.html，預覽即交付檔，零分歧。
- Agent Browser 驗證：頁面渲染、6 卡 + 6 階段流程圖 + 暫不裝 4 項 + 清單 7 項；點 5 星 → toast「★ 5/5 — All-time favorite · impeccable」+ localStorage {impeccable:5}；「已評分」pill 計數 0→1；01-需求 pill → Showing 2；複製路徑 → toast「已複製 ~/.claude/skills/grill-with-docs」+ copied 狀態；清除鈕 → ratings {} + 空狀態「點星星試試」出現；reload 後評分保留；點同一顆星清除評分 + toast「已清除 impeccable 評分」；mobile 390px 卡片單欄；footer 在文件底（flex:1 0 auto 推下）；console 無 error。
- 修正：renderPills 過濾掉 count=0 的階段 pill（原本多出「05-驗收 0 / 06-發布 0」噪音，因無 skill 對應該兩階段）。重驗通過。
- bun run lint 通過。

Stage Summary:
- 交付檔：/home/z/my-project/public/showcase.html（單檔零依賴，改名 index.html 丟 GitHub Pages repo 即上線）。
- 預覽：/ route 用 iframe 載入 showcase.html，所見即交付。
- 維護方式：改內容改 SKILLS / STAGES / WORKFLOW / NOT_INSTALLED / CHECKLIST 五個陣列即可，互動邏輯不需動。加第 7 個 skill = 加一個物件，Showing N / pill 計數 / 階段配色自動更新。
- localStorage key: skills:ratings。評分僅存本機、不同裝置不同步。
- 全部核心互動 Agent Browser 端對端驗證通過。
