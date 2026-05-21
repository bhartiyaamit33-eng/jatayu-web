/**
 * One-off: crop branded regions out of the founder deck PDF (rendered to PNG)
 * and write them to public/brand/* for the home page logo wall, supporter
 * strip, awards section, hospital partner panel, and case-study spotlight.
 *
 * All source slides are 4000x2250 (200 DPI of a 16:9 deck). Coordinates below
 * were eyeballed off the rendered PNG previews.
 *
 * Run:  cd jatayu-web && node scripts/extract-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SLIDES = "/Users/amitbhartiya/Desktop/Jatayu Frontend/extracted/slides";
const OUT = "/Users/amitbhartiya/Desktop/Jatayu Frontend/jatayu-web/public/brand";

// Each entry: source slide PNG → crop rect → output relative path.
// Rect = { left, top, width, height } in pixels of the 4000x2250 slide.
const JOBS = [
  // --- Supporter strip (slide 01: bottom-right logo band) ---
  // Combined single strip is more faithful to the deck and avoids fragile
  // per-logo coordinate hunting at the small scale these print.
  {
    src: "slide-01.png",
    rect: { left: 2280, top: 1840, width: 1680, height: 260 },
    out: "supporters/supporters-strip.png",
  },

  // --- Hospital partner logos (slide 08, top half — per-logo crops) ---
  // Coordinates derived from the slide-08 1000-wide preview (×4 scale).
  // Hospital row y=320..940 in original; per-logo widths differ.
  {
    src: "slide-08.png",
    rect: { left: 280, top: 320, width: 620, height: 580 },
    out: "hospitals/basavatarakam.png",
  },
  {
    src: "slide-08.png",
    rect: { left: 1240, top: 320, width: 800, height: 580 },
    out: "hospitals/ilbs-delhi.png",
  },
  {
    src: "slide-08.png",
    rect: { left: 2160, top: 320, width: 720, height: 580 },
    out: "hospitals/mgm-kamothe.png",
  },

  // --- EHR / HMIS partner logos (slide 08, bottom half — per-logo crops) ---
  // EHR row y=1240..1760 in original; per-logo widths differ.
  {
    src: "slide-08.png",
    rect: { left: 240, top: 1340, width: 920, height: 380 },
    out: "ehr/akhil-systems.png",
  },
  {
    src: "slide-08.png",
    rect: { left: 1180, top: 1340, width: 600, height: 460 },
    out: "ehr/dataman.png",
  },
  {
    src: "slide-08.png",
    rect: { left: 1880, top: 1340, width: 620, height: 380 },
    out: "ehr/ohum-healthcare.png",
  },
  {
    src: "slide-08.png",
    rect: { left: 2620, top: 1340, width: 620, height: 380 },
    out: "ehr/jeena-sikho.png",
  },

  // --- Award photos (slide 07) ---
  {
    src: "slide-07.png",
    rect: { left: 200, top: 280, width: 720, height: 880 },
    out: "awards/tide-meity-hack-reboot.png",
  },
  {
    src: "slide-07.png",
    rect: { left: 940, top: 280, width: 720, height: 880 },
    out: "awards/chers-pilot-shark-tank.png",
  },
  {
    src: "slide-07.png",
    rect: { left: 200, top: 1240, width: 720, height: 880 },
    out: "awards/healthtech-meetup.png",
  },
  {
    src: "slide-07.png",
    rect: { left: 940, top: 1240, width: 720, height: 880 },
    out: "awards/top-woman-entrepreneur.png",
  },
  {
    src: "slide-07.png",
    rect: { left: 1680, top: 1240, width: 1000, height: 880 },
    out: "awards/v2dd-koita-foundation.png",
  },
  {
    src: "slide-07.png",
    rect: { left: 2700, top: 1240, width: 1100, height: 880 },
    out: "awards/medicircle-feature.png",
  },

  // --- KEM case-study charts (slide 12) ---
  {
    src: "slide-12.png",
    rect: { left: 360, top: 380, width: 1700, height: 1600 },
    out: "case-studies/kem-time-saved-bar.png",
  },
  {
    src: "slide-12.png",
    rect: { left: 2200, top: 240, width: 1700, height: 970 },
    out: "case-studies/kem-specialty-distribution.png",
  },
  {
    src: "slide-12.png",
    rect: { left: 2200, top: 1200, width: 1700, height: 1000 },
    out: "case-studies/kem-language-distribution.png",
  },

  // --- How VoiceDocAI Works diagram (slide 05, left half) ---
  // Start below the "Our Solution: VoiceDocAI" title; capture only the flow.
  {
    src: "slide-05.png",
    rect: { left: 80, top: 360, width: 2060, height: 1740 },
    out: "product/how-it-works-flow.png",
  },

  // --- Product UI screenshots (slide 06) ---
  // Slide title runs y=80-300; web app screenshot sits y=420-1480.
  {
    src: "slide-06.png",
    rect: { left: 280, top: 470, width: 1380, height: 1080 },
    out: "product/voicedocai-web-app.png",
  },
  {
    src: "slide-06.png",
    rect: { left: 1800, top: 320, width: 2120, height: 1900 },
    out: "product/voicedocai-pdf-reports.png",
  },

  // --- Founder portrait (slide 07: "Top Woman Entrepreneur" panel) ---
  // The Medicircle feature image at the right side has the clearest Aparna headshot.
  {
    src: "slide-07.png",
    rect: { left: 3320, top: 1320, width: 480, height: 540 },
    out: "founders/aparna-das-headshot.png",
  },

  // --- Crisp Jatayu phoenix mark (slide 17) ---
  {
    src: "slide-17.png",
    rect: { left: 3120, top: 80, width: 770, height: 770 },
    out: "jatayu-mark.png",
  },

  // --- MGM validation letter (slide 16) ---
  {
    src: "slide-16.png",
    rect: { left: 220, top: 420, width: 1600, height: 1660 },
    out: "case-studies/mgm-validation-letter.png",
  },
];

async function main() {
  for (const job of JOBS) {
    const inPath = path.join(SLIDES, job.src);
    const outPath = path.join(OUT, job.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await sharp(inPath)
      .extract(job.rect)
      .png({ compressionLevel: 9, palette: false })
      .toFile(outPath);
    console.log("wrote", path.relative(OUT, outPath));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
