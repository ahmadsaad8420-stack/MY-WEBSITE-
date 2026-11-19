SAAD SHEIKH PORTFOLIO
=====================

Static, dependency-free portfolio prepared for Netlify. No build command or
package installation is required; netlify.toml publishes this folder directly.

DEPLOY
------
1. Sign in to Netlify and create a site from this folder or its Git repository.
2. For a Git deploy, use the folder containing this file as the base directory,
   leave the build command empty, and set the publish directory to ".".
3. Connect saadsheikh.bond as the primary domain and enable HTTPS. The
   _redirects file sends the default saadsheikh.netlify.app host to this domain.
4. After the first deploy, open the live site and test every page and form.

CONTACT FORM
------------
The form uses Netlify Forms. Enable form detection in the Netlify site settings,
deploy, then submit a test message and confirm it appears in the Forms panel.
Configure a notification if messages should also be forwarded by email.
The form does not submit to a backend when opened as a local file or hosted
without Netlify Forms.

SECURITY AND HOSTING
--------------------
Netlify reads response headers from _headers and publish settings from
netlify.toml. If you deploy to another host, configure equivalent HTTPS,
security headers, clean URLs and form processing there; the Netlify files alone
do not configure another provider.

CUSTOM DOMAIN
-------------
The canonical URLs, sitemap, Open Graph metadata and redirects use
https://saadsheikh.bond/. If you use another domain, update those values in the
HTML files, sitemap.xml, robots.txt, security.txt and _redirects before launch.

WHAT IS INCLUDED
----------------
- Responsive pages, keyboard-friendly navigation and reduced-motion support.
- Lightweight CSS 3D portrait/card interactions, an interactive skills orbit and a
  dependency-free animated 3D particle field in the hero.
- Netlify Forms, privacy and terms pages, a custom 404 page and thank-you page.
- PWA manifest, offline service worker, sitemap, robots.txt and security.txt.
- Locally hosted fonts/icons with their license files.
- Project cards include previews for the Scientific Calculator, Sheikh Weather,
  QR Studio and My Website.
- Contact forms are processed by Netlify Forms only after deployment to Netlify.
  For a local preview or another host, use the direct email and messaging links;
  that host must provide its own form-processing service.

BEFORE SHARING THE SITE
-----------------------
- Verify the CV and public contact details are current and intended to be public.
- Keep the four published project entries and their preview images in
  js/projects.js and assets/images/projects/ up to date.
- Confirm Netlify form detection, notifications, domain redirects and HTTPS.
- Re-test the site on a phone, keyboard-only navigation, and reduced-motion mode.
