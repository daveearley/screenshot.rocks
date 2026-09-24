# Regression checks

- `CI=true npm test -- --watch=false --runInBand`: extension payload consumption, invalid payloads, replacement crop reset, portrait detection, and empty clipboard events.
- `node tests/extension-handoff.test.js`: existing URL-encoded POST contract, validation, same-origin redirect, and session-storage failure recovery.
- `node tests/extension-background.test.js`: transfer-page readiness, single-use payloads, correct capture window, and capture errors.
- `npm run build`: TypeScript and production compilation.
- `yarn test:e2e`: Playwright end-to-end suite in `e2e/` (builds first). It serves `build/` plus the real `api/setImage` handler from `e2e/server.js`, and covers:
  - the extension POST contract (form POST → sessionStorage → `/app`, single-use payload, validation, 405 on GET);
  - the **installed** `browser-extension/` in Chromium, with `https://screenshot.rocks` routed to the local build (`post.html` handshake → form POST → editor). `captureVisibleTab` itself needs a real toolbar click, so the test stages the capture in the service worker; the click handler is covered by `tests/extension-background.test.js`;
  - upload, replace, crop, frame options for every frame type, looks (apply, save, delete), backgrounds, colour picker placement, undo/redo (buttons, ⌘/Ctrl+Z, Ctrl+Shift+Z on Windows/Linux), and no sideways overflow in the inspector;
  - markup: shapes with delete/undo, in-place text editing with lazily loaded Bunny Fonts (network stubbed), and blur that is opaque and actually blurred;
  - PNG/JPEG/WebP/SVG export, aspect ratio, and transparent backgrounds (transparent PNG, white JPEG).

  - content pages (`e2e/content.spec.ts`): every page in the sitemap returns 200 with one h1, unique title and description, a correct canonical and valid JSON-LD; every internal link and image resolves; the homepage links to all of them.

  Every test fails on uncaught page errors or on any browser `prompt`/`confirm`/`alert` dialog. Run `npx playwright install chromium` once on a new machine.

For a local browser integration check, run `npm start` and `node tests/serve-smoke.js`, then open http://localhost:3001/extension-smoke. The fixture submits the bundled demo screenshot to the real API handler and follows the redirect into the editor. It does not capture or upload a personal browser tab.

Also checked manually in the browser: browser/mobile demos, default crop application, annotation placement, tilt, PNG dimensions (1920×1200), and PNG/JPEG/SVG/WebP output. An installed Chrome extension against the deployed production site still requires a release smoke test; local checks do not deploy either component.

## Content pages (guides and tool pages)

Static HTML pages live in `site/pages/*.js` with a shared layout in `site/lib.js` and styles in `site/site.css`. Both paths render through `site/render.js`: `yarn build` runs `scripts/build-pages.js` after the React build, writing each page to `build/<path>/index.html` along with `sitemap.xml` (with image entries), `llms.txt` and `llms-full.txt` (the full text of every page, for AI assistants), and `yarn start` serves them live via `src/setupProxy.js` (restart `yarn start` after changing `setupProxy.js` itself; page content edits show on reload). To add a page, add a file to `site/pages/` and a link in the homepage footer (`src/components/layout/Homepage/index.tsx`). Example images are regenerated from the real editor with `node scripts/homepage-examples.js` (needs the build served by `node e2e/server.js`).
