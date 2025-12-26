<p align="center">
  <img src="gentle-alerts/img/logo128x128.png">
</p>

Gentle Alerts
=============

Google chrome extension to convert alerts into gentle notifications

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bcjaadnpjolbaginfighnpcdjmbeiahn.svg)](https://chrome.google.com/webstore/detail/gentle-alerts/bcjaadnpjolbaginfighnpcdjmbeiahn)
[![npm](https://img.shields.io/npm/v/gentle-alerts.svg)](https://www.npmjs.com/package/gentle-alerts)

[![Build Status](https://drone.albertyw.com/api/badges/albertyw/gentle-alerts/status.svg)](https://drone.albertyw.com/albertyw/gentle-alerts)
[![Maintainability](https://qlty.sh/gh/albertyw/projects/gentle-alerts/maintainability.svg)](https://qlty.sh/gh/albertyw/projects/gentle-alerts)
[![Code Coverage](https://qlty.sh/gh/albertyw/projects/gentle-alerts/coverage.svg)](https://qlty.sh/gh/albertyw/projects/gentle-alerts)
[![install size](https://packagephobia.com/badge?p=gentle-alerts)](https://packagephobia.com/result?p=gentle-alerts)

I started this project after getting annoyed with Google Calendar's event
notifications.  They used to have nice soft notifications, but they broke it
when they graduated their feature from google labs and they
[haven't fixed it](https://productforums.google.com/forum/#!topic/calendar/aWfZBNKlNEQ).

The extension will replace the built-in browser alert window with a modal which
won't force you to context switch between tabs.  It also prevents you from
accidentally closing alert windows when you're typing.

You can close the modal by pressing "Enter", "Escape", or "Space".  When
opening, it has an [audio chime](https://notificationsounds.com/message-tones/just-like-that-404).

**Contributions welcome**

Development
-----------

Gentle-Alerts does not depend on any third-party libraries (e.g. jQuery) and is
written against ES 2015 spec for browser compatibility.

Testing
-------

```
pnpm test
```

Releasing a new version
-----------------------

1. Update Changelog
2. Update gentle-alerts/manifest.json with new version
3. Update package.json with new version
4. Commit a new release
5. Tag and push the commit
6. `pnpm run package`
7. Upload the zip file to the [chrome web store](https://chrome.google.com/webstore/developer/dashboard)

Design
------

The logo is from [logodust](http://www.logodust.com/).  The background color is `rgb(132, 192, 215)`:

![84c0d7](https://via.placeholder.com/150/84c0d7?text=84c0d7)
