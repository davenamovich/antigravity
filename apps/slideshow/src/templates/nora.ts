import { Slide } from "../slideshow.service";
import { progressDots, dotStyles } from "./renderer";

export function renderNoraSlide(slide: Slide, index: number, total: number): string {
  const isCTA = slide.type === "cta";
  const isHook = slide.type === "hook";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,900;1,400;1,600&family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1920px;
    background: #FFFFFF;
    font-family: 'Nunito', sans-serif;
    color: #1A1A1A;
    overflow: hidden;
    position: relative;
  }

  /* Soft blob background */
  .blob-teal {
    position: absolute;
    top: -250px;
    right: -250px;
    width: 800px;
    height: 800px;
    background: radial-gradient(ellipse, rgba(46,196,182,0.12) 0%, transparent 65%);
    border-radius: 50%;
  }

  .blob-orange {
    position: absolute;
    bottom: -200px;
    left: -150px;
    width: 700px;
    height: 700px;
    background: radial-gradient(ellipse, rgba(255,159,28,0.1) 0%, transparent 65%);
    border-radius: 50%;
  }

  /* Top color block */
  .top-color-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 12px;
    background: linear-gradient(90deg, #2EC4B6 0%, #FF9F1C 100%);
  }

  /* Rounded card container */
  .container {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 80px 72px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
  }

  /* Nora avatar circle */
  .avatar {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, #2EC4B6, #FF9F1C);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }

  .agent-info {}
  .agent-name {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 600;
    color: #1A1A1A;
  }
  .agent-role {
    font-size: 22px;
    color: rgba(26,26,26,0.5);
    font-weight: 400;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 48px;
  }

  .eyebrow {
    font-size: 28px;
    font-weight: 700;
    color: #2EC4B6;
    display: flex;
    align-items: center;
    gap: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .headline {
    font-family: 'Fraunces', serif;
    font-size: ${isHook ? "96px" : "80px"};
    font-weight: 900;
    line-height: 1.05;
    color: #1A1A1A;
    letter-spacing: -0.02em;
  }
  .headline em {
    font-style: italic;
    color: #2EC4B6;
  }
  .headline .warm { color: #FF9F1C; }

  /* Friendly callout box */
  .callout {
    background: rgba(46,196,182,0.07);
    border-radius: 24px;
    padding: 44px 52px;
    border: 2px solid rgba(46,196,182,0.15);
    position: relative;
  }
  .callout::before {
    content: '✓';
    position: absolute;
    top: -20px;
    left: 48px;
    background: #2EC4B6;
    color: white;
    width: 40px; height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
  }

  .stat-big {
    font-family: 'Fraunces', serif;
    font-size: 110px;
    font-weight: 900;
    color: #2EC4B6;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .body {
    font-size: 42px;
    font-weight: 400;
    line-height: 1.6;
    color: rgba(26,26,26,0.72);
  }
  .body strong {
    color: #1A1A1A;
    font-weight: 700;
  }

  /* Friendly CTA */
  .cta-block {
    background: linear-gradient(135deg, #2EC4B6 0%, #1A9E96 100%);
    color: #FFFFFF;
    padding: 52px 64px;
    border-radius: 20px;
    font-family: 'Fraunces', serif;
    font-size: 44px;
    font-weight: 600;
    line-height: 1.3;
    box-shadow: 0 20px 60px rgba(46,196,182,0.25);
  }
  .cta-sub {
    font-family: 'Nunito', sans-serif;
    font-size: 28px;
    font-weight: 400;
    opacity: 0.85;
    margin-top: 16px;
    display: block;
  }

  /* Step indicator for value slides */
  .step-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 26px;
    font-weight: 700;
    color: #FF9F1C;
  }
  .step-circle {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: rgba(255,159,28,0.12);
    border: 2px solid #FF9F1C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: 24px;
    color: #FF9F1C;
  }

  ${dotStyles}
  .dots { bottom: 76px; }
  .dot { background: rgba(26,26,26,0.1); }
  .dot.active { background: #2EC4B6; }

  .footer-nora {
    font-family: 'Nunito', sans-serif;
    font-size: 22px;
    color: rgba(26,26,26,0.3);
    text-align: center;
  }
</style>
</head>
<body>
  <div class="blob-teal"></div>
  <div class="blob-orange"></div>
  <div class="top-color-bar"></div>

  <div class="container">
    <div class="header">
      <div class="avatar">✨</div>
      <div class="agent-info">
        <div class="agent-name">Nora</div>
        <div class="agent-role">Your Web3 guide</div>
      </div>
    </div>

    <div class="content">
      ${slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : ""}

      <div class="headline">${formatHeadline(slide.headline)}</div>

      ${slide.stat ? `
        <div class="callout">
          <div class="stat-big">${slide.stat}</div>
        </div>
      ` : ""}

      ${!isCTA ? `<div class="body">${slide.body}</div>` : ""}

      ${isCTA ? `
        <div class="cta-block">
          ${slide.cta}
          <span class="cta-sub">No crypto experience needed ✓</span>
        </div>
      ` : ""}
    </div>

    <div class="footer-nora">${index + 1} / ${total}</div>
  </div>

  ${progressDots(index, total, "#2EC4B6", "rgba(26,26,26,0.1)")}
</body>
</html>`;
}

function formatHeadline(text: string): string {
  // Italicize first 1-2 words for Fraunces warmth
  const words = text.split(" ");
  if (words.length >= 3) {
    const first = words.shift();
    const last = words.pop();
    return `<em>${first}</em> ${words.join(" ")} <span class="warm">${last}</span>`;
  }
  return `<em>${text}</em>`;
}
