import {css} from "emotion";

export const styles = (): string => css`
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, .55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: crop-fade .18s var(--ease);

  .sheet {
    display: flex;
    flex-direction: column;
    max-width: min(1100px, 100%);
    max-height: 100%;
    border-radius: 14px;
    background: var(--bg-sidebar);
    box-shadow: var(--shadow-popover);
    overflow: hidden;
    animation: crop-in .22s var(--ease);
    outline: none;
  }

  header, footer { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
  header { justify-content: space-between; border-bottom: 1px solid var(--separator); }
  header h2 { margin: 0; font-size: 13px; font-weight: 600; }
  header [role="group"] { width: 240px; }
  footer { border-top: 1px solid var(--separator); }
  footer .hint { flex: 1; color: var(--label-3); font-size: 12px; }

  .crop-area {
    display: flex;
    justify-content: center;
    min-height: 0;
    padding: 20px;
    overflow: auto;
    background: radial-gradient(rgba(255, 255, 255, .04) 1px, transparent 1px) 0 0 / 16px 16px, var(--bg-app);
  }
  .ReactCrop img { display: block; max-width: 100%; max-height: calc(100vh - 220px); }

  @keyframes crop-fade { from { opacity: 0; } }
  @keyframes crop-in { from { opacity: 0; transform: scale(.98); } }
`;
