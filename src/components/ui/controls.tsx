import React, {useEffect, useRef, useState} from "react";
import {css, cx} from "emotion";

export const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-s);
  background: var(--fill);
  color: var(--label);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: default;
  transition: background .15s var(--ease), opacity .15s, transform .1s;
  user-select: none;

  svg { width: 15px; height: 15px; flex-shrink: 0; }
  &:hover:not(:disabled) { background: var(--fill-hover); }
  &:active:not(:disabled) { background: var(--fill-pressed); }
  &:disabled { opacity: .38; }
  &[aria-pressed="true"] { background: var(--accent-soft); color: #c9c8ff; }

  &.primary { background: var(--accent); color: white; }
  &.primary:hover:not(:disabled) { background: var(--accent-hover); }
  &.primary:active:not(:disabled) { background: var(--accent); transform: scale(.98); }

  &.plain { background: transparent; color: var(--label-2); }
  &.plain:hover:not(:disabled) { background: var(--fill); color: var(--label); }

  &.icon { width: 28px; padding: 0; }
  &.large { height: 32px; padding: 0 14px; }
  &.large.icon { width: 32px; padding: 0; }
  &.block { width: 100%; }
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'plain', size?: 'large', icon?: boolean, block?: boolean,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({variant, size, icon, block, className, ...props}, ref) =>
    <button ref={ref} type="button" {...props} className={cx(buttonStyles, variant, size, icon && 'icon', block && 'block', className)}/>);

const segmentedStyles = css`
  position: relative;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  padding: 2px;
  border-radius: var(--radius-m);
  background: var(--fill);
  isolation: isolate;

  .indicator {
    position: absolute;
    z-index: -1;
    top: 2px;
    bottom: 2px;
    left: 2px;
    width: calc((100% - 4px) / var(--count));
    transform: translateX(calc(var(--index) * 100%));
    border-radius: 6px;
    background: var(--fill-selected);
    box-shadow: 0 1px 3px rgba(0, 0, 0, .25), inset 0 .5px 0 rgba(255, 255, 255, .08);
    transition: transform .22s var(--ease);
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 0;
    height: 24px;
    padding: 0 6px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--label-2);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color .15s;

    svg { width: 14px; height: 14px; flex-shrink: 0; }
    &:hover { color: var(--label); }
    &[aria-pressed="true"] { color: var(--label); }
  }

  &.large button { height: 28px; font-size: 13px; }
`;

export interface SegmentOption<T> {
    value: T;
    label: string;
    icon?: React.ReactNode;
}

export function Segmented<T>({options, value, onChange, label, size, className}: {
    options: SegmentOption<T>[], value: T, onChange: (value: T) => void, label: string, size?: 'large', className?: string,
}) {
    const index = Math.max(0, options.findIndex(option => option.value === value));
    return (
        <div role="group" aria-label={label} className={cx(segmentedStyles, size, className)}
             style={{'--count': options.length, '--index': index} as React.CSSProperties}>
            {options.some(option => option.value === value) && <span className="indicator" aria-hidden="true"/>}
            {options.map(option => (
                <button key={String(option.value)} type="button" aria-pressed={option.value === value}
                        onClick={() => onChange(option.value)}>
                    {option.icon}{option.label}
                </button>
            ))}
        </div>
    );
}

export const rowStyles = css`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  font-size: 13px;

  > .row-label {
    flex: 1;
    min-width: 0;
    color: var(--label-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & + & { margin-top: 6px; }
`;

export const Row = ({label, htmlFor, children}: {label: string, htmlFor?: string, children: React.ReactNode}) => (
    <div className={rowStyles}>
        <label className="row-label" htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
);

const switchStyles = css`
  position: relative;
  flex-shrink: 0;
  width: 32px;
  height: 20px;
  margin: 0;
  border-radius: 10px;
  background: var(--fill-pressed);
  appearance: none;
  -webkit-appearance: none;
  transition: background .2s var(--ease);
  cursor: default;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3);
    transition: transform .2s var(--ease);
  }

  &:checked { background: var(--accent); }
  &:checked::after { transform: translateX(12px); }
`;

