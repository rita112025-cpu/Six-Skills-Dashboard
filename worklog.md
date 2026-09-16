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

---
Task ID: 2
Agent: ZCode (main)
Task: 把「10個skills.jpg」截圖裡的 10 個代理 skill 加進主頁總覽，原本 6 個 → 16 個。

Work Log:
- 讀 10個skills.jpg：find-skills / grill-me / frontend-design / agent-browser / prototype / diagnosing-bugs / skill-creator / image-to-code / subagent-driven-development / mcp-builder（801 萬下載堆疊 · 10 Skills One Agent）。
- 圖片中 3 個來源 URL 被截斷，以 WebSearch / WebFetch 查證：find-skills → vercel-labs/skills、agent-browser → vercel-labs/agent-browser、image-to-code → leonxlnx/taste-skill；並確認 mattpocock/skills 含 grill-me/prototype/diagnosing-bugs、anthropics/skills 含 frontend-design/skill-creator/mcp-builder、obra/superpowers 含 subagent-driven-development。
- showcase.html：SKILLS 陣列加 10 個物件（badge:"NEW"）；STAGES 加「07-工具」(#58a6ff)；WORKFLOW 6 → 7 步（07 工具 = skill-creator → mcp-builder 回饋下一輪循環）；標題 / h1 / intro / Showing / CHECKLIST 全部 6 → 16；cardHTML 支援選填 mini-badge。
- src/app/page.tsx iframe title 同步改「16 個 Skill 總覽」。
- 驗證：本 session 無 node_repl MCP（browser-use 不可用）→ 改寫 Node VM + DOM stub 腳本實跑頁面 inline JS，37 項斷言全過：16 卡、10 個 NEW badge、pill 計數 4/4/4/1/1/2（06-發布 0 張自動隱藏）、流程圖 7 step、暫不裝維持 4 項、10 個來源 URL 與查證結果一致、無殘留「6 個核心」字樣。

Stage Summary:
- 主頁 6 → 16 個 skill；10 張新卡帶 🟢 NEW 標籤與已查證的 GitHub 來源連結。
- 階段對映：01-需求 +2（find-skills、grill-me）、02-開發 +3（prototype、diagnosing-bugs、subagent-driven-development）、03-UI +2（frontend-design、image-to-code）、05-驗收 +1（agent-browser）、07-工具 +2（skill-creator、mcp-builder）。
- 維護方式不變：加 / 改 skill 只動 SKILLS 一個物件；badge 為選填欄位，不填即不顯示。

---
Task ID: 3
Agent: ZCode (main)
Task: showcase.html 改版為 zinc + violet 雙主題（暗版 / 亮版可切換），樣式對齊使用者提供的 React artifact 參考檔（C:\Users\rita1\Downloads\Six-Skills-Dashboard.html）；順手修復 GitHub Pages 根路徑。

Work Log:
- 解構參考檔（minified React bundle）：設計語言 = zinc 中性色 + violet accent、Inter + Noto Sans TC + JetBrains Mono、macOS terminal 視窗（紅黃綠燈 + mono 檔名 + chip）、圓角 14-16px 卡片、dark/light class 條件樣式；版面 = micro label hero → 快速對照卡格 → workflow pipeline → 備忘 → 安裝方式 terminal。
- 重寫 public/showcase.html：CSS 改為 :root[data-theme=dark|light] token 系統（階段色 --st-01~07 暗亮各一組；--on-c / --on-amber 對比字色）；新 topbar（sticky + blur + theme 按鈕）、hero 雙欄（title + workflow.pipeline.ts terminal 永遠深色，term-force scope 固定暗階段色）、grad-line 分隔、sec-head + sec-chip、暫不裝改 tag chip（第 7 候補/不裝/另外處理）、新增安裝方式 install.sh terminal、footer active-chip。
- JS：STAGES 值改 CSS 變數；pillHTML 改發 --c inline var + 僅 stage pill 帶 data-stage；NOT_INSTALLED 加 tag 欄；新增 THEME_KEY（skills:theme）/ getTheme / applyTheme / bindTheme，init 先套主題；head 內 inline script 於 CSS 前設 data-theme 防閃屏。字體走 Google Fonts，離線自動退回系統字體。
- GitHub Pages 根路徑原本是 Jekyll 渲染 README.md（非 dashboard）→ 加根目錄 index.html 轉址 stub 指向 public/showcase.html，維持單一資料來源。
- 發現 .env 被 git 追蹤（初次 commit 即入）→ 內容僅本地 SQLite 路徑、無金鑰，git rm --cached 移除追蹤（檔案保留本地）。
- 驗證：Node VM + DOM stub 實跑兩段 inline script，46 項斷言全過（applyTheme dark/light 切換、getTheme 讀 localStorage、16 卡/10 badge/pill 計數/7 步流程/4 ni tag/來源 URL/雙主題 token）。

Stage Summary:
- 主題切換：右上角按鈕，dark ⇄ light，存 localStorage（skills:theme），head 預載防閃屏；預設暗版。
- 維護方式不變（SKILLS 單一物件）；主題色集中在 CSS 兩個 token 區塊。
- Pages：https://rita112025-cpu.github.io/Six-Skills-Dashboard/ 根路徑現會轉址至 dashboard 本體。

---
Task ID: 4
Agent: Claude Opus 5 (Claude Code)
Task: clone 下來做優化 —— 檢查運作狀況、更新版面、重點字加大、明暗對比拉夠、檢查連結正確性；並依使用者提出的四層規劃（內容正確性 → Skill 架構 → ZCode 相容性 → Dashboard UX）升級成 Skill Registry。

Work Log:
- 連結檢查：13 個外部 URL 全部實際請求。10 個 GitHub repo + skills.sh 皆 200；兩個 404 是 fonts.googleapis.com / fonts.gstatic.com 的 preconnect origin（非可導覽連結，正常）。
- 進一步用 GitHub API 列出每個 repo 的 SKILL.md 實際路徑，發現三個真錯誤：
    1) vercel-react-best-practices 在 vercel-labs/agent-skills 內的目錄其實是 react-best-practices（frontmatter name 才是 vercel-react-best-practices）→ 原本的安裝路徑會裝不到東西。
    2) image-to-code 在 leonxlnx/taste-skill 內的目錄是 image-to-code-skill。
    3) grill-with-docs 原本指向 exinfinite/mattpocock-skills（fork），已改指上游 mattpocock/skills。
       另確認 grill-me 實際路徑是 skills/productivity/grill-me（不在 engineering 下）。
