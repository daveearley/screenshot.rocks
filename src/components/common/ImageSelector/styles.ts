import {css} from "emotion";

export const styles = css`
  padding: 24px;
  border: 1px solid var(--separator);
  border-radius: var(--radius-l);
  background: var(--bg-sidebar);
  box-shadow: 0 24px 60px rgba(0, 0, 0, .35);
  color: var(--label);
  font-size: 13px;

  .drop {
    padding: 36px 20px;
    border: 1.5px dashed var(--separator-strong);
    border-radius: var(--radius-m);
    text-align: center;
    cursor: default;
    transition: border-color .15s, background .15s;
  }
  .drop:hover, .drop.active { border-color: var(--accent); background: rgba(94, 92, 230, .06); }
  .drop svg { width: 22px; height: 22px; color: var(--label-2); }
  .drop h2 { margin: 12px 0 4px; font-size: 15px; font-weight: 600; }
  .drop p { margin: 0; color: var(--label-2); }
  .link { color: #a5a4ff; }

  .capture { margin-top: 20px; }
  .capture > label { display: block; margin-bottom: 6px; color: var(--label-2); }
  .capture-row { display: flex; align-items: center; gap: 8px; }
  .capture-row input[type=text], .capture-row input:not([type]) { flex: 1; height: 28px; font-size: 13px; }
  .mobile { display: flex; align-items: center; gap: 5px; color: var(--label-2); white-space: nowrap; }
  .mobile input { accent-color: var(--accent); }
  .error { margin: 8px 0 0; color: #ff8a80; font-size: 12px; }

  .demo { margin: 16px 0 0; color: var(--label-3); font-size: 12px; }
  .demo button { padding: 0; border: 0; background: none; color: #a5a4ff; font-weight: 500; }
  .demo button:hover { text-decoration: underline; }
`;
