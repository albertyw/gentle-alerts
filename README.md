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

I started this project after getting annoyed with Google Calendar's event
notifications.  They used to have nice soft notifications, but they broke it
when they graduated the feature from Google Labs.

The extension replaces the built-in browser alert window with a modal that
won't force you to context switch between tabs.  It also prevents you from
accidentally dismissing alerts while typing.

Close the modal by pressing `Enter`, `Escape`, or `Space`.  Opening it plays
an [audio chime](https://notificationsounds.com/message-tones/just-like-that-404).

**Contributions welcome.**

## Development

Gentle Alerts has no runtime dependencies and targets ES2015 for browser
compatibility.

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
