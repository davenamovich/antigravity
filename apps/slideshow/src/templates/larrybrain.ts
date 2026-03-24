import { Slide } from "../slideshow.service";
import { progressDots, dotStyles } from "./renderer";

export function renderLarryBrainSlide(slide: Slide, index: number, total: number): string {
  const isCTA = slide.type === "cta";
  const isHook = slide.type === "hook";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1920px;
    background: #0A0A0A;
    font-family: 'DM Sans', sans-serif;
    color: #FFFFFF;
    overflow: hidden;
    position: relative;
  }

  /* Grid background */
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,135,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,135,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Scan line effect */
  .scanline {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.15) 3px,
      rgba(0,0,0,0.15) 4px
    );
    pointer-events: none;
  }

  /* Glow accent top */
  .glow-top {
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(ellipse, rgba(0,255,135,0.12) 0%, transparent 70%);
  }

  .container {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 80px 72px;
  }

  /* Agent tag */
  .agent-tag {
    font-family: 'Space Mono', monospace;
    font-size: 26px;
    color: #00FF87;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .agent-tag::before {
    content: '>';
    color: #FF3D00;
    font-size: 30px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 48px;
  }

  .eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 28px;
    color: #FF3D00;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .headline {
    font-family: 'Space Mono', monospace;
    font-size: ${isHook ? "96px" : "80px"};
    font-weight: 700;
    line-height: 1.0;
    color: #FFFFFF;
  }

  .headline .highlight {
    color: #00FF87;
    display: block;
  }

  /* Big stat */
  .stat-block {
    background: rgba(0,255,135,0.07);
    border: 1px solid rgba(0,255,135,0.3);
    border-left: 4px solid #00FF87;
    padding: 40px 48px;
    font-family: 'Space Mono', monospace;
    font-size: 100px;
    font-weight: 700;
    color: #00FF87;
    line-height: 1;
  }

  .body {
    font-size: 40px;
    font-weight: 400;
    line-height: 1.5;
    color: rgba(255,255,255,0.75);
    max-width: 900px;
  }

  /* CTA */
  .cta-block {
    background: #00FF87;
    color: #0A0A0A;
    padding: 48px 64px;
    font-family: 'Space Mono', monospace;
    font-size: 42px;
    font-weight: 700;
    line-height: 1.3;
    position: relative;
    overflow: hidden;
  }
  .cta-block::after {
    content: '→';
    position: absolute;
    right: 64px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 56px;
  }

  /* Slide number */
  .slide-num {
    font-family: 'Space Mono', monospace;
    font-size: 24px;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.1em;
  }

  ${dotStyles}
  .dots { bottom: 80px; }
  .dot { background: rgba(255,255,255,0.2); }
  .dot.active { background: #00FF87; }

  /* Bottom bar */
  .bottom-bar {
    height: 4px;
    background: linear-gradient(90deg, #00FF87, #FF3D00);
    position: absolute;
    bottom: 0; left: 0; right: 0;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="scanline"></div>
  <div class="glow-top"></div>

  <div class="container">
    <div class="agent-tag">LarryBrain</div>

    <div class="content">
      ${slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : ""}

      <div class="headline">
        ${formatHeadline(slide.headline)}
      </div>

      ${slide.stat ? `<div class="stat-block">${slide.stat}</div>` : ""}

      ${!isCTA ? `<div class="body">${slide.body}</div>` : ""}

      ${isCTA ? `<div class="cta-block">${slide.cta}</div>` : ""}
    </div>

    <div class="slide-num">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</div>
  </div>

  ${progressDots(index, total, "#00FF87", "rgba(255,255,255,0.15)")}
  <div class="bottom-bar"></div>
</body>
</html>`;
}

function formatHeadline(text: string): string {
  // Make last word green
  const words = text.split(" ");
  if (words.length > 1) {
    const last = words.pop();
    return `${words.join(" ")} <span class="highlight">${last}</span>`;
  }
  return text;
}
