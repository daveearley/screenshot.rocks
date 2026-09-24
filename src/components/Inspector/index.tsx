import React from "react";
import {view} from "@risingstack/react-easy-state";
import {css, cx} from "emotion";
import {app} from "../../stores/appStore";
import {RatingPromptBox} from "../common/RatingPromptBox";
import {LooksSection} from "./LooksSection";
import {FrameSection} from "./FrameSection";
import {BackgroundSection} from "./BackgroundSection";
import {LayoutSection} from "./LayoutSection";

const styles = css`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--separator);
  color: var(--label);
  font-size: 13px;

  > header {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: var(--toolbar-height);
    padding: 0 16px;
    border-bottom: 1px solid var(--separator);
  }
  .brand { display: flex; align-items: center; gap: 8px; color: var(--label); font-size: 14px; font-weight: 600; letter-spacing: -.1px; text-decoration: none; }
  .brand:hover { color: var(--label); }
  .brand img { width: 22px; height: 22px; }

  .sections {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, .18) transparent;
  }
  .sections::-webkit-scrollbar { width: 8px; }
  .sections::-webkit-scrollbar-thumb { border: 2px solid var(--bg-sidebar); border-radius: 8px; background: rgba(255, 255, 255, .18); }

  &.disabled .sections { opacity: .4; pointer-events: none; }
`;

export const Inspector = view(() => (
    <aside className={cx(styles, !app.imageData && 'disabled')} aria-label="Inspector">
        <header>
            <a href="/" className="brand"><img src="/images/hand-logo-sqr-white.png" alt=""/>Screenshot.Rocks</a>
        </header>
        {/* React 16 has no typing for `inert`. */}
        <div className="sections" aria-disabled={!app.imageData} {...(!app.imageData ? {inert: ''} as any : {})}>
            <LooksSection/>
            <FrameSection/>
            <BackgroundSection/>
            <LayoutSection/>
            <RatingPromptBox/>
        </div>
    </aside>
));
