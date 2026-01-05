#!/usr/bin/env node
// =====================================================================
//  cwebp batch converter v3.2
//  Dependencies: cwebp-bin, fast-glob, p-limit
//
//  Options:
//  --src <path>           (required) 來源資料夾 / 檔案 / glob pattern
//  --out <folder>                     輸出資料夾（預設輸回原位置）
//  --q <0-100>                        有損品質，預設 80（若 --lossless 則忽略）
//  --lossless                          無損壓縮（適合 PNG / UI）
//  --maxWidth <px> / --maxHeight <px> 限制尺寸（0 表示不限制）
//  --exts "jpg,png"                   搜尋副檔名，預設 jpg,jpeg,png
//  --metadata all|exif|icc|xmp|none   中繼資料保留，預設 none
//  --overwrite                         覆蓋已存在的 .webp
//  --concurrency <n>                  併發數，預設 min(4, CPU cores)
//  --dry                               模擬執行（不產生檔案）
//  --verbose                           顯示詳細命令
//  --webp-only                         轉檔後刪除原始 JPG/PNG（需 --confirm）
//  --confirm                           確認執行刪檔，搭配 --webp-only 使用
//
//  Behavior:
//  1) 自動將 --src 的 '\' 轉成 '/'（Windows 相容）。
//  2) 若 --src 含萬用字元（*）→ 完全尊重你的 glob。
//  3) 若 --src 是「存在的資料夾」且不含 * → 只搜尋該層 *.jpg|jpeg|png（不遞迴）。
//  4) 若 --src 指向單一檔案 → 僅轉該檔。
// =====================================================================

// 範例
// 1. 單檔案 :        npm run webp -- --src ./template/okbet/assets/images/ai/rpg.png
// 2. 整個資料夾 :    npm run webp -- --src ./template/okbet/assets/images/ai
// 3. 遞迴子資料夾 :  npm run webp -- --src "./template/okbet/assets/images/ai/**/*.{jpg,jpeg,png}"

"use strict";

const { spawn } = require("node:child_process");
const { promises: fs } = require("node:fs");
const path = require("node:path");
const fg = require("fast-glob");
const os = require("node:os");

// p-limit：兼容 CJS 與 ESM（v5 起為 ESM-only）
const _pLimit = require("p-limit");
const pLimit = typeof _pLimit === "function" ? _pLimit : _pLimit.default;

// cwebp-bin：不同環境可能回傳字串(default)或放在 .default / .path
const _cwebp = require("cwebp-bin");
const cwebpPath =
  (typeof _cwebp === "string" && _cwebp) ||
  (typeof _cwebp?.default === "string" && _cwebp.default) ||
  (typeof _cwebp?.path === "string" && _cwebp.path);

if (!cwebpPath) {
  console.error("❌ Cannot resolve cwebp binary path from 'cwebp-bin'.");
  console.error("   Try reinstalling: npm i cwebp-bin@latest");
  process.exit(1);
}

// ---- tiny arg parser ----
const args = process.argv.slice(2);
const getFlag = (name, def = undefined) => {
  const i = args.findIndex(a => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i === -1) return def;
  const eq = args[i].split("=");
  if (eq.length > 1) return eq[1];
  return args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
};
const hasFlag = name => args.includes(`--${name}`) || args.some(a => a.startsWith(`--${name}=`));

const usage = `Usage:
  node tool/webp/index.js --src <folder-or-file-or-glob> [options]
  Examples:
    node tool/webp/index.js --src ./images
    node tool/webp/index.js --src "./images/**/*.{jpg,png}" --q 85 --out ./dist
    node tool/webp/index.js --src ./assets --lossless --metadata all
    node tool/webp/index.js --src ./photos --webp-only --confirm
`;

if (hasFlag("help") || args.length === 0) {
  console.log(usage);
  process.exit(0);
}

// ---- read options ----
let src = getFlag("src");
if (!src) {
  console.error("❌ Error: --src is required\n");
  console.log(usage);
  process.exit(1);
}

// normalize slashes (Windows)
src = String(src).replace(/\\/g, "/");

const outDir = getFlag("out");
const q = parseInt(getFlag("q", "80"), 10);
const lossless = hasFlag("lossless");
const maxWidth = getFlag("maxWidth") ? parseInt(getFlag("maxWidth"), 10) : undefined;
const maxHeight = getFlag("maxHeight") ? parseInt(getFlag("maxHeight"), 10) : undefined;
const exts = (getFlag("exts", "jpg,jpeg,png")).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
const overwrite = hasFlag("overwrite");
const defaultConc = Math.max(1, Math.min(4, (os.cpus() || []).length || 4));
const concurrency = Math.max(1, parseInt(getFlag("concurrency", String(defaultConc)), 10));
const metadata = getFlag("metadata", "none");
const dry = hasFlag("dry");
const verbose = hasFlag("verbose");
const webpOnly = hasFlag("webp-only");
const confirm = hasFlag("confirm");

