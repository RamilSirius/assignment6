/* ==========================================================================
   EduSphere — Assignment #6, Part 2: UX engagement elements with jQuery
   Author: Maxim Batyushkin

   4. Scroll progress bar   -> created by jQuery at the top of every page
   5. Animated counters     -> .counter elements (Home + About pages)
   6. Loading button        -> submitWithSpinner(), used by the forms
   ========================================================================== */


/* ---------- 4. SCROLL PROGRESS BAR ----------
   percent = how far the page is scrolled / how far it can be scrolled.
   The same number fills the bar at the top and the ring of the round
   "back to top" badge in the corner. */
function setUpScrollProgress() {
  const $progress = $('<div class="scroll-progress" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100"></div>');
  const $bar = $('<div class="scroll-progress-bar"></div>').appendTo($progress);
  $progress.prependTo('body');

  const $badge = $('<button class="scroll-badge" type="button" aria-label="Back to top"><span class="scroll-badge-text">0%</span></button>')
    .appendTo('body');

  function updateProgress() {
    const scrollable = $(document).height() - $(window).height();
    const percent = scrollable > 0 ? Math.round(($(window).scrollTop() / scrollable) * 100) : 0;

    $bar.css('width', percent + '%');
    $progress.attr('aria-valuenow', percent);
    $badge.css('--progress', percent);            // CSS variable for the ring
    $badge.find('.scroll-badge-text').text(percent + '%');
    $badge.toggleClass('visible', percent > 3);   // hidden at the very top
  }

  $(window).on('scroll resize', updateProgress);
  updateProgress();

  // smooth scroll back to the top with jQuery .animate()
  $badge.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });
}


/* ---------- 5. ANIMATED NUMBER COUNTER ----------
   <strong class="counter" data-count="1800" data-suffix="+">0</strong>
   jQuery can animate any number, not only CSS: we animate the "value"
   property of a plain object from 0 to the target and print it on each step. */
const COUNTER_TIME = 2000;

function formatNumber(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function runCounter($counter) {
  const target = Number($counter.data('count'));
  const decimals = Number($counter.data('decimals') || 0);
  const suffix = $counter.data('suffix') || '';

  $({ value: 0 }).animate({ value: target }, {
    duration: COUNTER_TIME,
    easing: 'swing',               // starts fast, slows down at the end
    step: function (now) {
      $counter.text(formatNumber(now, decimals) + suffix);
    },
    complete: function () {
      $counter.text(formatNumber(target, decimals) + suffix);   // exact final value
    }
  });
}

// a counter starts only once, when it scrolls into view
function startVisibleCounters() {
  const windowBottom = $(window).scrollTop() + $(window).height();

  $('.counter').not('.counted').each(function () {
    const $counter = $(this);
    if ($counter.offset().top < windowBottom - 40) {
      $counter.addClass('counted');
      runCounter($counter);
    }
  });
}


/* ---------- 6. LOADING SPINNER ON SUBMIT ----------
   The button shows a spinner and "Please wait…", becomes disabled so it
   cannot be clicked twice, and after a fake server delay returns to normal. */
const FAKE_SERVER_DELAY = 2000;

function showSpinner($button) {
  $button
    .data('originalHtml', $button.html())   // remember the old label
    .prop('disabled', true)
    .attr('aria-busy', 'true')
    .html('<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Please wait…');
}

function hideSpinner($button) {
  $button
    .html($button.data('originalHtml'))
    .prop('disabled', false)
    .removeAttr('aria-busy');
}

// simulates sending the form; onDone runs when the "server" answers
function submitWithSpinner($form, onDone) {
  const $button = $form.find('[type="submit"]');
  if ($button.prop('disabled')) {
    return;   // already sending
  }
  showSpinner($button);
  setTimeout(function () {
    hideSpinner($button);
    onDone();
  }, FAKE_SERVER_DELAY);
}

// Instructors page: "Become a mentor" form
function setUpMentorForm() {
  $('#mentor-form').on('submit', function (event) {
    event.preventDefault();
    const $form = $(this);
    submitWithSpinner($form, function () {
      $form.trigger('reset');
      showToast('Thank you! Your mentor application has been sent.', 'success');
      playSound('success');
    });
  });
}


/* ---------- START ---------- */
$(function () {
  setUpScrollProgress();
  setUpMentorForm();

  if ($('.counter').length > 0) {
    $(window).on('scroll resize', startVisibleCounters);
    startVisibleCounters();
  }
});
