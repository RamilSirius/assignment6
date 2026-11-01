# EduSphere — Assignment 6: jQuery

Team **The Ethernet**, group **SE-2510**.

| Member | Role in Assignment 6 |
|---|---|
| Ramil Zhunussov | Team lead. Part 1, jQuery search: live filter, autocomplete suggestions, search highlighting (`js/search.js`); spinner and toasts in the enrolment form; deployment |
| Maxim Batyushkin | Task 0 setup (`js/script.js`). Part 2, UX elements: scroll progress bar, animated counters, loading button (`js/engagement.js`), styles (`css/jquery-features.css`) |
| Azamat Mustafin | Part 3, helpers: toast notifications, copy to clipboard, lazy image loading (`js/helpers.js`); contact form rewritten with jQuery (`js/contact.js`); testing |

The EduSphere online-learning site from Assignments 3 and 5, now with features
written with **jQuery 4.0.0**.

**Live site:** https://ramilsirius.github.io/assignment6/

## Where each task is

| Task | Page | Code |
|---|---|---|
| 0. Setup: jQuery from the CDN, `$(document).ready()`, "jQuery is ready!" in the console | every page (`<head>`) | `js/script.js` |
| 1. Real-time search and live filter | Courses: "Search the catalogue" | `applyCourseSearch()` in `js/search.js` |
| 2. Autocomplete suggestions (mouse, ↑ ↓, Enter, Esc) | Courses: dropdown under the search box | `showSuggestions()` in `js/search.js` |
| 3. Search highlighting with `<mark>` | Contact: "Frequent questions"; Courses: cards | `highlightMatches()` in `js/search.js` |
| 4. Colourful scroll progress bar + "back to top" ring | every page | `setUpScrollProgress()` in `js/engagement.js` |
| 5. Animated number counter | Home: hero stats; About: "EduSphere in numbers" | `runCounter()` in `js/engagement.js` |
| 6. Loading spinner on submit ("Please wait…", disabled) | Contact form, Courses enrolment, Instructors mentor form | `submitWithSpinner()` in `js/engagement.js` |
| 7. Toast notifications that fade out | form sent, enrolment, rating, place reserved | `showToast()` in `js/helpers.js` |
| 8. Copy to clipboard: icon → checkmark + tooltip | Contact: address, phone, email; Courses: promo code | `setUpCopyButtons()` in `js/helpers.js` |
| 9. Lazy image loading | Gallery: "Photo wall" (12 photos) | `loadVisibleImages()` in `js/helpers.js` |

## Files

```
index.html, courses.html, …   pages (HTML)
css/bootstrap-theme.css       brand colours (Assignment 3)
css/interactive.css           night theme, stars, animations (Assignment 5)
css/jquery-features.css       search, progress bar, toasts, copy, lazy images (Assignment 6)
js/script.js                  Task 0: $(document).ready + "jQuery is ready!"
js/search.js                  Part 1: live filter, suggestions, highlighting
js/engagement.js              Part 2: scroll progress, counters, loading button
js/helpers.js                 Part 3: toasts, copy to clipboard, lazy images
js/main.js                    shared from Assignment 5: sounds, theme switch, keyboard navigation
js/home.js, courses.js        page scripts from Assignment 5
js/contact.js                 contact form (jQuery since Assignment 6)
sounds/                       click.wav, star.wav, success.wav
```
