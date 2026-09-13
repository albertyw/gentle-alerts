<p align="center">
  <img src="gentle-alerts/img/logo128x128.png">
</p>

# Gentle Alerts

Google Chrome extension to convert alerts into gentle notifications.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bcjaadnpjolbaginfighnpcdjmbeiahn.svg)](https://chrome.google.com/webstore/detail/gentle-alerts/bcjaadnpjolbaginfighnpcdjmbeiahn)
[![npm](https://img.shields.io/npm/v/gentle-alerts.svg)](https://www.npmjs.com/package/gentle-alerts)

[![Build Status](https://drone.albertyw.com/api/badges/albertyw/gentle-alerts/status.svg)](https://drone.albertyw.com/albertyw/gentle-alerts)
[![Maintainability](https://qlty.sh/gh/albertyw/projects/gentle-alerts/maintainability.svg)](https://qlty.sh/gh/albertyw/projects/gentle-alerts)
[![Code Coverage](https://qlty.sh/gh/albertyw/projects/gentle-alerts/coverage.svg)](https://qlty.sh/gh/albertyw/projects/gentle-alerts)
[![install size](https://packagephobia.com/badge?p=gentle-alerts)](https://packagephobia.com/result?p=gentle-alerts)

## About

Gentle Alerts replaces the harsh, attention-stealing native `alert()`
dialogs that web pages can pop up with calmer, in-page modals that respect
what you're doing.

The native browser alert is a blunt instrument.  When a page calls it, the
browser yanks focus to the tab, freezes the page, blocks every other tab in
the same process, and demands an immediate click before you can do anything
else.  A stray alert from a background tab can interrupt typing, swallow
keystrokes, and force a context switch you didn't ask for.  Worse, because
the alert appears exactly where your cursor lives, it's easy to dismiss one
by accident — losing whatever message it was trying to deliver.

Gentle Alerts intercepts those calls and shows the message in a soft,
in-page modal instead.  The page keeps running, your other tabs stay
responsive, and the modal waits patiently in the tab where it was created
until you actually look at it.

### What it does

- **Intercepts native alerts.**  `window.alert` is replaced with a styled
  in-page modal that shows the same message.  Multiple alerts are queued and
  shown one at a time.  `window.confirm` and `window.prompt` are left
  untouched.
- **No forced tab switch.**  Background tabs no longer steal focus when they
  fire an alert.  The notification waits in its own tab.
- **Gets your attention gently.**  When a modal opens it plays a soft chime
  and flashes the tab title with " - Alert" so you can spot which tab needs
  you.  The chime can be set to play once, repeat, or stay silent.
- **Easy to dismiss.**  Close the modal with `Enter`, `Escape`, or `Space`,
  or by clicking the dimmed area around it.
- **Closes on its own.**  Unattended modals close automatically after 30
  minutes by default.  The timeout is configurable, or can be disabled.
- **Works everywhere.**  It runs on every page (`<all_urls>`) and is
  particularly nice for Google Calendar event reminders, internal dashboards,
  and any legacy app that still uses `alert()`-based notifications.

### Why it exists

This project began as a fix for Google Calendar's event reminders.  Calendar
used to show a soft, non-blocking notification when an event was about to
start.  When the feature graduated from Google Labs, that gentle reminder
was replaced with a hard browser alert that hijacks the foreground tab.
Gentle Alerts brings the calmer behavior back — not just for Calendar, but
for every site that still relies on native alerts.

### Privacy

Gentle Alerts does not collect, transmit, or sell your data.  It does not
read page content, does not track browsing history, and does not phone
home.  The only things it stores are your own preferences, kept locally in
your browser.  See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

### Open source

Gentle Alerts is MIT licensed and developed in the open at
<https://github.com/albertyw/gentle-alerts>.  Bug reports, feature
requests, and pull requests are welcome.

**Contributions welcome.**

## Development

Gentle Alerts has no runtime dependencies — no jQuery, no React, no
framework.  The extension is a small set of vanilla TypeScript, CSS, and
HTML files bundled with webpack.  Source is written as ES modules and
compiled with `strict` type checking; webpack targets ES2022 and does not
down-level, so the shipped code runs directly on whatever ECMAScript
version the host browser supports (Manifest V3 already requires a recent
browser, so modern syntax is safe).

### Layout

- `gentle-alerts/` — the extension itself (the directory that gets zipped
  and uploaded to the Chrome Web Store).
  - `manifest.json` — Manifest V3 declaration.  It registers two content
    scripts for `<all_urls>` at `document_start`: `bootstrap.js` in the
    isolated world and `gentle-alerts.min.js` in the page's main world.
    Injecting the main-world script from the manifest, rather than appending
    a `<script src="chrome-extension://…">` tag to the page, keeps the
    extension out of the page's DevTools Network list and out of
    `web_accessible_resources`, which no longer exists.
  - `bootstrap.ts` — the isolated-world half.  The main world has no
    `chrome.*` APIs, so this reads the user's options out of
    `chrome.storage.sync` and hands them to `script.ts` over a DOM event
    (`gentle-alerts-config`, with a JSON string detail).
  - `script.ts` — main source; intercepts `alert` and renders the modal.  It
    overrides `window.alert` immediately using the defaults in `config.ts`,
    then applies the real options when they arrive.
  - `config.ts` — the vocabulary the two worlds share: event names, the
    stored option shape, and the defaults.
  - `gentle-alerts.css` — modal styling.  Bundled into `gentle-alerts.min.js`
    as text and injected as a `<style>` element on the first alert, so pages
    without alerts are left untouched.
  - `notification.ogg` — chime played when a modal opens.  Bundled as a
    `data:` URI so playing it makes no network request.
  - `options.htm` / `options.ts` — preferences page.
- `test/` — WebdriverIO browser tests run with Mocha + Chai + Sinon.
- `webpack.config.ts` — compiles `script.ts`, `bootstrap.ts`, and
  `options.ts` into `gentle-alerts/`.  `bootstrap.js` and `options.js` are
  loaded directly by the browser, so they are emitted under those exact
  names rather than bundled into `gentle-alerts.min.js`.
- `tsconfig.json` — strict TypeScript configuration.
- `.eslint.config.ts` — flat ESLint config, with `typescript-eslint`.

### Setup

```
pnpm install
```

Node >=18 is required (see `engines` in `package.json`).

### Common commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `pnpm run build`    | Compile the TypeScript sources into `gentle-alerts/` |
| `pnpm run eslint`   | Type check with `tsc` and lint the extension and tests |
| `pnpm run wdio`     | Run the WebdriverIO browser test suite              |
| `pnpm test`         | `build` + `eslint` + `wdio`                         |
| `pnpm run package`  | Clean, build, and produce `gentle-alerts.zip`       |
| `pnpm run clean`    | Remove the built bundle and packaged zip            |

### Loading the extension locally

1. `pnpm run build` to produce the compiled files in `gentle-alerts/`.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the `gentle-alerts/` directory.
4. Visit any page that calls `alert()` — for example, open DevTools and
   run `alert("hello")` — to see the modal.

## Testing

```
pnpm test
```

## Releasing a New Version

1. Update `CHANGELOG.md`
2. Bump the version in `gentle-alerts/manifest.json` and `package.json`
3. Commit and tag the release
4. Run `pnpm run package` to build `gentle-alerts.zip`
5. Upload the zip to the [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard)

## Design

The logo is from [logodust](http://www.logodust.com/).  The background color
is `#84c0d7` (`rgb(132, 192, 215)`):

![#84c0d7](https://img.shields.io/badge/%20%20%20%2384c0d7%20%20%20-%2384c0d7?style=for-the-badge)
