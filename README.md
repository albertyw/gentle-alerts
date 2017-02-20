Gentle Alerts
=============

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bcjaadnpjolbaginfighnpcdjmbeiahn.svg)](https://chrome.google.com/webstore/detail/gentle-alerts/bcjaadnpjolbaginfighnpcdjmbeiahn)

[![Code Climate](https://codeclimate.com/github/albertyw/gentle-alerts/badges/gpa.svg)](https://codeclimate.com/github/albertyw/gentle-alerts)
[ ![Codeship Status for albertyw/gentle-alerts](https://app.codeship.com/projects/3a271aa0-d8b1-0134-15a2-326e4d300ce2/status?branch=master)](https://app.codeship.com/projects/203223)

Google chrome extension to convert alerts into gentle notifications

I started this project after getting annoyed with Google Calendar's event
notifications.  They used to have nice soft notifications, but they broke it
when they graduated their feature from google labs and they
[haven't fixed it](https://productforums.google.com/forum/#!topic/calendar/aWfZBNKlNEQ).

Packaging
---------

Run this and upload the zip file to the
[chrome web store](https://chrome.google.com/webstore/developer/dashboard).

```
git ls-files | grep gentle-alerts | xargs zip gentle-alerts.zip
```
