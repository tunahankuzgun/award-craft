#!/usr/bin/env node
/*
 * screenshot.mjs: capture a page at fixed scroll stops for the critique loop.
 *
 * Usage (run from the project root, where Playwright is installed):
 *   npm i -D playwright
 *   npx playwright install chromium        # add firefox webkit to check other engines
 *   node <skill-dir>/scripts/screenshot.mjs <url> [outDir=./screenshots] [--wait=4500] [--browser=chromium|firefox|webkit]
 *
 * Playwright is resolved from the current working directory, so the script can
 * live in the skill folder. Alternatively, copy it into the project.
 *
 * Output: <variant>-<pct>.png for scroll stops 0, 25, 50, 75, 100 percent,
 * <variant>-full.png, and report.json (browser, variants, skipped, warnings).
 * Variants: desktop, mobile, desktop-reduced, mobile-reduced, and (Chromium only)
 * desktop-nowebgl, which launches with WebGL disabled.
 *
 * Caveat: full-page shots can mislead on pinned or smooth-scroll sites. Pinned
 * sections may repeat or stack, and scroll-triggered reveals may not have run.
 * Trust the viewport shots for judging layout.
 *
 * --wait: milliseconds after load, for loaders and intros. The default is 4500.
 * The loader recipe can run up to maxMs (3000) plus onExit (up to 1200 ms):
 * 4200 ms in the worst case, so 4500 leaves a margin.
 * Firefox does not support isMobile or hasTouch; those options are dropped there.
 *
 * Adapt: edit VARIANTS and SCROLL_STOPS.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const INSTALL_HELP = [
  "Playwright is not installed or cannot be imported from the current directory.",
  "Run from the project root (where package.json is), then:",
  "  npm i -D playwright",
  "  npx playwright install chromium        # add firefox webkit to check other engines",
].join("\n");

async function loadPlaywright() {
  // 1. Preferred: resolve from the current directory (the project), anchored there.
  try {
    const require = createRequire(join(process.cwd(), "package.json"));
    return require("playwright");
  } catch {
    /* not found from the cwd */
  }
  // 2. Last resort: a plain ESM import resolves from THIS script's folder (the
  //    skill), not the cwd. It only works if the script was copied into the project.
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

const playwright = await loadPlaywright();
if (!playwright) {
  console.error(INSTALL_HELP);
  process.exit(1);
}

const ENGINES = ["chromium", "firefox", "webkit"];
const SCROLL_STOPS = [0, 25, 50, 75, 100];
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const NOWEBGL_ARGS = ["--disable-webgl", "--disable-3d-apis"];

