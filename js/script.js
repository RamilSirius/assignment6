/* ==========================================================================
   EduSphere — Assignment #6 (jQuery), Task 0: setup
   Team: The Ethernet (Group SE-2510)
   Author: Maxim Batyushkin

   jQuery 4.0.0 is included from the CDN in the <head> of every page, right
   before this file. The code inside $(document).ready() runs once the whole
   HTML is parsed, so it is safe even though this script sits in the <head>.

   The features live in their own files (each also starts with $(function),
   the short form of $(document).ready):
     js/search.js      Part 1 — live filter, suggestions, highlighting
     js/engagement.js  Part 2 — scroll progress, counters, loading button
     js/helpers.js     Part 3 — toasts, copy to clipboard, lazy images
   ========================================================================== */

$(document).ready(function () {
  console.log('jQuery is ready!');
  console.log('jQuery version: ' + $.fn.jquery);
});
