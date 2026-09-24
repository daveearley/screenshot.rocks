import {css} from "emotion";

export const styles = css`
  --page: min(1120px, 100% - 48px);

  position: relative;
  min-height: 100vh;
  background: var(--bg-app);
  color: var(--label);
  font-size: 15px;
  line-height: 1.5;

  a { color: #a5a4ff; text-decoration: none; }
  a:hover { text-decoration: underline; }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 16px;
    border: 0;
    border-radius: var(--radius-m);
    background: var(--fill);
    color: var(--label);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    transition: background .15s;
  }
  .button:hover { background: var(--fill-hover); color: var(--label); text-decoration: none; }
  .button:disabled { opacity: .5; }
  .button.primary { background: var(--accent); color: #fff; }
  .button.primary:hover { background: var(--accent-hover); }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: var(--page);
    height: 64px;
    margin: 0 auto;
  }
  .brand { display: flex; align-items: center; gap: 9px; color: var(--label); font-size: 15px; font-weight: 600; }
  .brand:hover { text-decoration: none; }
  .brand img { width: 24px; height: 24px; }
  .nav nav { display: flex; align-items: center; gap: 24px; }
  .nav nav a { display: flex; align-items: center; gap: 7px; color: var(--label-2); font-size: 14px; }
  .nav-extension img { width: 16px; height: 16px; }
  .nav nav a:hover { color: var(--label); text-decoration: none; }
  .nav .button { height: 32px; font-size: 13px; }

  main { width: var(--page); margin: 0 auto; }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    align-items: center;
    gap: 56px;
    padding: 72px 0 96px;
  }
  h1 {
    margin: 0;
    font-size: clamp(36px, 4.6vw, 56px);
    font-weight: 650;
    line-height: 1.05;
    letter-spacing: -.025em;
  }
  .lede { max-width: 30em; margin: 20px 0 32px; color: var(--label-2); font-size: 17px; }

  .start { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; }
  .start .button { height: 42px; padding: 0 20px; font-size: 15px; }
  .hint { color: var(--label-3); font-size: 13px; }

  .hero-extension {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    padding: 8px 14px 8px 10px;
    border-radius: 999px;
    background: var(--fill);
    color: var(--label-2);
    font-size: 13px;
  }
  .hero-extension:hover { background: var(--fill-hover); color: var(--label); text-decoration: none; }
  .hero-extension img { width: 20px; height: 20px; }
  .hero-extension strong { color: var(--label); font-weight: 600; }

  .capture { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--separator); max-width: 460px; }
  .capture > label { display: block; margin-bottom: 8px; color: var(--label-2); font-size: 13px; }
  .capture-row { display: flex; align-items: center; gap: 10px; }
  .capture-row input:not([type=checkbox]) { flex: 1; height: 36px; padding: 0 12px; font-size: 14px; }
  .mobile { display: flex; align-items: center; gap: 6px; color: var(--label-2); font-size: 13px; }
  .mobile input { accent-color: var(--accent); }
  .error { margin: 8px 0 0; color: #ff8a80; font-size: 13px; }

  .demo { margin: 16px 0 0; color: var(--label-3); font-size: 13px; }
  .demo button { padding: 0; border: 0; background: none; color: #a5a4ff; font-size: 13px; }
  .demo button:hover { text-decoration: underline; }

  figure { margin: 0; }
  figure img { display: block; width: 100%; height: auto; border-radius: var(--radius-l); box-shadow: 0 0 0 1px var(--separator); }
  .hero-image img { box-shadow: 0 0 0 1px var(--separator), 0 30px 80px rgba(0, 0, 0, .45); }

  section h2 { margin: 0 0 24px; font-size: 22px; font-weight: 600; letter-spacing: -.01em; }

  .examples { padding: 48px 0 32px; border-top: 1px solid var(--separator); }
  /* Columns follow the images' aspect ratios so both render at the same height. */
  .example-grid { display: grid; grid-template-columns: .75fr 1.6fr; gap: 24px; }
  figcaption { max-width: 34em; margin-top: 14px; color: var(--label-2); font-size: 14px; }
  figcaption strong { color: var(--label); font-weight: 600; }

  .extension {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: center;
    gap: 56px;
    margin: 72px 0;
    padding: 48px;
    border: 1px solid var(--separator);
    border-radius: 20px;
    background: var(--bg-sidebar);
  }
  .extension h2 { margin: 0 0 10px; font-size: 28px; letter-spacing: -.02em; }
  .extension-intro > p { max-width: 30em; margin: 0; color: var(--label-2); font-size: 16px; }

  .toolbar-demo {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: 420px;
    height: 44px;
    margin: 28px 0 44px;
    padding: 0 12px;
    border-radius: 10px;
    background: #2c2c2e;
    box-shadow: inset 0 0 0 1px var(--separator);
  }
  .toolbar-demo .dots { display: flex; gap: 6px; }
  .toolbar-demo .dots i { width: 10px; height: 10px; border-radius: 50%; background: #48484a; }
  .toolbar-demo .address {
    flex: 1;
    height: 26px;
    padding: 0 12px;
    border-radius: 6px;
    background: #1c1c1e;
    color: var(--label-3);
    font-size: 12px;
    line-height: 26px;
  }
  .toolbar-demo .extensions { display: flex; align-items: center; gap: 8px; }
  .toolbar-demo .extensions > i { width: 16px; height: 16px; border-radius: 4px; background: #48484a; }
  .toolbar-demo .ours {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }
  .toolbar-demo .ours img { width: 18px; height: 18px; }
  .toolbar-demo .button-tip {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    padding: 5px 9px;
    border-radius: 6px;
    background: #3a3a3c;
    color: var(--label);
    font-size: 12px;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .3);
  }
  .toolbar-demo .button-tip::before {
    content: "";
    position: absolute;
    right: 20px;
    top: -4px;
    width: 8px;
    height: 8px;
    background: inherit;
    transform: rotate(45deg);
  }

  .steps { margin: 0; padding: 0; list-style: none; counter-reset: step; }
  .steps li {
    position: relative;
    padding-left: 34px;
    color: var(--label-2);
    font-size: 14px;
    counter-increment: step;
  }
  .steps li + li { margin-top: 12px; }
  .steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: -1px;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--fill);
    color: var(--label);
    font-size: 12px;
    font-weight: 600;
  }

  .stores { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
  .store {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 14px;
    background: var(--bg-elevated);
    box-shadow: inset 0 0 0 1px var(--separator);
    color: var(--label);
    transition: background .15s, box-shadow .15s, transform .15s var(--ease);
  }
  .store:hover { background: #333336; color: var(--label); text-decoration: none; transform: translateY(-1px); }
  .store.suggested { box-shadow: inset 0 0 0 1.5px var(--accent); }
  .store img { flex-shrink: 0; width: 40px; height: 40px; }
  .store-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .store-text strong { font-size: 15px; font-weight: 600; }
  .store-text span { color: var(--label-3); font-size: 13px; }
  .store .chevron { width: 16px; height: 16px; color: var(--label-3); }

  .footer {
    width: var(--page);
    margin: 0 auto;
    padding: 32px 0 40px;
    border-top: 1px solid var(--separator);
    color: var(--label-3);
    font-size: 13px;
  }
  .footer-links { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-bottom: 32px; }
  .footer h2 { margin: 0 0 10px; color: var(--label); font-size: 13px; font-weight: 600; }
  .footer h2 a { color: inherit; }
  .footer ul { margin: 0; padding: 0; list-style: none; }
  .footer li { margin-bottom: 6px; }
  .footer-meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 24px; }
  .footer p { margin: 0; }
  .footer a { color: var(--label-2); }
  .share { display: flex; align-items: center; gap: 14px; }

  .drop-overlay {
    position: fixed;
    inset: 12px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--accent);
    border-radius: 16px;
    background: rgba(18, 18, 20, .97);
    font-size: 17px;
    font-weight: 500;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    .hero { grid-template-columns: minmax(0, 1fr); gap: 40px; padding: 40px 0 64px; }
    .extension { grid-template-columns: minmax(0, 1fr); gap: 32px; padding: 32px; }
  }
  /* No extensions, drag and drop or keyboard paste on touch devices. */
  @media (hover: none) and (pointer: coarse) {
    .hero-extension, .hint { display: none; }
  }

  @media (max-width: 600px) {
    --page: calc(100% - 32px);
    .nav nav a:not([href="/guides/"]) { display: none; }
    .example-grid { grid-template-columns: minmax(0, 1fr); }
    .capture-row { flex-wrap: wrap; }
    .capture-row input:not([type=checkbox]) { flex-basis: 100%; }
    .extension { padding: 24px; }
    .footer-links { grid-template-columns: minmax(0, 1fr); }
    .extension h2 { font-size: 24px; }
    .toolbar-demo .dots { display: none; }
  }
`;
