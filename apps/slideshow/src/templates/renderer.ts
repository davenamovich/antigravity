import { AgentId, Slide } from "../slideshow.service";
import { AGENT_PERSONAS } from "../personas";
import { renderLarryBrainSlide } from "./larrybrain";
import { renderMavenSlide } from "./maven";
import { renderHustleSlide } from "./hustle";
import { renderIdeaRalphSlide } from "./idearalph";
import { renderNoraSlide } from "./nora";

export function renderAgentSlide(
  agentId: AgentId,
  slide: Slide,
  index: number,
  total: number
): string {
  switch (agentId) {
    case "larrybrain": return renderLarryBrainSlide(slide, index, total);
    case "maven":      return renderMavenSlide(slide, index, total);
    case "hustle":     return renderHustleSlide(slide, index, total);
    case "idearalph":  return renderIdeaRalphSlide(slide, index, total);
    case "nora":       return renderNoraSlide(slide, index, total);
  }
}

// shared slide progress dots
export function progressDots(index: number, total: number, activeColor: string, inactiveColor: string): string {
  return `<div class="dots">${Array.from({ length: total }, (_, i) =>
    `<span class="dot${i === index ? " active" : ""}" style="background:${i === index ? activeColor : inactiveColor}"></span>`
  ).join("")}</div>`;
}

export const dotStyles = `
  .dots {
    display: flex;
    gap: 8px;
    justify-content: center;
    position: absolute;
    bottom: 60px;
    left: 0; right: 0;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    opacity: 0.4;
    transition: opacity 0.3s;
  }
  .dot.active { opacity: 1; width: 24px; border-radius: 4px; }
`;
