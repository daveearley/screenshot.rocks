import React from "react";
import {createPortal} from "react-dom";
import {store, view} from "@risingstack/react-easy-state";
import {css} from "emotion";

const toastState = store({message: '', tone: 'info' as 'info' | 'error', id: 0});
let timer: number | undefined;

export const showToast = (message: string, tone: 'info' | 'error' = 'info') => {
    toastState.message = message;
    toastState.tone = tone;
    toastState.id++;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => toastState.message = '', tone === 'error' ? 4000 : 2200);
};

const styles = css`
  position: fixed;
  z-index: 1100;
  left: 50%;
  top: 64px;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(44, 44, 46, .92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-popover);
  color: var(--label);
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
  animation: toast-in .2s var(--ease);

  &.error { color: #ffb4ae; }

  @keyframes toast-in {
    from { opacity: 0; transform: translate(-50%, -6px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;

export const Toast = view(() => toastState.message
    ? createPortal(<div key={toastState.id} role="status" className={`${styles} ${toastState.tone}`}>{toastState.message}</div>, document.body)
    : null);
