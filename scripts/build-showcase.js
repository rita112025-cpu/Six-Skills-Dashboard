#!/usr/bin/env node
"use strict";

/**
 * 組出 public/showcase.html。
 *
 * 來源：
 *   scripts/showcase.template.html   — 版面 / CSS / 互動邏輯（含一個資料注入標記）
 *   data/*.json                      — Skill registry 本體
 *
 * 用法：
 *   node scripts/build-showcase.js
 *
 * data/*.json 全部是普通 JSON（不含函式、不含 CSS-in-JS 以外的東西），
 * 所以這裡單純 JSON.stringify 回 JS const，不需要任何 bundler。
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const TEMPLATE = path.join(__dirname, "showcase.template.html");
const OUT = path.join(ROOT, "public", "showcase.html");

const MARKER = "/* __SKILL_REGISTRY_DATA__ 由 scripts/build-showcase.js 從 data/*.json 注入，不要手動編輯這個檔案的資料區塊，改 data/*.json 後執行 `node scripts/build-showcase.js` */";

/* 檔名 → const 名稱；順序就是產出的順序 */
const FILES = [
  { file: "zcode-limits.json", const: "ZCODE_LIMITS", comment: "ZCode 官方限制（zcode.z.ai/en/docs/skill）" },
  { file: "claude-only-keys.json", const: "CLAUDE_ONLY_KEYS", comment: "Claude Code 專屬的 frontmatter 欄位，其他 agent 不一定認得" },
  { file: "agents.json", const: "AGENTS", comment: "Agent 平台" },
  { file: "stages.json", const: "STAGES", comment: "工程階段（kind:\"pipeline\" 進流程圖，kind:\"tool\" 進工具區）" },
  { file: "skills.json", const: "SKILLS", comment: "Skill registry —— 加 skill 只要加一個物件" },
  { file: "recipes.json", const: "RECIPES", comment: "推薦使用順序" },
  { file: "not-recommended.json", const: "NOT_RECOMMENDED", comment: "不建議安裝" },
  { file: "checklist.json", const: "CHECKLIST", comment: "自我驗證清單" }
];

function readJSON(name) {
  const p = path.join(DATA_DIR, name);
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    throw new Error(`讀取 data/${name} 失敗：${e.message}`);
  }
}

function validate(data) {
  const errors = [];
  const stageKeys = new Set(Object.keys(data.STAGES));
  const skillIds = new Set(data.SKILLS.map(s => s.id));

  if (skillIds.size !== data.SKILLS.length) errors.push("data/skills.json 有重複的 id");

  const VERSION_STATUSES = new Set(["verified", "unavailable", "error"]);
  data.SKILLS.forEach(s => {
    if (!stageKeys.has(s.stage)) errors.push(`skill "${s.id}" 的 stage "${s.stage}" 不存在於 data/stages.json`);
    Object.values(s.relations || {}).flat().forEach(rid => {
      if (!skillIds.has(rid)) errors.push(`skill "${s.id}" 的 relations 指向不存在的 id "${rid}"`);
    });
    if (s.version && !VERSION_STATUSES.has(s.version.status)) {
      errors.push(`skill "${s.id}" 的 version.status "${s.version.status}" 不是合法值（verified / unavailable / error）`);
    }
    if (s.version && s.version.status === "verified" && !/^[0-9a-f]{40}$/.test(s.version.commit || "")) {
      errors.push(`skill "${s.id}" 標成 verified 但 version.commit 不是合法的 40 字元 SHA`);
    }
  });
  data.RECIPES.forEach(r => {
    r.steps.forEach(id => {
      if (!skillIds.has(id)) errors.push(`recipe "${r.id}" 的 steps 指向不存在的 skill id "${id}"`);
    });
  });

  if (errors.length) {
    throw new Error("data/*.json 驗證失敗：\n  - " + errors.join("\n  - "));
  }
}

function build() {
  const data = {};
  FILES.forEach(f => { data[f.const] = readJSON(f.file); });
  const meta = readJSON("meta.json");
  data.VERIFIED_AT = meta.verifiedAt;

  validate(data);

  const parts = FILES.map(f =>
    `/* ---------- ${f.comment} ---------- */\nconst ${f.const} = ${JSON.stringify(data[f.const], null, 2)};`
  );
  // VERIFIED_AT 放在 ZCODE_LIMITS / CLAUDE_ONLY_KEYS 後面，跟原本手寫版一致
  parts.splice(2, 0, `const VERIFIED_AT = ${JSON.stringify(data.VERIFIED_AT)};`);

  const injected = parts.join("\n\n");

  const template = fs.readFileSync(TEMPLATE, "utf8");
  if (!template.includes(MARKER)) {
    throw new Error("找不到資料注入標記，scripts/showcase.template.html 可能被改壞了");
  }
  const html = template.replace(MARKER, injected);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html);

  const stats = {
    skills: data.SKILLS.length,
    core: data.SKILLS.filter(s => s.tier === "core").length,
    stack: data.SKILLS.filter(s => s.tier === "stack").length,
    stages: Object.keys(data.STAGES).filter(k => data.STAGES[k].kind === "pipeline").length,
    tools: data.SKILLS.filter(s => data.STAGES[s.stage] && data.STAGES[s.stage].kind === "tool").length,
    agents: data.AGENTS.length,
    recipes: data.RECIPES.length
  };
  console.log(
    `✓ public/showcase.html 已產生（${stats.skills} skills = ${stats.core} core + ${stats.stack} optional · ` +
    `${stats.stages} stages + ${stats.tools} tools · ${stats.agents} agents · ${stats.recipes} recipes）`
  );
}

build();
