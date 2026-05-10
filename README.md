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

Gentle Alerts replaces the harsh, attention-stealing native `alert()`,
`confirm()`, and `prompt()` dialogs that web pages can pop up with calmer,
in-page modals that respect what you're doing.

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

- **Intercepts native dialogs.**  `window.alert`, `window.confirm`, and
  `window.prompt` are replaced with a styled in-page modal that delivers the
  same message and return value the calling page expects.
- **No forced tab switch.**  Background tabs no longer steal focus when they
  fire an alert.  The notification waits in its own tab.
- **Plays a soft chime.**  When a modal opens it plays a gentle notification
  sound so you know something needs your attention without being startled.
- **Keyboard friendly.**  Dismiss the modal with `Enter`, `Escape`, or
  `Space`.  No mouse aim required.
- **Resists accidental dismissal.**  The modal won't close from a stray
  click or keystroke while you're typing — useful when an alert fires in the
  middle of an email or chat.
- **Works everywhere.**  It runs on every page (`<all_urls>`) and is
  particularly nice for Google Calendar event reminders, internal dashboards,
  and any legacy app that still uses `alert()`-based notifications.

### Why it exists

This project began as a fix for Google Calendar's event reminders.  Calendar
used to show a soft, non-blocking notification when an event was about to
start.  When the feature graduated from Google Labs, that gentle reminder
was replaced with a hard browser alert that hijacks the foreground tab.
Gentle Alerts brings the calmer behavior back — not just for Calendar, but
for every site that still relies on native dialogs.

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
framework.  The extension is a small set of vanilla JavaScript, CSS, and
HTML files bundled with webpack.  Source is written as ES modules and
linted against `ecmaVersion: 2022`; webpack does not transpile, so the
shipped code runs directly on whatever ECMAScript version the host Chrome
supports (Manifest V3 already requires a recent Chrome, so modern syntax
is safe).

### Layout

- `gentle-alerts/` — the extension itself (the directory that gets zipped
  and uploaded to the Chrome Web Store).
  - `manifest.json` — Manifest V3 declaration.
  - `bootstrap.js` — content script registered for `<all_urls>`; injects
    `gentle-alerts.min.js` into the page.
  - `script.js` — main source; intercepts `alert`/`confirm`/`prompt` and
    renders the modal.
  - `gentle-alerts.css` — modal styling.
  - `notification.ogg` — chime played when a modal opens.
  - `options.htm` / `options.js` — preferences page.
- `test/` — WebdriverIO browser tests run with Mocha + Chai + Sinon.
- `webpack.config.js` — bundles `script.js` to
  `gentle-alerts/gentle-alerts.min.js`.
- `.eslint.config.js` — flat ESLint config.

### Setup

```
pnpm install
```

Node >=18 is required (see `engines` in `package.json`).

### Common commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `pnpm run build`    | Bundle `script.js` to `gentle-alerts.min.js`        |
| `pnpm run eslint`   | Lint the extension and tests                        |
| `pnpm run wdio`     | Run the WebdriverIO browser test suite              |
| `pnpm test`         | `build` + `eslint` + `wdio`                         |
| `pnpm run package`  | Clean, build, and produce `gentle-alerts.zip`       |
| `pnpm run clean`    | Remove the built bundle and packaged zip            |

### Loading the extension locally

1. `pnpm run build` to produce `gentle-alerts/gentle-alerts.min.js`.
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
