import {css} from "emotion";

export const styles = (): string => css`
  margin: 0 16px 16px;
  padding: 12px 14px;
  border-radius: var(--radius-l);
  background: var(--accent-soft);
  font-size: 12px;
  line-height: 1.45;

  strong { display: block; font-size: 13px; font-weight: 600; }
  p { margin: 2px 0 8px; color: var(--label-2); }
  a { color: #c9c8ff; font-weight: 500; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;