- 抓下 14 份真正的 SKILL.md 並解析 frontmatter，量到真實數據：description 長度 51–925 字元、body 0.03–35 KB、各自的額外 frontmatter 欄位。
    - 重要發現：grill-with-docs / grill-me 本體只有 3 行，是轉呼叫 Claude Code Skill 工具的 stub，真正邏輯在 grilling / domain-modeling → 跨平台會失效，已標為 ZCode「部分支援」並列入不建議清單說明。
    - impeccable description 895 字元，已接近 ZCode 的 1024 上限，卡片會亮 warn。
    - agent-browser 以 allowed-tools 綁 Bash 權限且需先裝 npm CLI → 標部分支援。
- 查證 ZCode 官方文件（zcode.z.ai/en/docs/skill 與 /plugin）：name/description 必填、description 上限 1024 字元（超過整包丟棄）、body 超過 100KB 截斷、plugin 結構為 .zcode-plugin/plugin.json + skills/<name>/SKILL.md、plugin.json 只有 name 必填且需符合 ^[a-z0-9][a-z0-9._-]{0,127}$。Health 檢查與匯出格式都照這份寫。
- 重寫 public/showcase.html（1156 → 1939 行）：
    [內容正確性] 所有數字改由資料推導（stats()），HTML 不再寫死 16 / 6 / 10 / 7；新增 tier 欄位讓 Core / Optional 自動計算。
    [Skill 架構] STAGES 加 kind 欄位：pipeline 走流程圖、tool 獨立成 Dev Tools 區，find-skills / skill-creator / mcp-builder 脫離 pipeline；新增 05-測試 stage（diagnosing-bugs）與 06-驗收 / 07-發布；skill 之間加 relations（接在前 / 接在後 / 搭配），可點擊跳卡。
    [ZCode 相容性] 每張卡加 Compatibility（4 個平台 ✓/⚠/?）與 Skill Health（逐項對照 ZCODE_LIMITS，0–10 分 + 進度條）。抓不到來源的一律標「未驗證」並排除在分母外，不假裝通過。
    [Dashboard UX] 加搜尋框（多關鍵字 AND，/ 聚焦、Esc 清除）、三軸 pill（分類 / 階段 / Agent）、4 條推薦流程可一鍵複製、不建議清單改成 status + 替代方案、評分可匯出／匯入 JSON。
