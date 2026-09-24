# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Screenshot.Rocks is a web application for creating beautiful mobile and browser mockups from screenshots. It has Browser, iPhone and plain Image frames, customizable backgrounds, markup (text, shapes, arrows, numbered steps, blur) and export to PNG/JPEG/WebP/SVG. The site also has static guide and tool pages for SEO.

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server (runs on 0.0.0.0)
yarn start

# Production build
yarn build

# Run tests
yarn test

# Package browser extension
make package-browser-extension

# Deploy Lambda function (requires AWS CLI configured)
make deploy-lambda
```

Note: The start and build scripts include `--openssl-legacy-provider` flag for Node.js compatibility.

## Architecture

### State Management

Uses **React-Easy-State** (observable/reactive pattern) instead of Redux or Context:
- `src/stores/appStore.ts` - Main application state (image data, canvas styles, UI state, annotations)
- `src/stores/browserStore.ts` - Browser frame settings (URL bar, themes)
- `src/stores/phoneStore.ts` - Phone device themes and aspect ratios
- `src/stores/twitterStore.ts` - Twitter frame settings
- `src/stores/noFrameStore.ts` - No-frame mode settings
- `src/stores/routeStore.ts` - Simple client-side routing

Components use the `view()` HOC from React-Easy-State to reactively re-render when store values change.

### Frame Types

Each frame type (`ScreenshotType` enum) has its own component in `src/components/common/Frames/`:
- `Browser/` - Desktop browser mockup with customizable browser chrome
- `Phone/` - iPhone frame (finishes, Dynamic Island, screen alignment)
- `NoFrame/` - Simple image with background
- `Twitter/` - Twitter post mockup (not reachable from the UI)

### Key Components

- `src/components/Inspector/` - Sidebar: Looks, Frame, Background and Layout sections
- `src/components/Toolbar/` - Replace, Crop, undo/redo, Markup, Copy and Export
- `src/components/MarkupBar/` - Markup tools; drawing happens in `common/KonvaCanvas/`
- `src/components/ui/` - Shared controls (buttons, segmented control, sliders, popover, color well, toast)
- `common/Canvas/` - The DOM canvas the frame renders into; the Konva annotation stage sits on top
- `common/ImageSelector/` - The editor's empty state (drop, paste, website capture, demos)
- `common/CropModal/` - Image cropping interface using react-image-crop

### Image Processing

- Images are stored as base64 data URLs in `appStore.imageData`
- Export uses `dom-to-image` to rasterize `#canvas` (frame DOM plus the Konva annotation canvases); every format starts from a flattened PNG
- Annotations live in `annotationStore` and are drawn with Konva; undo/redo is `historyStore` (snapshots of settings and annotations)

### Styling

Uses **Emotion** CSS-in-JS throughout. Styles are co-located with components using the `css` prop or `styled` components.

## Project Structure

```
src/
├── components/
│   ├── layout/          # App shell and homepage
│   └── common/          # Reusable components (Canvas, Frames, Settings, etc.)
├── stores/              # React-Easy-State stores
├── utils/               # Helper functions (image processing, URL validation)
├── values/              # Constants (device colors, dimensions)
├── hooks/               # Custom React hooks
└── types.ts             # TypeScript enums (ScreenshotType, CanvasBackgroundTypes, etc.)

site/                    # Static guide/tool pages (site/pages/*.js), rendered by site/render.js
scripts/                 # build-pages.js (runs after the React build), homepage-examples.js
e2e/                     # Playwright tests (yarn test:e2e)
browser-extension/       # Manifest V3 browser extension
screenshot-lambda/       # AWS Lambda for URL-to-screenshot
api/                     # Vercel serverless functions
```

## Browser Extension

Located in `browser-extension/`. Uses Manifest V3. One-click capture that opens main app with screenshot data via sessionStorage.

## Lambda Function

`screenshot-lambda/` contains a Puppeteer-based function for capturing screenshots from URLs. Uses chrome-aws-lambda for headless Chrome in AWS Lambda environment.