export const Toggle = ({label, checked, onChange, id}: {label: string, checked: boolean, onChange: (checked: boolean) => void, id: string}) => (
    <Row label={label} htmlFor={id}>
        <input id={id} type="checkbox" role="switch" className={switchStyles} checked={checked}
               onChange={event => onChange(event.target.checked)}/>
    </Row>
);

export const fieldStyles = css`
  height: 24px;
  min-width: 0;
  padding: 0 7px;
  border: 0;
  border-radius: var(--radius-s);
  background: var(--fill);
  color: var(--label);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  transition: background .15s, box-shadow .15s;

  &:hover { background: var(--fill-hover); }
  &:focus { outline: none; background: rgba(0, 0, 0, .35); box-shadow: var(--focus-ring); }
  &::placeholder { color: var(--label-3); }
  &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  -moz-appearance: textfield;
`;

/** A number input that only commits on Enter/blur, so typing "1" on the way to "1200" does not clamp. */
export const NumberField = ({value, onCommit, min, max, label, suffix, className, id}: {
    value: number, onCommit: (value: number) => void, min: number, max: number, label: string, suffix?: string,
    className?: string, id?: string,
}) => {
    const [draft, setDraft] = useState(String(value));
    // Don't overwrite what the user is typing if the value changes elsewhere mid-edit.
    const editing = useRef(false);
    const dirty = useRef(false);
    useEffect(() => { if (!editing.current) setDraft(String(value)); }, [value]);
    const commit = () => {
        if (!dirty.current) return setDraft(String(value));
        dirty.current = false;
        const parsed = Number(draft);
        if (draft.trim() === '' || !Number.isFinite(parsed)) return setDraft(String(value));
        const clamped = Math.round(Math.min(max, Math.max(min, parsed)));
        setDraft(String(clamped));
        if (clamped !== value) onCommit(clamped);
    };
    return (
        <input id={id} className={cx(fieldStyles, className)} aria-label={label} inputMode="numeric" value={draft}
               title={suffix ? `${value}${suffix}` : undefined}
               onChange={event => { dirty.current = true; setDraft(event.target.value); }}
               onFocus={() => { editing.current = true; }}
               onBlur={() => { editing.current = false; commit(); }}
               onKeyDown={event => {
                   if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
                   if (event.key === 'Escape') { dirty.current = false; (event.target as HTMLInputElement).blur(); }
                   if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                       event.preventDefault();
                       const step = (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1);
                       const next = Math.min(max, Math.max(min, value + step));
                       setDraft(String(next));
                       onCommit(next);
                   }
               }}/>
    );
};

const sliderRowStyles = css`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  font-size: 13px;

  & + & { margin-top: 2px; }

  label { color: var(--label-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  input[type=range] {
    --from: 0%;
    --to: 50%;
    width: 100%;
    height: 20px;
    margin: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    cursor: default;

    &::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 2px;
      background: linear-gradient(to right, var(--fill-pressed) var(--from), var(--accent) var(--from), var(--accent) var(--to), var(--fill-pressed) var(--to));
    }
    &::-moz-range-track {
      height: 4px;
      border-radius: 2px;
      background: linear-gradient(to right, var(--fill-pressed) var(--from), var(--accent) var(--from), var(--accent) var(--to), var(--fill-pressed) var(--to));
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      margin-top: -6px;
      border: 0;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .4), 0 0 0 .5px rgba(0, 0, 0, .15);
      transition: transform .12s var(--ease);
    }
    &::-moz-range-thumb {
      width: 16px; height: 16px; border: 0; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
    }
    &:active::-webkit-slider-thumb { transform: scale(1.1); }
    &:focus, &:focus-visible { outline: none; box-shadow: none; }
    &:focus-visible::-webkit-slider-thumb { box-shadow: var(--focus-ring); }
    &:focus-visible::-moz-range-thumb { box-shadow: var(--focus-ring); }
  }

  .value { width: 44px; text-align: right; }
`;

