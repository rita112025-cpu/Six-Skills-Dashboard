#!/usr/bin/env node
"use strict";

/**
 * 拿 data/skills.json 裡記錄的 version（基準 commit）跟 GitHub 上最新的
 * commit 比對，寫出 recheck 結果：changed / unchanged / unavailable / error。
 *
 * 跟 scripts/check-versions.js 的差別：
 *   check-versions.js  —— 設定 / 更新「基準版本」（version 欄位）
 *   recheck-versions.js —— 只「比對」，不改動 version 欄位
 *
 * 故意不讓 recheck 順手覆寫基準版本：上游真的改了 SKILL.md，不代表這個
 * registry 要立刻跟著換，中間應該有人看過 diff 再決定要不要
 * `bun run check:versions` 重新釘一個新基準。recheck 只負責把「有沒有
 * 落後」這件事誠實攤開來，不做決定。
 *
 * recheck 欄位：
 *   { checkedAt, status, baselineCommit, latestCommit, latestCommitDate }
 *   status:
 *     unchanged   — 基準是 verified，且最新 commit == 基準 commit
 *     changed     — 基準是 verified，且最新 commit != 基準 commit
 *     unavailable — 基準本身就是 unavailable（沒有公開來源可查），不打 API
 *     error       — 基準是 error（沒有可信的基準 commit 可比對），或這次
 *                   查詢本身失敗
 *
 * 用法：
 *   node scripts/recheck-versions.js
 *   GITHUB_TOKEN=ghp_xxx node scripts/recheck-versions.js   # 提高 rate limit（非必要）
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
  const headers = { "User-Agent": "six-skills-dashboard-version-recheck", "Accept": "application/vnd.github+json" };
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
  let unchanged = 0, changed = 0, unavailable = 0, errors = 0;
  const changedList = [];

  for (const s of skills) {
    const baseline = s.version;

    if (!baseline || baseline.status === "unavailable") {
      s.recheck = { checkedAt: TODAY, status: "unavailable", baselineCommit: null, latestCommit: null, latestCommitDate: null };
      unavailable++;
      console.log(`  ⚪ ${s.id} — 未追蹤（沒有基準可比對）`);
      continue;
    }

    if (baseline.status === "error" || !baseline.commit) {
      // 基準本身就不可信（上次設定基準時查詢失敗），沒有東西可以拿來比對。
      // 這裡不順便重新設定基準 —— 那是 check-versions.js 的責任。
      s.recheck = { checkedAt: TODAY, status: "error", baselineCommit: baseline.commit || null, latestCommit: null, latestCommitDate: null };
      errors++;
      console.log(`  ✗ ${s.id} — 沒有可信的基準版本，先跑 check:versions 設定基準`);
      continue;
    }

    const gh = parseGitHub(s.source);
    if (!gh || !s.repoPath) {
      // 理論上不會發生（有 verified 基準代表當初一定有 source+repoPath），
      // 但資料可能被手動改壞，仍然誠實回報而不是假裝一致。
      s.recheck = { checkedAt: TODAY, status: "error", baselineCommit: baseline.commit, latestCommit: null, latestCommitDate: null };
      errors++;
      console.log(`  ✗ ${s.id} — 有基準 commit 但目前沒有可用的 source/repoPath`);
      continue;
    }

    try {
      const latest = await fetchLatestCommit(gh.owner, gh.repo, s.repoPath);
      const isChanged = latest.sha !== baseline.commit;
      s.recheck = {
        checkedAt: TODAY,
        status: isChanged ? "changed" : "unchanged",
        baselineCommit: baseline.commit,
        latestCommit: latest.sha,
        latestCommitDate: latest.date || null
      };
      if (isChanged) {
        changed++;
        changedList.push(s.id);
        console.log(`  ⚠ ${s.id} — 變了：${baseline.commit.slice(0,7)} → ${latest.sha.slice(0,7)}（${latest.date ? latest.date.slice(0,10) : "?"}）`);
      } else {
        unchanged++;
        console.log(`  ✓ ${s.id} — 與基準一致（${baseline.commit.slice(0,7)}）`);
      }
    } catch (e) {
      s.recheck = { checkedAt: TODAY, status: "error", baselineCommit: baseline.commit, latestCommit: null, latestCommitDate: null };
      errors++;
      console.log(`  ✗ ${s.id} — ${e.message}`);
    }
  }

  fs.writeFileSync(SKILLS_PATH, JSON.stringify(skills, null, 2) + "\n");

  console.log(`\n${unchanged} unchanged · ${changed} changed · ${unavailable} unavailable · ${errors} error（已寫回 data/skills.json 的 recheck 欄位，version 基準未變動）`);
  if (changedList.length) {
    console.log(`\n上游有異動、基準還沒更新的 skill：${changedList.join(", ")}`);
    console.log(`看過變動內容後，覺得該跟進就跑：bun run check:versions`);
  }
  if (errors > 0) process.exitCode = 1;
}

main().catch(e => { console.error(e); process.exit(1); });
