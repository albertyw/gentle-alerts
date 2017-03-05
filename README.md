Gentle Alerts
=============

Google chrome extension to convert alerts into gentle notifications

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bcjaadnpjolbaginfighnpcdjmbeiahn.svg)](https://chrome.google.com/webstore/detail/gentle-alerts/bcjaadnpjolbaginfighnpcdjmbeiahn)
[![npm](https://img.shields.io/npm/v/gentle-alerts.svg)](https://www.npmjs.com/package/gentle-alerts)

[ ![Codeship Status for albertyw/gentle-alerts](https://app.codeship.com/projects/3a271aa0-d8b1-0134-15a2-326e4d300ce2/status?branch=master)](https://app.codeship.com/projects/203223)
[![Test Coverage](https://codeclimate.com/github/albertyw/gentle-alerts/badges/coverage.svg)](https://codeclimate.com/github/albertyw/gentle-alerts/coverage)
[![Code Climate](https://codeclimate.com/github/albertyw/gentle-alerts/badges/gpa.svg)](https://codeclimate.com/github/albertyw/gentle-alerts)
[![Dependency Status](https://gemnasium.com/badges/github.com/albertyw/gentle-alerts.svg)](https://gemnasium.com/github.com/albertyw/gentle-alerts)

![Gentle Alerts Icon](gentle-alerts/img/icon128.png)

I started this project after getting annoyed with Google Calendar's event
notifications.  They used to have nice soft notifications, but they broke it
when they graduated their feature from google labs and they
[haven't fixed it](https://productforums.google.com/forum/#!topic/calendar/aWfZBNKlNEQ).

The extension will replace the built-in browser alert window with a modal which
won't force you to context switch between tabs.  It also prevents you from
accidentally closing alert windows when you're typing.

You can close the modal by pressing "Enter", "Escape", or "Space".

**Contributions welcome**

Development
-----------

Gentle-Alerts does not depend on any third-party libraries (e.g. jQuery) and is
written against ES 2015 spec for browser compatibility.

Testing
-------

```
npm test
```

Packaging
---------

```
npm package
```

Upload the zip file to the
[chrome web store](https://chrome.google.com/webstore/developer/dashboard).
