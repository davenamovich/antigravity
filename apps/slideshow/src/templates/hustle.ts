import { Slide } from "../slideshow.service";
import { progressDots, dotStyles } from "./renderer";

export function renderHustleSlide(slide: Slide, index: number, total: number): string {
  const isCTA = slide.type === "cta";
  const isHook = slide.type === "hook";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1920px;
    background: #1A0A2E;
    font-family: 'Barlow', sans-serif;
    color: #FFFFFF;
    overflow: hidden;
    position: relative;
  }

  /* Noise texture overlay */
  .noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* Pink glow */
  .glow-pink {
    position: absolute;
    bottom: -300px;
    right: -200px;
    width: 900px;
    height: 900px;
    background: radial-gradient(ellipse, rgba(255,0,110,0.2) 0%, transparent 65%);
  }

  /* Yellow glow top left */
  .glow-yellow {
    position: absolute;
    top: -200px;
    left: -200px;
    width: 700px;
    height: 700px;
    background: radial-gradient(ellipse, rgba(255,190,11,0.12) 0%, transparent 65%);
  }

  /* Diagonal slash accent */
  .slash {
    position: absolute;
    top: 0; right: 120px;
    width: 6px;
    height: 100%;
    background: linear-gradient(180deg, #FFBE0B 0%, #FF006E 100%);
    transform: skewX(-8deg);
  }
  .slash-2 {
    position: absolute;
    top: 0; right: 140px;
    width: 2px;
    height: 100%;
    background: rgba(255,190,11,0.3);
    transform: skewX(-8deg);
  }

  .container {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 80px 72px;
  }

  .agent-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    letter-spacing: 0.15em;
    color: #FF006E;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .agent-tag-dot {
    width: 12px; height: 12px;
    background: #FFBE0B;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 44px;
  }

  .eyebrow {
    font-family: 'Barlow', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #FFBE0B;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: ${isHook ? "148px" : "120px"};
    line-height: 0.92;
    letter-spacing: 0.02em;
    color: #FFFFFF;
  }

  .headline .pink { color: #FF006E; }
  .headline .yellow { color: #FFBE0B; }

  /* Big stat */
  .stat-block {
    display: flex;
    align-items: flex-end;
    gap: 0;
    line-height: 1;
  }
  .stat-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 160px;
    color: #FFBE0B;
    line-height: 1;
  }
  .stat-suffix {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 60px;
    color: rgba(255,190,11,0.6);
    padding-bottom: 24px;
    margin-left: 8px;
  }

  .body {
    font-size: 44px;
    font-weight: 500;
    line-height: 1.4;
    color: rgba(255,255,255,0.8);
  }
  .body strong {
    color: #FFFFFF;
    font-weight: 900;
  }

  /* CTA */
  .cta-block {
    background: linear-gradient(135deg, #FF006E, #FF006E 60%, #FFBE0B);
    padding: 52px 64px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 64px;
    letter-spacing: 0.05em;
    line-height: 1.1;
    color: #FFFFFF;
    clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px));
  }

  ${dotStyles}
  .dots { bottom: 72px; }
  .dot { background: rgba(255,255,255,0.15); }
  .dot.active { background: #FF006E; }

  /* Bottom tag */
  .bottom-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.2);
  }
</style>
</head>
<body>
  <div class="noise"></div>
  <div class="glow-pink"></div>
  <div class="glow-yellow"></div>
  <div class="slash"></div>
  <div class="slash-2"></div>

  <div class="container">
    <div class="agent-tag">
      <span class="agent-tag-dot"></span>
      HUSTLE
    </div>

    <div class="content">
      ${slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : ""}

      <div class="headline">${formatHeadline(slide.headline)}</div>

      ${slide.stat ? `
        <div class="stat-block">
          <span class="stat-number">${extractNumber(slide.stat)}</span>
          <span class="stat-suffix">${extractSuffix(slide.stat)}</span>
        </div>
      ` : ""}

      ${!isCTA ? `<div class="body">${slide.body}</div>` : ""}

      ${isCTA ? `<div class="cta-block">${slide.cta}</div>` : ""}
    </div>

    <div class="bottom-tag">Vessel Protocol · ${index + 1}/${total}</div>
  </div>

  ${progressDots(index, total, "#FF006E", "rgba(255,255,255,0.15)")}
</body>
</html>`;
}

function formatHeadline(text: string): string {
  const words = text.split(" ");
  return words.map((w, i) => {
    if (i === 0) return `<span class="pink">${w}</span>`;
    if (i === words.length - 1) return `<span class="yellow">${w}</span>`;
    return w;
  }).join(" ");
}

function extractNumber(stat: string): string {
  return stat.replace(/[^0-9.KMB%$+]/gi, "").replace(/([0-9.]+).*/, "$1") || stat;
}

function extractSuffix(stat: string): string {
  const match = stat.match(/[KMB%+x]/i);
  return match ? match[0].toUpperCase() : "";
}
