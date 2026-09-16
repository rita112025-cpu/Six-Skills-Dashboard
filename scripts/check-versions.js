#!/usr/bin/env node
"use strict";

/**
 * 幫 data/skills.json 每一筆補上 / 更新 version 欄位：
 *   { commit, commitDate, checkedAt, status }
 *
 * commit      — 該 skill 的 repoPath 最後一次被修改時的完整 commit SHA
 *               （不是整個 repo 的 HEAD —— repo 裡其他檔案異動不該讓這個 skill
 *                 被標成「變了」，只有真的動到這個 SKILL.md 的 commit 才算）
 * commitDate  — 那次 commit 的時間
 * checkedAt   — 這次跑腳本的日期（今天）
 * status      — "verified"（GitHub API 有回應且拿到 commit）
 *              | "unavailable"（沒有 source / repoPath，例如自建或非 GitHub 來源）
 *              | "error"（有 source / repoPath，但 API 呼叫失敗 —— 網路問題、
 *                repo 改名、rate limit…，不能就地假裝 unavailable）
 *
 * 這支腳本只負責「記錄現在的版本」，是後續「GitHub 自動重檢」
 * （拿記錄的 commit 跟最新 commit 比對 → changed / unchanged）的資料基礎，
 * 這次不做比對，只做記錄。
 *
 * 用法：
 *   node scripts/check-versions.js
 *   GITHUB_TOKEN=ghp_xxx node scripts/check-versions.js   # 提高 rate limit（非必要）
 */

const fs = require("fs");
const path = require("path");

const SKILLS_PATH = path.join(__dirname, "..", "data", "skills.json");
const TODAY = new Date().toISOString().slice(0, 10);

function parseGitHub(sourceURL) {
  if (!sourceURL) return null;
  const m = sourceURL.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/);
  return m ? { owner: m[1], repo: m[2] } : null;
}

async function fetchLatestCommit(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
  const headers = { "User-Agent": "six-skills-dashboard-version-check", "Accept": "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status} for ${owner}/${repo} path=${filePath} — ${body.slice(0, 200)}`);
  }
  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`GitHub API 回傳空陣列，路徑可能不存在：${owner}/${repo}/${filePath}`);
  }
  return { sha: arr[0].sha, date: arr[0].commit && arr[0].commit.author && arr[0].commit.author.date };
}

async function main() {
  const skills = JSON.parse(fs.readFileSync(SKILLS_PATH, "utf8"));
  let verified = 0, unavailable = 0, errors = 0;

  for (const s of skills) {
    const gh = parseGitHub(s.source);
    if (!gh || !s.repoPath) {
      s.version = { commit: null, commitDate: null, checkedAt: TODAY, status: "unavailable" };
      unavailable++;
      console.log(`  ⚪ ${s.id} — 未追蹤（${!s.source ? "無公開來源" : "無已核對的 repoPath"}）`);
      continue;
    }
    try {
      const { sha, date } = await fetchLatestCommit(gh.owner, gh.repo, s.repoPath);
      s.version = { commit: sha, commitDate: date || null, checkedAt: TODAY, status: "verified" };
      verified++;
      console.log(`  ✓ ${s.id} — ${sha.slice(0, 7)} (${date ? date.slice(0, 10) : "?"})`);
    } catch (e) {
      s.version = {
        commit: (s.version && s.version.commit) || null,
        commitDate: (s.version && s.version.commitDate) || null,
        checkedAt: TODAY,
        status: "error"
      };
      errors++;
      console.log(`  ✗ ${s.id} — ${e.message}`);
    }
  }

  fs.writeFileSync(SKILLS_PATH, JSON.stringify(skills, null, 2) + "\n");
  console.log(`\n${verified} verified · ${unavailable} unavailable · ${errors} error（已寫回 data/skills.json）`);
  if (errors > 0) process.exitCode = 1;
}

main().catch(e => { console.error(e); process.exit(1); });
