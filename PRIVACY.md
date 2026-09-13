# Privacy Policy

_Last updated: 2026-09-12_

This privacy policy describes how the **Gentle Alerts** Chrome extension
("the extension") handles information.

## Data Storage

The extension does **not** collect, store, or transmit any personal
information.  It does not maintain a user account, does not send data to any
server of its own, and does not read or save the contents of the web pages
you visit.

The only data the extension saves is your preferences (the notification
sound frequency and the auto-close timeout).  These are saved with Chrome's
built-in sync storage, so if you are signed in to Chrome with sync enabled,
Google syncs them to your other signed-in browsers.  If sync is off, they
stay in your local browser profile.

## Analytics

The extension itself does not include any analytics code.  However, the
Chrome Web Store Developer Dashboard automatically provides aggregated
**Google Analytics** statistics about extension installs, uninstalls, and
listing impressions.  This data is collected by Google as part of the
Chrome Web Store and is not under the direct control of this extension.

For details on how Google handles this data, see Google's privacy policy:
<https://policies.google.com/privacy>.

## Permissions

The extension requests the following Chrome permissions:

- Access to all sites (`<all_urls>`, through its content scripts) — required
  to replace native browser alerts with the gentle-alert modal on any page.
- `storage` — used to save your preferences.  They are synced by Chrome to
  your other signed-in browsers when Chrome sync is enabled, and are never
  sent anywhere else.

## Third Parties

Aside from Google Analytics and Chrome sync described above, the extension
does not share data with any third party.

## Contact

Questions about this policy can be filed as an issue at
<https://github.com/albertyw/gentle-alerts/issues>.
