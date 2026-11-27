# Sky Print & Advertising Pvt. Ltd. — Media & Brand Asset Guide

## 1. Supplied Brand Logo (Action Required)
No original Sky Print logo file was present in the initial empty workspace.
- Drop the original, unmodified logo file at:
  `public/logo/sky-print-logo.png` (recommended transparent PNG, minimum 600px wide)
- `src/components/ui/SkyPrintLogo.tsx` automatically renders `/logo/sky-print-logo.png` unchanged (`object-contain`, zero distortion or recoloring) whenever the file exists, and shows a clean geometric brand badge fallback until the file is placed.

## 2. Generated & Rendered Media Currently Integrated
- **Studio Photography (WebP, 1200–1376px wide)**:
  - `public/images/studio-press.webp` — Wide-format commercial inkjet press
  - `public/images/cmyk-printheads.webp` — Macro CMYK printhead carriages
  - `public/images/packaging-and-cards.webp` — Packaging boxes, visiting cards, brochures, bags
  - `public/images/large-format-signage.webp` — 3D acrylic & LED signboard + large-format banner
  - `public/images/promotional-gifts.webp` — Mugs, T-shirt, PVC ID card, trophy, stamp
  - `public/images/finishing-binding.webp` — Precision paper trimming, lamination & binding
  - `public/images/design-prepress.webp` — Calibrated prepress workstation & swatches
- **Remotion + FFmpeg Pipeline**:
  - `remotion/compositions/PrintingIntro.tsx` → rendered & optimized to `public/videos/hero-printing.mp4` + `public/videos/hero-printing.webm`
  - `remotion/compositions/CMYKSequence.tsx` → rendered to `public/videos/printing-process.mp4` and extracted into WebP frame sequence `public/sequences/printing-process/frame-00001.webp`...
  - `remotion/compositions/ProductReveal.tsx` → used in interactive Remotion Player showcase

## 3. Optional Google Gemini / Veo Video Upgrade Prompts
Because `gemini-api` / Veo API credentials were unavailable in this environment, the site pairs a real-time Three.js 3D scroll-driven printing press with Remotion + FFmpeg-rendered assets. When Veo access is available, generate `raw-media/printing-process.mp4` using this prompt:

> **Main Commercial Printing Machine Prompt (16:9, 24fps, highest resolution):**
> Photorealistic commercial cinematography of a large industrial digital printing machine operating inside a clean modern printing production facility. Realistic metallic rollers, precision print heads, paper feeding mechanism, and visible ink lines. A clean white sheet of premium paper slowly moves through the machine while print heads move horizontally and progressively apply Cyan, Magenta, Yellow, and Black (CMYK) ink layers to reveal a vibrant advertising design. Slightly angled front-side camera, smooth mechanical movement, controlled industrial studio lighting, zero text, zero logos, zero watermarks, consistent machine geometry across all frames.

After placing the Veo clip at `public/videos/printing-process.mp4`, regenerate the scroll frame sequence with:
```bash
chmod +x scripts/extract-frames.sh scripts/optimize-frames.sh
./scripts/extract-frames.sh public/videos/printing-process.mp4
./scripts/optimize-frames.sh
```
