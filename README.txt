EMRS Attendance V3 - Modular File Structure

Files:
- index.html: main page structure
- css/style.css: app styling and six existing themes
- js/students.js: initial student roster and vacant-slot generation
- js/settings.js: theme, password and class/student settings functions
- js/reports.js: Excel export and print/PDF functions
- js/app.js: login, attendance interactions, class tabs, profile and service worker registration
- manifest.json, service-worker.js, icon-192.png, icon-512.png, emrs-logo.jpg: existing PWA assets

Run/deploy: Keep the directory structure intact. Open index.html in a local web server or deploy the entire folder.
The app uses Tailwind CDN and SheetJS CDN, so those features require internet unless dependencies are bundled locally.

Important existing limitations preserved for review:
- Password 2013 is a client-side app lock, not secure server authentication.
- Data is stored in localStorage on each device; no cross-device sync or central database.
- Attendance is currently stored as a current status in the saved roster, not as a date-indexed attendance history.
- This modularization separates files; it does not intentionally add new features or change student records.

Dashboard update: first KPI row shows Total Students, Total Absent, Total Present; second row shows Class Present, Class Absent, Class Late. Each tile is clickable and filters the student cards; global tiles cover all classes and class tiles cover the selected class. Login title is EMRS Boys Hostel Attendance, with Eklavya Model Residential School beneath it.


UPDATED FEATURES (V4)
- Compact mobile-first header and tighter small-screen spacing.
- Date-wise attendance history saved locally in the browser.
- Student profile includes recorded-day absence streak, current-month/year attendance percentage, and recent saved history. Present and Late count as attended; missing dates are not assumed absent.
- History viewer with date/class filters and Excel export (CSV fallback if SheetJS is unavailable).
- JSON backup and restore for roster, history, theme and app password setting. Restore downloads a pre-restore backup and asks for confirmation.

IMPORTANT DATA LIMITATIONS
- Existing old statuses had no reliable date history. The app cannot recreate past daily attendance that was never saved. The first new history snapshot uses the current roster statuses for the current date; verify today's statuses before relying on percentages.
- History and backups are stored locally per browser/device. GitHub Pages does not sync records across phones. Use a central database for cross-device synchronization.
- The app password is a client-side lock, not server-side authentication. Treat backup JSON files as sensitive.
- Test backup/restore and daily attendance workflows before production use.
