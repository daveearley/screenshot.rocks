import React, {useRef} from "react";
import {view} from "@risingstack/react-easy-state";
import {css} from "emotion";
import {FiCornerUpLeft, FiCornerUpRight, FiCrop, FiEdit3, FiImage} from "react-icons/fi";
import {app} from "../../stores/appStore";
import {historyStore} from "../../stores/historyStore";
import {annotationStore} from "../../stores/annotationStore";
import {Button} from "../ui/controls";
import {ExportControls} from "./ExportControls";
import {useImageInput} from "../../hooks/useImageInput";

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);
const shortcut = (keys: string) => isMac ? keys : keys.replace('⇧⌘', 'Ctrl+Shift+').replace('⌘', 'Ctrl+');

const styles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: var(--toolbar-height);
  padding: 0 12px;
  border-bottom: 1px solid var(--separator);
  background: var(--bg-sidebar);

  .group { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .history { gap: 2px; }
  .separator { width: 1px; height: 20px; margin: 0 4px; background: var(--separator-strong); }

  @media (max-width: 1080px) {
    .label { display: none; }
  }
  @media (max-width: 760px) {
    padding: 0 8px;
    gap: 4px;
    .separator { display: none; }
  }
`;

export const Toolbar = view(() => {
    const fileInput = useRef<HTMLInputElement>(null);
    const hasImage = !!app.imageData;

    const {openFiles} = useImageInput();
    const replace = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        event.target.value = '';
        openFiles(files);
    };

    return (
        <header className={styles}>
            <div className="group">
                <input ref={fileInput} type="file" accept="image/*" hidden onChange={replace} aria-label="Replace screenshot file"/>
                <Button disabled={!hasImage} onClick={() => fileInput.current.click()} title="Replace screenshot" aria-label="Replace">
                    <FiImage/><span className="label">Replace</span>
                </Button>
                <Button disabled={!hasImage} aria-pressed={app.cropIsActive} onClick={() => app.cropIsActive = !app.cropIsActive} title="Crop screenshot" aria-label="Crop">
                    <FiCrop/><span className="label">Crop</span>
                </Button>
            </div>
            <div className="group history">
                <Button icon variant="plain" disabled={!historyStore.canUndo} onClick={() => historyStore.undo()}
                        aria-label="Undo" title={`Undo (${shortcut('⌘Z')})`}><FiCornerUpLeft/></Button>
                <Button icon variant="plain" disabled={!historyStore.canRedo} onClick={() => historyStore.redo()}
                        aria-label="Redo" title={`Redo (${shortcut('⇧⌘Z')})`}><FiCornerUpRight/></Button>
            </div>
            <div className="group end">
                <Button disabled={!hasImage} aria-pressed={annotationStore.markupMode} title="Draw, highlight and add text" aria-label="Markup"
                        onClick={() => annotationStore.setMarkupMode(!annotationStore.markupMode)}>
                    <FiEdit3/><span className="label">Markup</span>
                </Button>
                <span className="separator" aria-hidden="true"/>
                <ExportControls/>
            </div>
        </header>
    );
});
