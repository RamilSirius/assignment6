/* ==========================================================================
   EduSphere — Assignment #6, Part 1: jQuery search
   Author: Ramil Zhunussov

   1. Live filter      -> course cards are hidden / shown while you type
   2. Suggestions      -> dropdown under the search box (mouse + arrow keys)
   3. Highlighting     -> every match is wrapped in <mark> (course cards + FAQ)
   ========================================================================== */


/* ---------- 3. HIGHLIGHTING (used by both pages, so it comes first) ---------- */
const MIN_HIGHLIGHT_LENGTH = 2;   // one letter would light up half of the page

// jQuery escapes text for us: .text() puts it in, .html() gives it back as safe HTML
function escapeHtml(text) {
  return $('<div>').text(text).html();
}

// characters like . ? ( have a special meaning in a regex, so we escape them
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Wraps every match of the query in <mark>; returns how many matches were found.
// The original text is saved with .data() the first time, so every new search
// starts from clean text and old <mark> tags never pile up.
function highlightMatches($elements, query) {
  const useQuery = query.length >= MIN_HIGHLIGHT_LENGTH;
  const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
  let total = 0;

  $elements.each(function () {
    const $element = $(this);
    if ($element.data('originalText') === undefined) {
      $element.data('originalText', $element.text());
    }
    const original = $element.data('originalText');

    if (!useQuery) {
      $element.text(original);
      return;
    }

    // split() with a (group) keeps the matches: odd indexes are the matches
    const parts = original.split(regex);
    total += (parts.length - 1) / 2;

    const html = parts.map(function (part, index) {
      return index % 2 === 1
        ? '<mark class="search-hit">' + escapeHtml(part) + '</mark>'
        : escapeHtml(part);
    }).join('');

    $element.html(html);
  });

  return total;
}


/* ---------- 1. LIVE FILTER (courses.html) ----------
   The cards are created by js/courses.js (Assignment #5). Our filter works
   on top of the level / duration filter: it only hides cards that are
   already on the page. */
function applyCourseSearch() {
  const query = $('#course-search').val().trim().toLowerCase();
  const $columns = $('#course-list > .col').has('.card');

  // .filter() keeps only the cards whose text contains the query
  const $matching = $columns.filter(function () {
    const text = $(this).find('.card-title, .card-text, .badge, .syllabus').text().toLowerCase();
    return text.includes(query);
  });

  $columns.hide();
  $matching.show();

  highlightMatches($columns.find('.card-title, .card-text, .syllabus li'), query);
  showSearchResult(query, $matching.length, $columns.length);
}

function showSearchResult(query, found, total) {
  const $result = $('#search-result');

  if (query === '') {
    $result.text('');
  } else if (found === 0) {
    $result.html('No course matches <strong></strong>. Try another word.');
    $result.find('strong').text('“' + query + '”');
  } else {
    $result.text(found + ' of ' + total + ' courses match “' + query + '”');
  }
}


/* ---------- 2. AUTOCOMPLETE SUGGESTIONS ----------
   Suggestions come from the same "courses" array the cards are built from:
   course titles and the topics of every syllabus. */
const MAX_SUGGESTIONS = 6;
let activeSuggestion = -1;   // index of the item chosen with the arrow keys

function buildSuggestionList() {
  const list = [];
  $.each(courses, function (index, course) {
    list.push({ label: course.title, type: 'Course · ' + course.weeks + ' weeks' });
    $.each(course.topics, function (topicIndex, topic) {
      list.push({ label: topic, type: 'Topic in ' + course.title });
    });
  });
  return list;
}

function findSuggestions(list, query) {
  const lower = query.toLowerCase();
  return list
    .filter(function (item) {
      return item.label.toLowerCase().includes(lower);
    })
    .sort(function (a, b) {
      // words that START with the query go first
      return b.label.toLowerCase().startsWith(lower) - a.label.toLowerCase().startsWith(lower);
    })
    .slice(0, MAX_SUGGESTIONS);
}

// the matching part of a suggestion is shown in bold
function boldMatch(label, query) {
  const start = label.toLowerCase().indexOf(query.toLowerCase());
  return escapeHtml(label.slice(0, start)) +
    '<strong>' + escapeHtml(label.slice(start, start + query.length)) + '</strong>' +
    escapeHtml(label.slice(start + query.length));
}

function closeSuggestions() {
  $('#search-suggestions').empty().prop('hidden', true);
  $('#course-search').attr('aria-expanded', 'false').removeAttr('aria-activedescendant');
  activeSuggestion = -1;
}