export const SliderRow = ({label, value, min, max, step = 1, onChange, onStart, defaultValue, id, suffix = ''}: {
    label: string, value: number, min: number, max: number, step?: number, onChange: (value: number) => void,
    onStart?: () => void, defaultValue?: number, id: string, suffix?: string,
}) => {
    const numeric = Number(value);
    const pct = ((numeric - min) / (max - min)) * 100;
    // Record the undo step on the first real change, not on a click that changes nothing.
    const pending = useRef(false);
    const origin = min < 0 && max > 0 ? (-min / (max - min)) * 100 : 0;
    const [from, to] = [Math.min(origin, pct), Math.max(origin, pct)];
    return (
        <div className={sliderRowStyles}>
            <label htmlFor={id}>{label}</label>
            <input id={id} type="range" min={min} max={max} step={step} value={numeric}
                   style={{'--from': `${from}%`, '--to': `${to}%`} as React.CSSProperties}
                   title={defaultValue !== undefined ? 'Double-click to reset' : undefined}
                   onPointerDown={() => { pending.current = true; }}
                   onPointerUp={() => { pending.current = false; }}
                   onKeyDown={event => { if (event.key.startsWith('Arrow') && !event.repeat) pending.current = true; }}
                   onDoubleClick={() => {
                       if (defaultValue === undefined || defaultValue === numeric) return;
                       onStart && onStart();
                       onChange(defaultValue);
                   }}
                   onChange={event => {
                       if (pending.current) { pending.current = false; onStart && onStart(); }
                       onChange(Number(event.target.value));
                   }}/>
            <NumberField className="value" label={`${label} value`} value={Math.round(numeric)} min={min} max={max} suffix={suffix}
                         onCommit={next => { onStart && onStart(); onChange(next); }}/>
        </div>
    );
};

const sectionStyles = css`
  padding: 14px 16px 16px;
  border-top: 1px solid var(--separator);

  &:first-of-type { border-top: 0; }

  > header {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 20px;
    margin-bottom: 10px;
  }

  > header h2 {
    margin: 0;
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    color: var(--label);
  }

  > header .disclosure {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0 -4px;
    padding: 0 4px;
    border: 0;
    border-radius: 4px;
    background: none;
    color: inherit;
    text-align: left;

    svg { width: 12px; height: 12px; color: var(--label-3); transition: transform .2s var(--ease); }
    &[aria-expanded="false"] svg { transform: rotate(-90deg); }
  }

  &.collapsed { padding-bottom: 14px; }
  &.collapsed > header { margin-bottom: 0; }

  .subheading {
    margin: 14px 0 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--label-3);
    text-transform: uppercase;
    letter-spacing: .04em;
  }
`;

const readCollapsed = (id: string) => {
    try { return localStorage.getItem(`section:${id}`) === 'collapsed'; } catch (_) { return false; }
};

export const Section = ({id, title, accessory, children, collapsible = true}: {
    id: string, title: string, accessory?: React.ReactNode, children: React.ReactNode, collapsible?: boolean,
}) => {
    const [collapsed, setCollapsed] = useState(() => collapsible && readCollapsed(id));
    const toggle = () => {
        setCollapsed(!collapsed);
        try { localStorage.setItem(`section:${id}`, !collapsed ? 'collapsed' : 'open'); } catch (_) { /* optional */ }
    };
    return (
        <section className={cx(sectionStyles, collapsed && 'collapsed')} aria-labelledby={`section-${id}`}>
            <header>
                <h2 id={`section-${id}`}>
                    {collapsible
                        ? <button type="button" className="disclosure" aria-expanded={!collapsed} onClick={toggle}>
                            {title}
                            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        : title}
                </h2>
                {!collapsed && accessory}
            </header>
            {!collapsed && children}
        </section>
    );
};