- Plugin 匯出：用純 JS 寫最小 ZIP writer（store 法 + CRC32 表，無外部套件），輸出 .zcode-plugin/plugin.json、.claude-plugin/plugin.json、registry.json、fetch-skills.sh、fetch-skills.ps1、README.md。
    刻意不產生假的 SKILL.md —— 第三方內文著作權屬原作者，改附已核對的 raw URL 與取檔腳本。
- 排版：導入 1.125 模組化級距，內文 16px → 23px，全站最小字級 16px（原本有 .56rem ≈ 9px）；容器 1120px → 1440px；斷點整體上移（860/640 → 1100/860/520）；卡片 minmax 300 → 420px；sticky nav 76px 並同步 scroll-padding-top；新增 @media print 用 pt 級距；加 prefers-reduced-motion。
- 對比：改寫暗亮兩組 token。亮版 --text-faint 由 #8a8a93（3.6:1，不合格）改 #5c5c66（6.6:1）、--amber 由 #d97706（3.4:1）改 #a35709（5.2:1）、--green 改 #116b33；暗版新增 --star-off 讓未評分星星從 1.3:1 提到 3.4:1；stage-tag 底色 tint 12% → 8%。

驗證:
- Node VM + DOM stub 實跑頁面 inline script：128 項斷言，127 過；唯一「失敗」是測試寫錯（全文搜尋 "zcode" 會命中 agentNote 裡提到 ZCode 的 impeccable，屬正確行為），已確認非程式問題。
- ZIP 實際寫出後 unzip -t 通過，6 個檔案無錯誤；解開後跑 fetch-skills.sh，成功抓回 14 份 SKILL.md，逐一檢查都有 name 與 description。
- 瀏覽器實測（http://localhost:4173）：搜尋 browser → 1 張、ui → 8 張、無結果 → empty state 出現；階段 03-UI → 4 張、分類 core → 6 張、Agent zcode → 10 張；評分寫入 localStorage 並跳 toast、rated 篩選 → 1 張、清除後回 {} 且按鈕 disabled；推薦流程切換正常；主題切換寫入 localStorage 並可切回。
- 對比實測：頁內腳本走訪 1051 個文字元素，正確合成 alpha 疊層後計算對比，暗版與亮版各 0 項未達 WCAG AA（最低 3.5 / 3.57，皆落在大字 3:1 門檻項目）。
- 排版驗證：最小 font-size 16px、body 23px、兩個 clamp 下限 38px / 32px，1440 / 756 / 375 寬皆無水平捲動。