function showSuggestions(items, query) {
  const $box = $('#search-suggestions').empty();

  if (query === '' || items.length === 0) {
    closeSuggestions();
    return;
  }

  $.each(items, function (index, item) {
    $('<li class="list-group-item list-group-item-action" role="option"></li>')
      .attr('id', 'suggestion-' + index)
      .data('label', item.label)
      .html(boldMatch(item.label, query) + '<span class="suggestion-type"></span>')
      .find('.suggestion-type').text(item.type).end()
      .appendTo($box);
  });

  $box.prop('hidden', false);
  $('#course-search').attr('aria-expanded', 'true');
  activeSuggestion = -1;
}

function markActiveSuggestion() {
  const $items = $('#search-suggestions li');
  $items.removeClass('active').attr('aria-selected', 'false');
  const $active = $items.eq(activeSuggestion).addClass('active').attr('aria-selected', 'true');
  $('#course-search').attr('aria-activedescendant', $active.attr('id'));
}

function chooseSuggestion(label) {
  $('#course-search').val(label);
  closeSuggestions();
  applyCourseSearch();

  // a topic is inside the hidden syllabus: open the syllabus of that card
  $('#course-list > .col:visible').each(function () {
    const $card = $(this);
    if ($card.find('.syllabus mark').length > 0 && $card.find('.syllabus').is(':hidden')) {
      $card.find('.read-more').trigger('click');   // the same button the visitor would press
    }
  });

  // scroll smoothly to the first card that is left
  const $first = $('#course-list > .col:visible').first();
  if ($first.length) {
    $('html, body').animate({ scrollTop: $first.offset().top - 90 }, 500);
  }
}

function setUpCourseSearch() {
  const $input = $('#course-search');
  const suggestionList = buildSuggestionList();

  // "input" fires on every change: typing, deleting, pasting, the clear (×) button
  $input.on('input', function () {
    const query = $input.val().trim();
    applyCourseSearch();
    showSuggestions(findSuggestions(suggestionList, query), query);
  });

  // arrow keys move through the suggestions, Enter picks one, Escape closes
  $input.on('keydown', function (event) {
    const count = $('#search-suggestions li').length;
    if (count === 0) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        activeSuggestion = (activeSuggestion + 1) % count;
        markActiveSuggestion();
        break;
      case 'ArrowUp':
        activeSuggestion = (activeSuggestion - 1 + count) % count;
        markActiveSuggestion();
        break;
      case 'Enter':
        if (activeSuggestion >= 0) {
          chooseSuggestion($('#search-suggestions li').eq(activeSuggestion).data('label'));
        } else {
          closeSuggestions();
        }
        break;
      case 'Escape':
        closeSuggestions();
        break;
      default:
        return;
    }
    event.preventDefault();
  });

  // event delegation: the <li> items are created later, so we listen on the list
  $('#search-suggestions').on('mousedown', 'li', function (event) {
    event.preventDefault();   // keep focus in the input
    chooseSuggestion($(this).data('label'));
  });

  // pressing the mouse anywhere else closes the dropdown
  $(document).on('mousedown', function (event) {
    if ($(event.target).closest('.search-box').length === 0) {
      closeSuggestions();
    }
  });

  // courses.js re-creates the cards when the level or duration changes;
  // this delegated handler runs after it, so the search is applied again
  $(document).on('change', 'input[name="level"], #duration-filter', applyCourseSearch);
}


/* ---------- 3. FAQ SEARCH WITH HIGHLIGHTING (contact.html) ---------- */
function applyFaqSearch() {
  const query = $('#faq-search').val().trim();
  const active = query.length >= MIN_HIGHLIGHT_LENGTH;
  let matches = 0;
  let questions = 0;

  $('.faq-item').each(function () {
    const $item = $(this);
    const found = highlightMatches($item.find('.faq-question, .faq-answer'), query);
    const hasMatch = found > 0;

    matches += found;
    if (hasMatch) {
      questions++;
    }

    // open the answers with a match, close the others (Bootstrap classes)
    const open = active && hasMatch;
    $item.find('.accordion-collapse').toggleClass('show', open);
    $item.find('.accordion-button').toggleClass('collapsed', !open).attr('aria-expanded', open);
    $item.toggleClass('faq-dim', active && !hasMatch);
  });

  const $result = $('#faq-result');
  if (!active) {
    $result.text(query === '' ? '' : 'Type at least ' + MIN_HIGHLIGHT_LENGTH + ' letters.');
  } else if (matches === 0) {
    $result.text('Nothing found for “' + query + '”.');
  } else {
    $result.text(matches + (matches === 1 ? ' match' : ' matches') + ' in ' +
      questions + (questions === 1 ? ' question' : ' questions'));
  }
}


/* ---------- START ---------- */
$(function () {
  if ($('#course-search').length > 0) {
    setUpCourseSearch();
  }
  if ($('#faq-search').length > 0) {
    $('#faq-search').on('input', applyFaqSearch);
  }
});
