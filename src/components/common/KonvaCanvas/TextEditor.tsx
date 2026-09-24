import React, {useLayoutEffect, useRef, useState} from 'react';
import {view} from '@risingstack/react-easy-state';
import {css} from 'emotion';
import {annotationStore} from '../../../stores/annotationStore';
import {getFont} from '../../../utils/fonts';

const styles = css`
  position: absolute;
  z-index: 2;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 2px dashed rgba(94, 92, 230, .9);
  outline-offset: 6px;
  background: transparent;
  resize: none;
  overflow: hidden;
  white-space: pre;
  line-height: 1.15;
  caret-color: currentColor;

  &::placeholder { color: currentColor; opacity: .45; }
`;

/** Enter or Escape commits, Shift+Enter adds a line, and an empty box is discarded. */
export const TextEditor = view(() => {
    const editing = annotationStore.editingText;
    const existing = editing?.id ? annotationStore.annotations.find(a => a.id === editing.id) : null;
    const [value, setValue] = useState(existing?.text || '');
    const ref = useRef<HTMLTextAreaElement>(null);
    const done = useRef(false);

    const font = getFont(existing ? existing.fontId : annotationStore.activeFontId);
    const fontSize = existing ? existing.fontSize : annotationStore.activeFontSize;
    const bold = (existing ? existing.bold !== false : annotationStore.activeBold) && font.boldable;
    const color = existing ? existing.color : annotationStore.activeColor;

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.width = `${Math.max(fontSize * 2, element.scrollWidth + fontSize * .2)}px`;
        element.style.height = `${element.scrollHeight}px`;
    });

    useLayoutEffect(() => {
        ref.current?.focus();
        ref.current?.select();
    }, []);

    if (!editing) return null;

    const finish = (commit: boolean) => {
        if (done.current) return;
        done.current = true;
        if (commit) annotationStore.commitText(value); else annotationStore.cancelTextEditing();
    };

    return (
        <textarea ref={ref} className={styles} data-export-exclude="true" aria-label="Annotation text" placeholder="Text"
                  rows={1} spellCheck={false} value={value}
                  style={{left: editing.x, top: editing.y, fontSize, fontFamily: font.family, fontWeight: bold ? 700 : 400, color}}
                  onChange={event => setValue(event.target.value)}
                  onBlur={() => finish(true)}
                  onPointerDown={event => event.stopPropagation()}
                  onKeyDown={event => {
                      event.stopPropagation();
                      if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); finish(true); }
                      if (event.key === 'Escape') { event.preventDefault(); finish(true); }
                  }}/>
    );
});
