/* ==========================================================================
   EduSphere — Assignment #6, Part 3: jQuery helpers for the web app
   Author: Azamat Mustafin

   7. Toast notifications  -> showToast(message, type), used by every page
   8. Copy to clipboard    -> .copy-btn buttons (contact + courses pages)
   9. Lazy image loading   -> img.lazy on the gallery photo wall
   ========================================================================== */


/* ---------- 7. TOAST NOTIFICATIONS ----------
   A toast is built with jQuery, fades in, waits, then fades out and is
   removed from the page. Other scripts call showToast() after a user action. */
const TOAST_TIME = 3500;   // how long a toast stays on screen, ms
const MAX_TOASTS = 3;      // older toasts close when a fourth one comes

const toastIcons = {
  success: 'bi-check-circle-fill',
  info: 'bi-info-circle-fill',
  warning: 'bi-exclamation-triangle-fill'
};

function getToastStack() {
  let $stack = $('#toast-stack');
  if ($stack.length === 0) {
    // one container for all toasts, created the first time it is needed
    $stack = $('<div id="toast-stack" class="toast-stack" aria-live="polite"></div>').appendTo('body');
  }
  return $stack;
}

function closeToast($toast) {
  // stop(true) clears the waiting .delay(), so the toast closes right away
  $toast.stop(true).fadeOut(300, function () {
    $(this).remove();
  });
}

function showToast(message, type = 'success') {
  const $toast = $('<div class="edu-toast" role="status"></div>')
    .addClass('edu-toast-' + type)
    .append($('<i class="bi" aria-hidden="true"></i>').addClass(toastIcons[type]))
    .append($('<span></span>').text(message))   // .text(): the message is never read as HTML
    .append('<button class="edu-toast-close" type="button" aria-label="Close notification">&times;</button>')
    .append('<span class="edu-toast-timer"></span>');

  const $stack = getToastStack();
  $toast.hide().appendTo($stack);

  // fade in -> wait -> fade out -> remove
  $toast.fadeIn(250).delay(TOAST_TIME).fadeOut(400, function () {
    $(this).remove();
  });

  // the line at the bottom shrinks from 100% to 0 while the toast waits
  $toast.find('.edu-toast-timer').animate({ width: 0 }, TOAST_TIME + 250, 'linear');

  $toast.find('.edu-toast-close').on('click', function () {
    closeToast($toast);
  });

  // keep only the newest MAX_TOASTS on screen
  $stack.children().slice(0, -MAX_TOASTS).each(function () {
    closeToast($(this));
  });
}


/* ---------- 8. COPY TO CLIPBOARD ---------- */
const COPIED_TIME = 1800;

// returns a Promise, so the caller can wait for the result with .then()
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  // older way for pages opened over http:// or as a local file
  return new Promise(function (resolve, reject) {
    const $field = $('<textarea readonly></textarea>')
      .val(text)
      .css({ position: 'fixed', top: 0, opacity: 0 })
      .appendTo('body');
    $field.get(0).select();   // .get(0) gives the plain DOM element
    const copied = document.execCommand('copy');
    $field.remove();
    if (copied) {
      resolve();
    } else {
      reject(new Error('Copy command was blocked'));
    }
  });
}

// clipboard icon -> checkmark + tooltip "Copied to clipboard!", then back
function showCopied($button) {
  clearTimeout($button.data('resetTimer'));
  $button.find('.copy-tooltip').remove();

  $button.addClass('copied');
  $button.find('.bi').removeClass('bi-clipboard').addClass('bi-check2');
  $button.find('.copy-label').text('Copied');

  const $tooltip = $('<span class="copy-tooltip" role="status">Copied to clipboard!</span>');
  $tooltip.hide().appendTo($button).fadeIn(150);

  const timer = setTimeout(function () {
    $tooltip.fadeOut(200, function () {
      $tooltip.remove();
    });
    $button.removeClass('copied');
    $button.find('.bi').removeClass('bi-check2').addClass('bi-clipboard');
    $button.find('.copy-label').text('Copy');
  }, COPIED_TIME);

  $button.data('resetTimer', timer);
}

function setUpCopyButtons() {
  $('.copy-btn').on('click', function () {
    const $button = $(this);
    // data-copy holds a selector of the element whose text is copied
    const text = $($button.data('copy')).text().trim();

    copyText(text)
      .then(function () {
        showCopied($button);
      })
      .catch(function () {
        showToast('Copying is blocked by the browser. Select the text and press Ctrl+C.', 'warning');
      });
  });

  // the "copy" event fires when the visitor copies a snippet by hand (Ctrl+C or right click)
  $('.copy-source').on('copy', function () {
    showToast('Copied to clipboard!', 'info');
  });
}


/* ---------- 9. LAZY IMAGE LOADING ----------
   The real address of each photo waits in data-src. When the top of the
   image comes near the bottom of the window, jQuery copies it into src,
   and only then does the browser download the file. */
const LAZY_MARGIN = 150;   // start loading a little before the image is visible

function updateLazyStatus() {
  const total = $('img.lazy').length;
  const loaded = $('img.lazy').not('[data-src]').length;
  $('#lazy-status').text('Loaded ' + loaded + ' of ' + total + ' photos');
}

function loadVisibleImages() {
  const windowBottom = $(window).scrollTop() + $(window).height() + LAZY_MARGIN;

  $('img.lazy[data-src]').each(function () {
    const $image = $(this);
    if ($image.offset().top > windowBottom) {
      return;   // still below the screen
    }

    $image.on('load', function () {
      $image.closest('.lazy-frame').addClass('is-loaded');
    });
    $image.attr('src', $image.attr('data-src')).removeAttr('data-src');
    console.log('Lazy-loaded ' + $image.attr('src'));
  });

  updateLazyStatus();
}


/* ---------- START ---------- */
$(function () {
  setUpCopyButtons();

  if ($('img.lazy').length > 0) {
    $(window).on('scroll resize', loadVisibleImages);
    loadVisibleImages();   // photos that are already on screen
  }
});
