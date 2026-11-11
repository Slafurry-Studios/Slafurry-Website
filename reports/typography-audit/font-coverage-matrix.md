# C. Font Coverage Matrix

| Area | Pixelify Sans (`font-display`) | Geist Pixel (`font-ui`) | Geist Sans (`font-body`) | Status |
|------|-------------------------------|-------------------------|--------------------------|--------|
| Public website (home, games, devlog, news, press, contact, 404/500) | Headings, hero, section/game titles, promotional text | Metadata, timestamps, UI labels | Paragraphs, descriptions, article/TipTap content, forms, inputs | Fixed / consistent |
| Navigation (Navbar, mobile nav) | Site title (`font-display`) | Nav links, menu items | — | Consistent |
| Games (listing + detail) | Game titles, section headings | Status badges, play links (button-like) | Game descriptions, comments, forms | Consistent |
| Devlog / News (listing + article) | Article headings | Metadata, tags | Article body, comments, forms | Consistent |
| Forms (Contact, Comment, Game/Post/Montage CRUD) | Section headings | Buttons, badges | Inputs, textareas, labels, descriptions | Consistent |
| Admin dashboard | Dashboard headings, large statistics | Sidebar labels, buttons, badges | Descriptions, list text | Fixed (statistics kept `font-display`) |
| Admin CRUD (games/posts/achievements/montage/press/settings) | Page headings, section headings | Buttons, badges, tags | Form inputs, descriptions, table text | Consistent |
| Admin analytics | Headings | View counts (was `font-mono`, fixed to `font-ui`) | — | Fixed |
| Admin audit log | — | Audit-log keys/values (was `font-mono`, fixed to `font-ui`) | — | Fixed |
| TipTap editor | Headings (`prose-headings:font-display`) | — | Editor content (`font-body`) | Consistent |
| Dialogs, popovers, toasts | Toast/promotional titles | Toast UI labels, badges | Dialog descriptions, body text | Consistent |
| Mobile layouts | Same as desktop (responsive text sizes only) | Same as desktop | Same as desktop | Consistent |
| Error boundaries / not-found | "404"/"500" and headings | — | Body text | Fixed (inline `fontFamily` removed) |