const cwd = process.cwd();

(async () => {
  // decide patterns
  let patterns = [];
  if (src.includes("*")) {
    // explicit glob: respect as-is
    patterns = [src];
  } else {
    // Check filesystem
    const absSrc = path.resolve(cwd, src);
    let stat = null;
    try {
      stat = await fs.stat(absSrc);
    } catch (_) {
      stat = null;
    }

    if (stat?.isDirectory()) {
      // Folder without wildcard → only current level
      patterns = [path.posix.join(src, `*.{${exts.join(",")}}`)];
    } else if (stat?.isFile()) {
      // Single file
      patterns = [src];
    } else {
      // Not found: fall back to "current-level" pattern at provided path
      patterns = [path.posix.join(src, `*.{${exts.join(",")}}`)];
    }
  }

  const files = await fg(patterns, {
    cwd,
    onlyFiles: true,
    unique: true,
    caseSensitiveMatch: false,
  });

  if (files.length === 0) {
    console.log("⚠️ No files matched:", patterns.join(", "));
    return;
  }

  console.log(`🔍 Found ${files.length} file(s). Start converting...`);
  if (dry) console.log("🧪 [DRY RUN] No files will be written.");

  const limit = pLimit(concurrency);
  let converted = 0, skipped = 0, failed = 0, deleted = 0;

  const tasks = files.map(file =>
    limit(async () => {
      const absIn = path.resolve(cwd, file);
      const parsed = path.parse(file);
      const relOut = path.join(outDir || parsed.dir, `${parsed.name}.webp`);
      const absOut = path.resolve(cwd, relOut);

      await fs.mkdir(path.dirname(absOut), { recursive: true });

      if (!overwrite) {
        try {
          const st = await fs.stat(absOut);
          if (st.isFile()) {
            skipped++;
            if (verbose) console.log(`⏭️ Skip exists: ${relOut}`);
            return;
          }
        } catch (_) {}
      }

      const webpArgs = [];
      if (lossless) {
        webpArgs.push("-lossless");
      } else {
        webpArgs.push("-q", String(isNaN(q) ? 80 : q));
      }

      if (maxWidth || maxHeight) {
        webpArgs.push("-resize", String(maxWidth || 0), String(maxHeight || 0));
      }

      if (["all", "exif", "icc", "xmp", "none"].includes(metadata)) {
        webpArgs.push("-metadata", metadata);
      } else {
        webpArgs.push("-metadata", "none");
      }

      // Compression effort 0~6
      webpArgs.push("-m", "6");

      // input & output
      webpArgs.push(absIn, "-o", absOut);

      if (verbose) {
        console.log(`▶️ cwebp ${webpArgs.map(a => (/\s/.test(a) ? `"${a}"` : a)).join(" ")}`);
      }

      if (dry) {
        converted++;
        return;
      }

      await new Promise((resolve, reject) => {
        const ps = spawn(cwebpPath, webpArgs, { stdio: verbose ? "inherit" : "ignore" });
        ps.on("error", reject);
        ps.on("close", code => (code === 0 ? resolve() : reject(new Error(`cwebp exited with code ${code}`))));
      });

      converted++;

      // webp-only: delete original (require --confirm)
      if (webpOnly && confirm) {
        try {
          await fs.unlink(absIn);
          deleted++;
          if (verbose) console.log(`🗑️ Deleted original: ${file}`);
        } catch (err) {
          console.error(`❌ Failed to delete ${file}:`, err.message);
        }
      }
    }).catch(err => {
      failed++;
      console.error("❌ Failed:", file, "\n", err.message);
    })
  );

  await Promise.all(tasks);

  console.log("-------------------------------------------------");
  console.log(`✅ Done. Converted: ${converted}, Skipped: ${skipped}, Failed: ${failed}`);
  if (webpOnly) {
    if (!confirm) console.log("⚠️ [webp-only] specified but skipped (missing --confirm)");
    else console.log(`🗑️ Deleted originals: ${deleted}`);
  }
  console.log("-------------------------------------------------");
})().catch(err => {
  console.error(err);
  process.exit(1);
});