Stage Summary:
- Dashboard 從「16 張展示卡」變成可查詢的 Skill Registry：相容性、Health、關聯、推薦流程、Plugin 匯出。
- 修掉 3 個實際會導致裝錯東西的來源／路徑錯誤，並揭露 2 個 stub skill 的跨平台陷阱。
- 維護方式：加 skill 仍然只動 SKILLS 一個物件；所有計數、pill、流程圖、統計條、README 表格全部自動推導。
- 尚未做（使用者 P1/P2 清單）：skill dependency graph 視覺化、資料抽到 data/*.json、GitHub API 自動重新檢查、版本追蹤、使用統計。

---
Task ID: 5
Agent: Claude Sonnet 5 (Claude Code)
Task: 資料抽到 data/*.json —— 把 showcase.html 裡佔一半篇幅的 SKILLS / STAGES / AGENTS / RECIPES / NOT_RECOMMENDED / CHECKLIST / ZCODE_LIMITS 抽成獨立 JSON，維護不用再翻一個 2000 行的單檔。

Work Log:
- 用 Node vm 把 public/showcase.html 內的 <script> 實際跑一次（帶 DOM stub 讓 init() 能跑完），
  在 script 最後 append 一行把所有 const 收進 globalThis.__DATA__，藉此拿到跟執行期完全一致的
  物件（而不是手動用正規表達式去切 JS 原始碼），確保抽出來的資料是「真的在跑的那份」，不是照抄。
- JSON.stringify 寫出 9 個檔案到 data/：skills.json（16 筆）、stages.json（8 個階段）、
  agents.json（4 個平台）、recipes.json（4 條推薦流程）、not-recommended.json（5 筆）、
  checklist.json（8 項）、zcode-limits.json、claude-only-keys.json、meta.json（verifiedAt）。
- 原本的 public/showcase.html 搬到 scripts/showcase.template.html，把原本手寫的資料區塊
  （0. ZCode 官方限制 … 到 CHECKLIST 收尾的 "];"）整段換成一個注入標記，CSS / HTML / 互動邏輯
  一行不動。
- 寫 scripts/build-showcase.js（純 Node、無外部套件）：讀 data/*.json，逐檔 JSON.stringify 回
  `const NAME = {...};` 貼回模板標記處，寫出 public/showcase.html。
  build 前會先驗證資料完整性：skill.stage 必須存在於 stages.json、skill.relations 與
  recipe.steps 指到的 id 必須存在於 skills.json —— 錯了直接丟錯中止，不會生出跑不動的頁面
  （故意把某 skill 的 stage 改成不存在的值測過，正確擋下並印出具體是哪個 skill / 哪個欄位錯）。
- package.json 加 build:showcase script，並掛 predev / prebuild hook，讓 `bun run dev` /
  `bun run build` 前自動重新產生 showcase.html，日常不需要記得手動跑。
- 更新 scripts/showcase.template.html 開頭的維護說明註解，講清楚「這是生成檔案，改 data/*.json
  再重新 build」；README 的維護方式與專案結構章節同步改寫，說明每個 data 檔案的用途與 build 指令。

驗證:
- 抽取時用同一個 vm context 執行原始 script 到跑完 init()，確認沒有 runtime error 才收資料，
  避免抽到「寫在原始碼裡但實際上不會被賦值」的東西。
- build 後跑先前那套 DOM stub 斷言（涵蓋 stats 推導、卡片渲染、health 分數範圍、搜尋 / 篩選、
  export ZIP 內容）：116 項全過。
- 用「剝掉資料區塊只留其餘部分」的方式，diff 重新 build 出的 public/showcase.html 與 git HEAD
  版本：兩邊唯一差異是我主動改寫的維護說明註解本身，CSS / HTML / 互動邏輯 JS 逐行相同 —— 證明
  這次重構沒有意外改到任何行為。
- 驗證失敗路徑：手動把某 skill 的 stage 改成不存在的字串，build 立刻報錯並指出是哪個 skill、
  哪個欄位、應該對照哪個檔案；改回來後重新 build 正常通過。
- 瀏覽器實測 build 產物：畫面、統計條、流程圖、相容性、Health 顯示皆與重構前一致。

Stage Summary:
- data/*.json 現在是唯一的資料來源；public/showcase.html 變成 build 產物，仍然是單檔零依賴，
  不需要跑 build 腳本才能打開或部署，只是「維護」這個動作換成改 JSON + 重新 build。
- 加 / 刪一個 skill：改 data/skills.json 一個物件，跑 `bun run build:showcase`（或直接
  `bun run dev` / `bun run build` 自動觸發），不用再滾 2000 行的 HTML 找資料在哪。
- 資料被寫錯（stage 打錯字、relations 指到不存在的 id）會在 build 階段就擋下來，不會等到
  瀏覽器裡才發現卡片壞掉。
- 尚未做：dependency graph 視覺化、GitHub API 自動重新檢查來源是否異動、版本追蹤。

---
Task ID: 6
Agent: Claude Sonnet 5 (Claude Code)
Task: P2 ① Version tracking —— 幫每個 skill 記錄「現在查到的版本」，作為之後 GitHub 自動重檢（比對變動）與 dependency graph 的資料基礎。刻意只做記錄，不做比對，不混進 registry-upgrade 已合併的範圍。

Work Log:
- 從 main 開新分支 registry-version-tracking（前一輪 registry-upgrade 已 merge 到 main，PR #1）。
- 寫 scripts/check-versions.js：對每個有 source + repoPath 的 skill，打 GitHub API
  `GET /repos/{owner}/{repo}/commits?path={repoPath}&per_page=1` 拿「這個 SKILL.md 路徑本身」
  最後一次被改動的 commit —— 特意不用 repo HEAD，避免 repo 裡其他檔案的異動誤標成這個 skill 變了。
  三種狀態：verified（拿到 commit）、unavailable（沒有 source/repoPath，例如 ui-ux-pro-max 自建、
  seo-audit 來源在 skills.sh 非 GitHub）、error（有來源但這次查詢失敗，保留上次記錄的 commit 不清空）。
- 跑腳本，16 筆全部用真實 GitHub API 查過：14 個 verified（含完整 40 字元 SHA 與上游修改日期）、
  2 個 unavailable，0 個 error。結果直接寫回 data/skills.json。
- scripts/build-showcase.js 的 validate() 加兩條新規則：version.status 必須是三個合法值之一、
  status 為 verified 時 commit 必須是合法的 40 字元 hex SHA —— 兩條都故意造壞資料測過，
  build 正確中止並指出是哪個 skill、哪個欄位。
- scripts/showcase.template.html 加 versionHTML()：verified 顯示「✓ commit 上游最後修改 X ·
  今天驗證」；unavailable 完全不顯示（不假裝有版本，跟 Health 未驗證同一套誠實原則）；
  error 顯示黃色警告並註明「顯示的是上次記錄」。CSS 新增 .ver 樣式，字級沿用 --fs-micro。
- buildPluginFiles() 的 registry.json 匯出、README.md 匯出表格都加上 version 欄位/Commit 欄，
  讓之後做「自動重檢」時，這份匯出資料本身就是可比對的基準線。
- data/checklist.json 加一條「每個 skill 的版本皆為實際查詢結果；無公開來源的一律標未追蹤」。
- package.json 加 check:versions script。刻意不掛進 predev/prebuild —— 這支會打外部 API、
  看 rate limit 臉色，不該每次 dev/build 都跑，留給使用者手動觸發或未來排程。

驗證:
- 3 個造壞資料的測試：version.status 改成不存在的值 → build 擋下並指名 skill id 與欄位；
  commit 改成非法字串 → build 擋下並指名同上；兩者都復原後重新 build 正常通過。
- DOM stub 跑舊有 116 項斷言全過（沒有因為新欄位動到既有行為）；另外針對版本功能寫 27 項新斷言
  （每個 skill 都有 version 欄位、14 verified/2 unavailable/0 error、所有 verified 的 commit
  是合法 SHA、卡片有正確顯示 commit、unavailable 的卡片沒有 .ver 區塊、registry.json 與匯出
  README 都帶上版本欄位、checklist 變 9 項）全過。
- 瀏覽器實測 build 產物：grill-with-docs 卡片顯示「✓ 447ca70 上游最後修改 2026-08-15 ·
  2026-09-16 驗證」；ui-ux-pro-max 與 seo-audit 卡片確認沒有 .ver 元素（用 querySelector 直接查證，
  不是肉眼看漏）。

Stage Summary:
- data/skills.json 現在每筆都有 version 欄位，14 筆是真實 GitHub commit、2 筆誠實標未追蹤。
- 這是資料基礎，還沒做「比對」——下一步（P2 ②）才是拿這裡記錄的 commit 跟最新 commit 比對，
  標出 changed / unchanged / unavailable。
- scripts/check-versions.js 可重複執行、可單獨排程，不影響一般 dev/build 流程。
- 只做了 version tracking，沒有動 registry-upgrade 已合併的範圍，也沒有先做 GitHub 自動重檢或
  dependency graph（照使用者指定順序：① version tracking → ② GitHub 重檢 → ③ dependency graph）。

---
Task ID: 7
Agent: Claude Sonnet 5 (Claude Code)
Task: P2 ② GitHub 自動重檢 —— 拿 P2 ① 記錄的基準 commit 跟 GitHub 上最新的 commit 比對，標出 changed / unchanged / unavailable，不偷做 P2 ③ dependency graph。

Work Log:
- 從 main（39d7b23，已含 PR #1 + #2）開新分支 registry-github-recheck。
- 設計上刻意把「設定基準」跟「比對基準」拆成兩支獨立腳本，不共用同一支腳本、不讓其中一支順手做另一件事：
    check-versions.js（既有）—— 寫 version 欄位，代表「目前信任的基準」
    recheck-versions.js（新）—— 只讀 version 當基準，查最新 commit 比對，寫 recheck 欄位，
      絕對不改 version。理由：上游真的動了 SKILL.md 不代表 registry 要立刻跟著換，
      要不要換是人看過 diff 再決定的事，recheck 只負責誠實攤開「有沒有落後」。
- recheck.status 四態：unchanged（比對一致）、changed（不一致，帶最新 commit 與日期）、
  unavailable（基準本身沒有公開來源，直接跳過不打 API）、error（基準不可信或這次查詢失敗，
  保留上次資料不清空）。
- 跑 recheck-versions.js 打真實 GitHub API：14 unchanged、0 changed、2 unavailable、0 error
  —— 合理，因為基準才剛在上一輪設定，上游不可能這麼快就有新 commit。
- 為了證明「changed」判斷邏輯真的會動，手動把 grill-with-docs 的基準 commit 改成假的 40 字元
  SHA，重跑 recheck，正確判定為 changed 並印出「0000000 → 447ca70」；驗證完立刻用備份還原，
  重跑一次確認恢復成 14 unchanged / 0 changed 的乾淨狀態。
- build-showcase.js 的 validate() 加四條新規則：recheck.status 合法值、status 為
  unchanged/changed 時 latestCommit 必須是合法 40 字元 SHA、unchanged 但
  latestCommit≠baselineCommit 視為資料矛盾、changed 但 latestCommit=baselineCommit 同樣視為
  矛盾——四條規則各自造壞資料測過，全部被擋下且錯誤訊息點名哪個 skill、哪個欄位。
- showcase.template.html 加 recheckHTML()：unchanged 顯示低調的「⟳ 重檢於 X：與基準一致」、
  changed 顯示黃色警告帶新 commit、error 顯示黃色警告說明查詢失敗、unavailable 完全不顯示
  （跟 version / Health 的「不假裝有資料」同一套原則）；沒有 recheck 欄位（還沒跑過）一樣什麼都
  不顯示。registry.json 匯出、plugin README 匯出表格都加上 recheck 欄位/Recheck 欄。
- data/checklist.json 加一條「重檢只比對不覆寫基準；矛盾資料會被 build 擋下」。
- package.json 加 recheck:versions script，同樣不掛 predev/prebuild（打外部 API，不該每次
  dev/build 自動觸發）。
- README 新增「GitHub 自動重檢」小節：說明 check:versions 與 recheck:versions 的分工表格、
  四種 recheck.status、build 端矛盾偵測的具體規則。

驗證:
- 4 個造壞資料的獨立測試：recheck.status 打錯字、unchanged 但 commit 不同、changed 但 commit
  相同、unchanged 但 latestCommit 格式不合法——build 皆正確中止並指名 skill id、欄位、原因；
  全部復原後重新 build 正常通過。
- DOM stub 斷言：既有 116 項（P0/P1）+ 之前 P2 ① 的版本相關斷言，加上這次新增的 recheck 專屬
  斷言（16 筆都有 recheck 欄位、14 unchanged/2 unavailable/0 changed/0 error、unchanged 的
  latestCommit 確實等於 baselineCommit 與 version.commit、卡片正確渲染「與基準一致」、
  ui-ux-pro-max 卡片完全沒有「重檢」字樣、registry.json 與匯出 README 都帶 recheck 資料）
  —— 總計 138 項全過。
- 瀏覽器實測 build 產物：grill-with-docs 卡片同時看到 version 行與 recheck 行（用 querySelectorAll
  直接取兩個 .ver 元素文字內容核對）；ui-ux-pro-max、seo-audit 兩張卡確認完全沒有 .ver 元素。

Stage Summary:
- data/skills.json 現在每筆都有獨立的 version（基準）與 recheck（比對結果）兩個欄位，職責分離、
  互不覆寫。
- 「基準要不要更新」仍是人工決定——recheck 只負責誠實揭露落差，不自動同步，避免 registry
  在沒人看過變動內容的情況下悄悄漂移。
- 只做了 P2 ②，沒有動 P2 ③ dependency graph，也沒有回頭改 P2 ① 的 check-versions.js 邏輯。
