import { Slide } from "../slideshow.service";
import { progressDots, dotStyles } from "./renderer";

export function renderIdeaRalphSlide(slide: Slide, index: number, total: number): string {
  const isCTA = slide.type === "cta";
  const isHook = slide.type === "hook";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1920px;
    background: #FAFAFA;
    font-family: 'IBM Plex Sans', sans-serif;
    color: #0D0D0D;
    overflow: hidden;
    position: relative;
  }

  /* Dot grid */
  .bg-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(123,47,190,0.12) 1.5px, transparent 1.5px);
    background-size: 48px 48px;
  }

  /* Purple blob top right */
  .blob-1 {
    position: absolute;
    top: -180px;
    right: -180px;
    width: 600px;
    height: 600px;
    background: radial-gradient(ellipse, rgba(123,47,190,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  /* Cyan blob bottom left */
  .blob-2 {
    position: absolute;
    bottom: -200px;
    left: -150px;
    width: 700px;
    height: 700px;
    background: radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  /* Bracket decorations */
  .bracket-tl {
    position: absolute;
    top: 48px; left: 48px;
    width: 60px; height: 60px;
    border-top: 3px solid rgba(123,47,190,0.3);
    border-left: 3px solid rgba(123,47,190,0.3);
  }
  .bracket-br {
    position: absolute;
    bottom: 48px; right: 48px;
    width: 60px; height: 60px;
    border-bottom: 3px solid rgba(0,212,255,0.3);
    border-right: 3px solid rgba(0,212,255,0.3);
  }

  .container {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 88px 80px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .agent-tag {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #7B2FBE;
    letter-spacing: -0.02em;
  }
  .agent-tag span {
    color: #00D4FF;
  }

  .idea-counter {
    font-family: 'IBM Plex Sans', monospace;
    font-size: 22px;
    color: rgba(13,13,13,0.3);
    background: rgba(123,47,190,0.06);
    padding: 8px 20px;
    border-radius: 100px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 52px;
  }

  .eyebrow {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 28px;
    font-weight: 500;
    color: #00D4FF;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .eyebrow::before {
    content: '💡';
    font-size: 32px;
  }

  .headline {
    font-family: 'Syne', sans-serif;
    font-size: ${isHook ? "100px" : "82px"};
    font-weight: 800;
    line-height: 1.0;
    color: #0D0D0D;
    letter-spacing: -0.03em;
  }
  .headline .purple { color: #7B2FBE; }
  .headline .cyan { color: #00D4FF; }

  /* Idea box */
  .idea-box {
    background: #FFFFFF;
    border: 2px solid rgba(123,47,190,0.15);
    border-left: 5px solid #7B2FBE;
    padding: 44px 48px;
    position: relative;
    box-shadow: 8px 8px 0px rgba(123,47,190,0.08);
  }
  .idea-box-label {
    position: absolute;
    top: -14px;
    left: 40px;
    background: #7B2FBE;
    color: white;
    font-family: 'IBM Plex Sans', monospace;
    font-size: 20px;
    padding: 4px 16px;
    border-radius: 4px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .stat-big {
    font-family: 'Syne', sans-serif;
    font-size: 96px;
    font-weight: 800;
    color: #7B2FBE;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .body {
    font-size: 40px;
    font-weight: 400;
    line-height: 1.55;
    color: rgba(13,13,13,0.7);
  }
  .body strong { color: #0D0D0D; font-weight: 600; }

  /* CTA */
  .cta-block {
    background: #0D0D0D;
    color: #FAFAFA;
    padding: 52px 60px;
    font-family: 'Syne', sans-serif;
    font-size: 44px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    position: relative;
    overflow: hidden;
  }
  .cta-block::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 6px;
    background: linear-gradient(180deg, #7B2FBE, #00D4FF);
  }
  .cta-block span {
    color: #00D4FF;
  }

  ${dotStyles}
  .dots { bottom: 80px; }
  .dot { background: rgba(13,13,13,0.12); }
  .dot.active { background: #7B2FBE; }
</style>
</head>
<body>
  <div class="bg-dots"></div>
  <div class="blob-1"></div>
  <div class="blob-2"></div>
  <div class="bracket-tl"></div>
  <div class="bracket-br"></div>

  <div class="container">
    <div class="header">
      <div class="agent-tag">Idea<span>Ralph</span></div>
      <div class="idea-counter">idea_${String(index + 1).padStart(3, "0")}</div>
    </div>

    <div class="content">
      ${slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : ""}

      <div class="headline">${formatHeadline(slide.headline)}</div>

      ${slide.stat ? `
        <div class="idea-box">
          <div class="idea-box-label">The number</div>
          <div class="stat-big">${slide.stat}</div>
        </div>
      ` : ""}

      ${!isCTA ? `<div class="body">${slide.body}</div>` : ""}

      ${isCTA ? `
        <div class="cta-block">
          ${slide.cta?.replace(/(\w+\s*$)/, '<span>$1</span>')}
        </div>
      ` : ""}
    </div>
  </div>

  ${progressDots(index, total, "#7B2FBE", "rgba(13,13,13,0.12)")}
</body>
</html>`;
}

function formatHeadline(text: string): string {
  const words = text.split(" ");
  const mid = Math.floor(words.length / 2);
  return words.map((w, i) => {
    if (i === mid) return `<span class="purple">${w}</span>`;
    if (i === words.length - 1 && words.length > 2) return `<span class="cyan">${w}</span>`;
    return w;
  }).join(" ");
}
