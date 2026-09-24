import {css} from "@emotion/core";

export const styles = () => css`
  :root {
    --sidebar-width: 300px;
    --toolbar-height: 52px;

    --font-ui: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif;

    --bg-app: #121214;
    --bg-sidebar: #1c1c1e;
    --bg-elevated: #2c2c2e;
    --bg-popover: #2a2a2d;
    --separator: rgba(255, 255, 255, .08);
    --separator-strong: rgba(255, 255, 255, .14);

    --fill: rgba(118, 118, 128, .2);
    --fill-hover: rgba(118, 118, 128, .3);
    --fill-pressed: rgba(118, 118, 128, .4);
    --fill-selected: #636366;

    --label: #f5f5f7;
    --label-2: rgba(235, 235, 245, .64);
    --label-3: rgba(235, 235, 245, .38);

    --accent: #5e5ce6;
    --accent-hover: #6d6bf0;
    --accent-soft: rgba(94, 92, 230, .22);
    --focus-ring: 0 0 0 2px var(--bg-app), 0 0 0 4px #a5a4ff;
    --danger: #ff453a;

    --radius-s: 6px;
    --radius-m: 8px;
    --radius-l: 12px;

    --shadow-popover: 0 0 0 .5px rgba(255, 255, 255, .12), 0 12px 32px rgba(0, 0, 0, .45), 0 2px 8px rgba(0, 0, 0, .3);
    --ease: cubic-bezier(.2, .8, .2, 1);
  }

  /* Base rules previously provided by Bootstrap's reboot. */
  *, *::before, *::after { box-sizing: border-box; }
  h1, h2, h3, h4, h5, h6 { margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; }
  p, ul, ol, dl { margin-top: 0; margin-bottom: 1rem; }
  img, svg { vertical-align: middle; }
  label { display: inline-block; }
  button { border-radius: 0; }
  input, button, select, textarea { margin: 0; line-height: inherit; }
  [hidden] { display: none !important; }

  body {
    margin: 0;
    line-height: 1.5;
    background: var(--bg-app);
    color: var(--label);
    font-family: var(--font-ui);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button, input, select, textarea { font: inherit; }
  button, a, input, select { touch-action: manipulation; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible,
  [role="button"]:focus-visible, summary:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  ::selection { background: var(--accent); color: white; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }
  }
`;
