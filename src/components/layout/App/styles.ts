import {css} from "emotion";

export const styles = () => css`
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  height: 100vh;
  overflow: hidden;
  background: var(--bg-app);
  color: var(--label);
  font-size: 13px;

  .workspace {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .stage {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 40%, rgba(94, 92, 230, .06), transparent 60%),
      radial-gradient(rgba(255, 255, 255, .045) 1px, transparent 1px) 0 0 / 22px 22px,
      var(--bg-app);
  }

  .markup-bar {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
  }
  .canvas-wrapper { margin-top: 56px; }

  .canvas-wrapper {
    position: relative;
    flex-shrink: 0;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .06), 0 24px 60px rgba(0, 0, 0, .45);
  }

  @media (hover: none) and (pointer: coarse) {
    .canvas-hint { display: none; }
  }

  .canvas-hint {
    position: absolute;
    bottom: 14px;
    margin: 0;
    color: var(--label-3);
    font-size: 12px;
    text-align: center;
    pointer-events: none;
  }

  .image-selector-wrap { width: min(100% - 48px, 560px); }

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto;
    height: auto;
    overflow: visible;

    .workspace { order: 1; }
    > aside { order: 2; border-right: 0; border-top: 1px solid var(--separator); }
    .stage { min-height: 52vh; padding: 16px 0 24px; }
    .canvas-hint { display: none; }
    .markup-bar { max-width: calc(100% - 16px); overflow-x: auto; }
  }
`;
