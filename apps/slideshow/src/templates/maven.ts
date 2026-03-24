import { Slide } from "../slideshow.service";
import { progressDots, dotStyles } from "./renderer";

export function renderMavenSlide(slide: Slide, index: number, total: number): string {
  const isCTA = slide.type === "cta";
  const isHook = slide.type === "hook";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1920px;
    background: #F5F0E8;
    font-family: 'Source Sans 3', sans-serif;
    color: #1A1A2E;
    overflow: hidden;
    position: relative;
  }

  /* Diagonal line pattern */
  .bg-lines {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 40px,
      rgba(26,58,92,0.04) 40px,
      rgba(26,58,92,0.04) 41px
    );
  }

  /* Gold accent bar left */
  .accent-bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 8px;
    background: linear-gradient(180deg, #C8A96E 0%, #8B6914 50%, #C8A96E 100%);
  }

  /* Top rule */
  .top-rule {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: #1A3A5C;
  }

  .container {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 90px 80px 90px 96px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .agent-tag {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #1A3A5C;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  .issue-label {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 22px;
    color: #C8A96E;
    letter-spacing: 0.1em;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 52px;
  }

  .eyebrow {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 26px;
    font-weight: 600;
    color: #C8A96E;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .eyebrow::before {
    content: '';
    display: block;
    width: 40px;
    height: 2px;
    background: #C8A96E;
  }

  .headline {
    font-family: 'Playfair Display', serif;
    font-size: ${isHook ? "102px" : "86px"};
    font-weight: ${isHook ? "900" : "700"};
    line-height: 1.05;
    color: #1A1A2E;
    letter-spacing: -0.02em;
  }

  .headline em {
    font-style: italic;
    color: #1A3A5C;
  }

  /* Stat pullquote */
  .stat-block {
    border-top: 2px solid #1A3A5C;
    border-bottom: 2px solid #1A3A5C;
    padding: 44px 0;
    display: flex;
    align-items: baseline;
    gap: 20px;
  }
  .stat-number {
    font-family: 'Playfair Display', serif;
    font-size: 110px;
    font-weight: 900;
    color: #1A3A5C;
    line-height: 1;
  }
  .stat-label {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 30px;
    color: #C8A96E;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    max-width: 300px;
    line-height: 1.3;
  }

  .body {
    font-size: 38px;
    font-weight: 300;
    line-height: 1.6;
    color: rgba(26,26,46,0.75);
    max-width: 860px;
  }

  /* CTA */
  .cta-block {
    background: #1A3A5C;
    color: #F5F0E8;
    padding: 52px 64px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 1.5;
    position: relative;
  }
  .cta-arrow {
    display: block;
    margin-top: 20px;
    font-size: 42px;
    color: #C8A96E;
    font-family: 'Playfair Display', serif;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .slide-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: rgba(26,26,46,0.3);
    font-style: italic;
  }

  ${dotStyles}
  .dots { bottom: 85px; }
  .dot { background: rgba(26,26,46,0.15); }
  .dot.active { background: #C8A96E; }
</style>
</head>
<body>
  <div class="bg-lines"></div>
  <div class="accent-bar"></div>
  <div class="top-rule"></div>

  <div class="container">
    <div class="header">
      <div class="agent-tag">Maven Intelligence</div>
      <div class="issue-label">Vol. ${index + 1}</div>
    </div>

    <div class="content">
      ${slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : ""}

      <div class="headline">${formatHeadline(slide.headline)}</div>

      ${slide.stat ? `
        <div class="stat-block">
          <div class="stat-number">${slide.stat}</div>
          <div class="stat-label">Return on attention</div>
        </div>
      ` : ""}

      ${!isCTA ? `<div class="body">${slide.body}</div>` : ""}

      ${isCTA ? `
        <div class="cta-block">
          ${slide.cta}
          <span class="cta-arrow">→</span>
        </div>
      ` : ""}
    </div>

    <div class="footer">
      <div class="slide-num">${index + 1} of ${total}</div>
    </div>
  </div>

  ${progressDots(index, total, "#C8A96E", "rgba(26,26,46,0.15)")}
</body>
</html>`;
}

function formatHeadline(text: string): string {
  // Italicize words after "the" or "a"
  return text.replace(/\b(the|a)\s+(\w+)/gi, (_, article, word) =>
    `${article} <em>${word}</em>`
  );
}