const VARIANTS = [
  { name: "desktop", viewport: DESKTOP, context: {} },
  {
    name: "mobile",
    viewport: MOBILE,
    context: { isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  },
  { name: "desktop-reduced", viewport: DESKTOP, context: { reducedMotion: "reduce" } },
  {
    name: "mobile-reduced",
    viewport: MOBILE,
    context: { isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: "reduce" },
  },
  // Launch-time flags: runs in its own browser instance, Chromium only.
  { name: "desktop-nowebgl", viewport: DESKTOP, context: {}, webglOff: true },
];

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const positional = args.filter((a) => !a.startsWith("--"));
const url = positional[0];
if (!url) {
  console.error(
    "Usage: node <skill-dir>/scripts/screenshot.mjs <url> [outDir=./screenshots] [--wait=4500] [--browser=chromium|firefox|webkit]",
  );
  process.exit(1);
}
const outDir = resolve(positional[1] ?? "./screenshots");

const waitFlag = flags.find((f) => f.startsWith("--wait="));
const waitMs = waitFlag ? Number(waitFlag.split("=")[1]) : 4500;
if (!Number.isFinite(waitMs) || waitMs < 0) {
  console.error("--wait must be a non-negative number of milliseconds");
  process.exit(1);
}

const browserFlag = flags.find((f) => f.startsWith("--browser="));
const browserName = browserFlag ? browserFlag.split("=")[1] : "chromium";
if (!ENGINES.includes(browserName)) {
  console.error(`--browser must be one of: ${ENGINES.join(", ")}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function captureVariant(browser, variant, warnings) {
  const result = { files: [], consoleErrors: [], consoleWarnings: [], pageErrors: [], webgl2Available: null };
  const contextOptions = { viewport: variant.viewport, ...variant.context };
  if (browserName === "firefox") {
    delete contextOptions.isMobile;
    delete contextOptions.hasTouch;
  }
  let context = null;
  try {
    context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") result.consoleErrors.push(msg.text());
      else if (msg.type() === "warning") result.consoleWarnings.push(msg.text());
    });
    page.on("pageerror", (err) => result.pageErrors.push(err.message));

    await page.goto(url, { waitUntil: "load" });
    await sleep(waitMs); // loaders, fonts, and intro animations

    result.webgl2Available = await page.evaluate(
      () => !!document.createElement("canvas").getContext("webgl2"),
    );
    if (variant.webglOff && result.webgl2Available === true) {
      const msg = `${variant.name}: WebGL2 is still available with --disable-webgl; the WebGL-off check did not take effect.`;
      warnings.push(msg);
      console.warn(`WARNING: ${msg}`);
    }

    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    for (const pct of SCROLL_STOPS) {
      const y = Math.round((maxScroll * pct) / 100);
      // Plain scrollTo: honors the site's scroll-behavior, so smooth scroll is captured as-is.
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await sleep(600); // let smooth scroll and reveals settle
      const file = `${variant.name}-${String(pct).padStart(2, "0")}.png`;
      await page.screenshot({ path: join(outDir, file) });
      result.files.push(file);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(300);
    const full = `${variant.name}-full.png`;
    await page.screenshot({ path: join(outDir, full), fullPage: true });
    result.files.push(full);
  } catch (err) {
    result.error = String(err?.message ?? err);
  } finally {
    await context?.close().catch(() => {});
  }
  return result;
}

await mkdir(outDir, { recursive: true });
const report = {
  url,
  timestamp: new Date().toISOString(),
  browser: browserName,
  waitMs,
  variants: {},
  skipped: [],
  warnings: [],
};

// Launch one browser, run its variants, and close it before anything else starts.
async function runVariants(launchOptions, variants) {
  let browser;
  try {
    browser = await playwright[browserName].launch({ headless: true, ...launchOptions });
  } catch (err) {
    for (const v of variants) {
      report.variants[v.name] = {
        files: [],
        consoleErrors: [],
        consoleWarnings: [],
        pageErrors: [],
        webgl2Available: null,
        error: `browser launch failed: ${err.message}`,
      };
    }
    return;
  }
  try {
    for (const v of variants) {
      report.variants[v.name] = await captureVariant(browser, v, report.warnings);
    }
  } finally {
    // A failed close must not stop the run or prevent report.json from being written.
    try {
      await browser.close();
    } catch (err) {
      console.warn(`browser close failed: ${err.message}`);
    }
  }
}

const standard = VARIANTS.filter((v) => !v.webglOff);
const webglOff = VARIANTS.filter((v) => v.webglOff);

await runVariants({}, standard);
if (browserName === "chromium") {
  await runVariants({ args: NOWEBGL_ARGS }, webglOff);
} else {
  for (const v of webglOff) {
    report.skipped.push({ name: v.name, reason: "WebGL-off launch flags are Chromium-only" });
    console.log(`NOTE: skipped ${v.name}: WebGL-off launch flags are Chromium-only.`);
  }
}

await writeFile(join(outDir, "report.json"), JSON.stringify(report, null, 2));

console.log(`URL: ${url}`);
console.log(`Browser: ${browserName}  Output: ${outDir}`);
for (const [name, v] of Object.entries(report.variants)) {
  const status = v.error ? `ERROR: ${v.error}` : "ok";
  console.log(
    `${name.padEnd(17)} files=${v.files.length} consoleErrors=${v.consoleErrors.length} ` +
      `consoleWarnings=${v.consoleWarnings.length} ` +
      `pageErrors=${v.pageErrors.length} webgl2=${v.webgl2Available} ${status}`,
  );
}
for (const w of report.warnings) console.log(`WARNING: ${w}`);
console.log("Wrote report.json");

if (Object.values(report.variants).some((v) => v.error)) process.exitCode = 1;
