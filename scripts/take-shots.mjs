/**
 * Screenshot generator for docs/cms-guidebook.md.
 *
 * Run with `npm run docs:screenshots` to refresh docs/images/public/*.png
 * against the live production site. When a page changes visually, re-run
 * this script and commit the new PNGs alongside the markdown.
 *
 * Headless puppeteer ships as a devDependency. It is NOT used in the
 * runtime bundle — only here, locally / in CI.
 *
 * To add a new page to the doc:
 *   1. Drop a row into the PAGES list below.
 *   2. Run the script.
 *   3. Reference the new PNG from docs/cms-guidebook.md.
 */
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const BASE =
  process.env.BASE_URL ??
  "https://jatayu-prod-app.proudisland-53765d98.centralindia.azurecontainerapps.io";

// Resolve docs/images/public relative to the repo root so this script works
// regardless of the cwd from which it's invoked.
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "docs", "images", "public");

const PAGES = [
  ["home", "/"],
  ["product", "/product"],
  ["for-doctors", "/for-doctors"],
  ["for-hospitals", "/for-hospitals-and-hmis"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["pricing", "/pricing"],
  ["security", "/security"],
  ["case-studies", "/case-studies"],
  ["specialties", "/specialties"],
  ["blog", "/blog"],
  ["press", "/press"],
  ["careers", "/careers"],
  ["trial", "/trial"],
  ["privacy", "/privacy"],
  ["terms", "/terms"],
  ["cancellation", "/cancellation"],
  ["admin-login", "/admin"],
];

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();

for (const [name, path] of PAGES) {
  process.stdout.write(`→ ${name} … `);
  try {
    // /admin is a heavy React app — domcontentloaded is the only event it
    // reliably fires, since it keeps long-poll requests alive.
    const waitUntil = path === "/admin" ? "domcontentloaded" : "networkidle2";
    await page.goto(BASE + path, { waitUntil, timeout: 45000 });
    // Generous settle time so animated content (hero waveform, transitions,
    // Payload's React hydration) finishes painting before the snapshot.
    await new Promise((r) => setTimeout(r, path === "/admin" ? 4000 : 1500));
    await page.screenshot({
      path: `${OUT}/${name}.png`,
      fullPage: path !== "/admin",
    });
    console.log("ok");
  } catch (e) {
    console.log(`FAIL: ${e.message.split("\n")[0]}`);
  }
}

// ---------------------------------------------------------------------------
// Detail shots referenced explicitly by the guidebook
// ---------------------------------------------------------------------------

async function detailShot(name, path, prepare) {
  process.stdout.write(`→ detail:${name} … `);
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));
    if (prepare) await prepare();
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
    console.log("ok");
  } catch (e) {
    console.log(`FAIL: ${e.message.split("\n")[0]}`);
  }
}

await detailShot("home-hero", "/");
await detailShot("footer", "/", async () => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 600));
});
await detailShot("about-team", "/about", async () => {
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise((r) => setTimeout(r, 400));
});

await browser.close();
console.log("done");
