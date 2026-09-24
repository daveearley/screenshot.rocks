import {useEffect} from 'react';
import {historyStore} from '../stores/historyStore';
import {annotationStore} from '../stores/annotationStore';
import {app} from '../stores/appStore';
import {MARKUP_SHORTCUTS} from '../components/MarkupBar';

const isMac = () => /mac/i.test(navigator.platform);

const isTyping = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    return !!element && (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) || element.isContentEditable);
};

export function useKeyboardShortcuts() {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (isTyping(event.target) || app.cropIsActive) return;
            const key = event.key.toLowerCase(); // Shift turns "z" into "Z" on Windows and Linux
            const command = isMac() ? event.metaKey : event.ctrlKey;

            if (command && key === 'z') {
                event.preventDefault();
                if (event.shiftKey) historyStore.redo(); else historyStore.undo();
                return;
            }
            if (command && key === 'y') {
                event.preventDefault();
                historyStore.redo();
                return;
            }
            if (command || event.altKey) return;

            if ((event.key === 'Delete' || event.key === 'Backspace') && annotationStore.selectedAnnotationId) {
                event.preventDefault();
                annotationStore.deleteAnnotation(annotationStore.selectedAnnotationId);
                return;
            }

            if (event.key === 'Escape') {
                if (annotationStore.isDrawing) annotationStore.cancelDrawing();
                else if (annotationStore.selectedAnnotationId) annotationStore.selectAnnotation(null);
                else if (annotationStore.activeTool) annotationStore.setActiveTool(null);
                else if (annotationStore.markupMode) annotationStore.setMarkupMode(false);
                return;
            }

            if (annotationStore.markupMode && key in MARKUP_SHORTCUTS && !event.shiftKey) {
                annotationStore.setActiveTool(MARKUP_SHORTCUTS[key]);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);
}
