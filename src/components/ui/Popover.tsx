import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {css} from "emotion";

const MARGIN = 8;
const GAP = 6;

/** Open popovers, innermost last, so nested popovers (a picker inside a menu) close one at a time. */
const openStack: {current: HTMLDivElement | null}[] = [];

const popoverStyles = css`
  position: fixed;
  z-index: 1000;
  background: var(--bg-popover);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-popover);
  color: var(--label);
  font-size: 13px;
  transform-origin: top center;
  animation: popover-in .14s var(--ease);
  max-height: calc(100vh - ${MARGIN * 2}px);
  overflow: auto;

  @keyframes popover-in {
    from { opacity: 0; transform: scale(.97) translateY(-2px); }
    to { opacity: 1; transform: none; }
  }
`;

interface PopoverProps {
    anchor: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    placement?: 'bottom' | 'top' | 'right';
    align?: 'start' | 'center' | 'end';
    className?: string;
    label?: string;
}

/** Rendered in a portal so scrolling containers like the sidebar can't clip it. */
export const Popover = ({anchor, open, onClose, children, placement = 'bottom', align = 'start', className = '', label}: PopoverProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{top: number, left: number} | null>(null);
    // Callers pass inline callbacks; keep the latest in a ref so re-renders don't re-register (and re-stack) this popover.
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const reposition = useCallback(() => {
        if (!anchor || !ref.current) return;
        const a = anchor.getBoundingClientRect();
        const {offsetWidth: w, offsetHeight: h} = ref.current;
        const vw = window.innerWidth, vh = window.innerHeight;
        let top: number, left: number;

        if (placement === 'right') {
            left = a.right + GAP;
            if (left + w > vw - MARGIN) left = a.left - w - GAP;
            top = a.top;
        } else {
            const below = a.bottom + GAP, above = a.top - h - GAP;
            const fitsBelow = below + h <= vh - MARGIN, fitsAbove = above >= MARGIN;
            top = placement === 'top' ? (fitsAbove || !fitsBelow ? above : below) : (fitsBelow || !fitsAbove ? below : above);
            left = align === 'start' ? a.left : align === 'end' ? a.right - w : a.left + a.width / 2 - w / 2;
        }
        setPosition({
            top: Math.max(MARGIN, Math.min(top, vh - h - MARGIN)),
            left: Math.max(MARGIN, Math.min(left, vw - w - MARGIN)),
        });
    }, [anchor, placement, align]);

    useLayoutEffect(() => {
        if (open) reposition(); else setPosition(null);
    }, [open, reposition]);

    const placed = !!position;
    useEffect(() => {
        const element = ref.current;
        if (!open || !placed || !element || element.contains(document.activeElement)) return;
        const target = element.querySelector<HTMLElement>('[role^="menuitem"][aria-checked="true"]')
            || element.querySelector<HTMLElement>('input, button, textarea, [tabindex]:not([tabindex="-1"])');
        target?.focus({preventScroll: true});
    }, [open, placed]);

    useEffect(() => {
        if (!open) return;
        const entry = ref;
        openStack.push(entry);
        // Return focus to the anchor on close, unless the user clicked elsewhere.
        let hadFocus = false;
        let closedByPointer = false;
        const element = ref.current;
        const onFocusIn = () => { hadFocus = true; };
        const onFocusOut = (event: FocusEvent) => {
            if (event.relatedTarget && !element?.contains(event.relatedTarget as Node)) hadFocus = false;
        };
        element?.addEventListener('focusin', onFocusIn);
        element?.addEventListener('focusout', onFocusOut);
        const isTopmost = () => openStack[openStack.length - 1] === entry;
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (ref.current?.contains(target) || anchor?.contains(target)) return;
            // Clicks inside a popover opened from this one belong to it.
            const nested = openStack.slice(openStack.indexOf(entry) + 1);
            if (nested.some(child => child.current?.contains(target))) return;
            closedByPointer = true;
            onCloseRef.current();
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (!isTopmost()) return;
            const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') || []);
            if (items.length && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();
                const index = items.indexOf(document.activeElement as HTMLElement);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
                    : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                items[next].focus();
                return;
            }
            if (event.key !== 'Escape') return;
            // Keep Escape from also reaching the editor's shortcuts (deselect, leave markup).
            event.stopImmediatePropagation();
            event.stopPropagation();
            onCloseRef.current();
        };
        const Observer = (window as any).ResizeObserver; // not in TypeScript 3.7's DOM typings
        const observer = Observer && ref.current ? new Observer(reposition) : null;
        if (observer && ref.current) observer.observe(ref.current);
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown, true);
        window.addEventListener('resize', reposition);
        window.addEventListener('scroll', reposition, true);
        return () => {
            openStack.splice(openStack.indexOf(entry), 1);
            element?.removeEventListener('focusin', onFocusIn);
            element?.removeEventListener('focusout', onFocusOut);
            if (hadFocus && !closedByPointer) anchor?.focus({preventScroll: true});
            observer?.disconnect();
            document.removeEventListener('pointerdown', onPointerDown, true);
            document.removeEventListener('keydown', onKeyDown, true);
            window.removeEventListener('resize', reposition);
            window.removeEventListener('scroll', reposition, true);
        };
    }, [open, anchor, reposition]);

    if (!open) return null;
    return createPortal(
        <div ref={ref} role="dialog" aria-label={label} data-export-exclude="true"
             className={`${popoverStyles} ${className}`}
             style={position ? {top: position.top, left: position.left} : {top: -9999, left: -9999}}>
            {children}
        </div>,
        document.body,
    );
};
