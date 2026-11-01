/* ==========================================================================
   EduSphere — courses.html (Course catalogue)
   Author: Ramil Zhunussov · Assignment #5

   1. Data          -> array of course objects
   2. Catalogue     -> cards built in a loop, filtered by level and duration
   3. Rating        -> clickable stars, summary in the sidebar
   4. Enrolment     -> multi-step form with Next / Back

   Assignment #6: a toast after each rating, a loading spinner on
   "Confirm enrolment". The search box is in js/search.js.
   ========================================================================== */


/* ---------- 1. DATA ---------- */
const courses = [
  {
    id: 'html-css',
    title: 'HTML & CSS Foundations',
    level: 'beginner',
    weeks: 8,
    image: 'images/course-web.svg',
    alt: 'Browser window representing the HTML and CSS foundations course',
    description: 'The course this website was built with. You learn document structure first and visual design second.',
    topics: [
      'Semantic tags, tables, forms and accessibility basics',
      'External stylesheets and all four selector types',
      'The box model, flexbox and responsive layouts',
      'Publishing a site to GitHub Pages'
    ],
    rating: 0
  },
  {
    id: 'javascript',
    title: 'JavaScript in Practice',
    level: 'intermediate',
    weeks: 10,
    image: 'images/course-js.svg',
    alt: 'Code editor showing a JavaScript function',
    description: 'From variables to a working single-page application, written without any framework.',
    topics: [
      'Types, functions, arrays and objects',
      'DOM manipulation and event handling',
      'Asynchronous code, fetch and REST APIs',
      'Debugging in Chrome DevTools'
    ],
    rating: 0
  },
  {
    id: 'python',
    title: 'Python for Everyone',
    level: 'beginner',
    weeks: 9,
    image: 'images/course-python.svg',
    alt: 'Terminal window running a Python script',
    description: 'A first programming language chosen because the syntax stays out of the way while you learn to think in algorithms.',
    topics: [
      'Control flow, collections and functions',
      'Files, modules and virtual environments',
      'Automating boring tasks with scripts',
      'An introduction to object-oriented design'
    ],
    rating: 0
  },
  {
    id: 'sql',
    title: 'Data Analytics with SQL',
    level: 'intermediate',
    weeks: 12,
    image: 'images/course-data.svg',
    alt: 'Dashboard with bar and pie charts representing data analytics',
    description: 'Turn a raw database into a dashboard a manager can read in thirty seconds.',
    topics: [
      'SELECT, JOIN, GROUP BY and window functions',
      'Cleaning messy real-world datasets',
      'Charts that do not mislead the reader',
      'Presenting findings to a non-technical audience'
    ],
    rating: 0
  },
  {
    id: 'ux',
    title: 'UX & UI Design Basics',
    level: 'beginner',
    weeks: 7,
    image: 'images/course-ux.svg',
    alt: 'Wireframe screens and colour swatches representing UX design',
    description: 'Research, wireframes and design systems — the part of the work that happens before anyone writes code.',
    topics: [
      'User interviews and simple usability tests',
      'Wireframing and prototyping in Figma',
      'Colour, type scales and spacing systems',
      'Handing a design over to developers'
    ],
    rating: 0
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    level: 'advanced',
    weeks: 14,
    image: 'images/course-mobile.svg',
    alt: 'Smartphone showing a mobile application interface',
    description: 'Build, test and publish a cross-platform application to a real app store before the course ends.',
    topics: [
      'Component-based mobile interfaces',
      'Navigation, local storage and device APIs',
      'Working with a remote backend',
      'Release builds and store requirements'
    ],
    rating: 0
  }
];

// Bootstrap badge colour for each level
const levelBadges = {
  beginner: 'text-bg-primary',
  intermediate: 'text-bg-warning',
  advanced: 'text-bg-dark'
};

const MAX_STARS = 5;


/* ---------- 2. CATALOGUE ---------- */
const courseList = document.getElementById('course-list');
const levelInputs = document.querySelectorAll('input[name="level"]');
const durationSelect = document.getElementById('duration-filter');
const filterResult = document.getElementById('filter-result');

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function matchesLevel(course, level) {
  return level === 'all' || course.level === level;
}

function matchesDuration(course, range) {
  switch (range) {
    case 'short':
      return course.weeks <= 8;
    case 'medium':
      return course.weeks >= 9 && course.weeks <= 12;
    case 'long':
      return course.weeks >= 13;
    default:
      return true;   // "any"
  }
}

function createCourseCard(course) {
  const column = document.createElement('div');
  column.className = 'col fade-in';

  const stars = [];
  for (let value = 1; value <= MAX_STARS; value++) {
    stars.push(`<button class="star" type="button" data-value="${value}" aria-label="Rate ${value} of ${MAX_STARS}">★</button>`);
  }

  const topics = course.topics
    .map((topic) => `<li class="list-group-item px-0">&#10003; ${topic}</li>`)
    .join('');

  // the course data is our own (not typed by the user), so innerHTML is safe here
  column.innerHTML = `
    <article class="card h-100 border-0 shadow-sm">
      <img class="card-img-top" src="${course.image}" alt="${course.alt}">
      <div class="card-body">
        <span class="badge ${levelBadges[course.level]} mb-2">${capitalize(course.level)} · ${course.weeks} weeks</span>
        <h3 class="card-title h5">${course.title}</h3>
        <p class="card-text text-secondary">${course.description}</p>
        <div class="rating d-flex align-items-center mb-2" role="group" aria-label="Rate ${course.title}">
          ${stars.join('')}
          <span class="rating-text small text-secondary ms-2">Not rated yet</span>
        </div>
        <button class="btn btn-link btn-sm px-0 read-more" type="button" aria-expanded="false">Show syllabus ▾</button>
        <ul class="list-group list-group-flush small syllabus">${topics}</ul>
      </div>
      <div class="card-footer bg-white border-0 px-3 pb-3 pt-0">
        <button class="btn btn-primary w-100 enrol-btn" type="button">Enrol now</button>
      </div>
    </article>`;

  setUpRating(column, course);
  setUpReadMore(column);
  column.querySelector('.enrol-btn').addEventListener('click', () => startEnrolment(course.id));
  return column;
}

function renderCourses() {
  const level = document.querySelector('input[name="level"]:checked').value;
  const range = durationSelect.value;
  const visibleCourses = courses.filter(
    (course) => matchesLevel(course, level) && matchesDuration(course, range)
  );

  courseList.innerHTML = '';
  visibleCourses.forEach((course, index) => {
    const card = createCourseCard(course);
    card.style.animationDelay = `${index * 80}ms`;   // cards appear one after another
    courseList.appendChild(card);
  });

  if (visibleCourses.length === 0) {
    courseList.innerHTML = '<p class="col text-secondary">No courses match these filters yet.</p>';
  }

  const count = visibleCourses.length;
  filterResult.textContent = `Showing ${count} ${count === 1 ? 'course' : 'courses'}`;
}

levelInputs.forEach((input) => input.addEventListener('change', renderCourses));
durationSelect.addEventListener('change', renderCourses);

// sidebar: how many courses each level has, counted with a for loop
function showLevelCounts() {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 };
  for (let i = 0; i < courses.length; i++) {
    counts[courses[i].level]++;
  }
  document.querySelectorAll('[data-level-count]').forEach((badge) => {
    badge.textContent = counts[badge.dataset.levelCount];
  });
}


/* ---------- READ MORE (syllabus) ---------- */
function setUpReadMore(card) {
  const button = card.querySelector('.read-more');
  const syllabus = card.querySelector('.syllabus');
  syllabus.style.display = 'none';

  button.addEventListener('click', () => {
    const isHidden = syllabus.style.display === 'none';
    syllabus.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Hide syllabus ▴' : 'Show syllabus ▾';
    button.setAttribute('aria-expanded', isHidden);
  });
}


/* ---------- 3. RATING ---------- */
const ratingSummary = document.getElementById('rating-summary');

function paintStars(stars, rating) {
  stars.forEach((star, index) => star.classList.toggle('active', index < rating));
}

function setUpRating(card, course) {
  const stars = card.querySelectorAll('.star');
  const ratingText = card.querySelector('.rating-text');

  function showRating() {
    paintStars(stars, course.rating);
    if (course.rating > 0) {
      ratingText.textContent = `Your rating: ${course.rating}/${MAX_STARS}`;
    }
  }

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      course.rating = Number(star.dataset.value);   // saved in the object, survives filtering
      showRating();
      showRatingSummary();

      // short "jump" of the clicked star
      star.style.transform = 'scale(1.5) rotate(-15deg)';
      setTimeout(() => { star.style.transform = ''; }, 180);
      playSound('star');
      showToast(`You rated "${course.title}" ${course.rating} of ${MAX_STARS} stars.`, 'info');   // Assignment #6
    });
  });

  showRating();
}

function showRatingSummary() {
  const rated = courses.filter((course) => course.rating > 0);
  if (rated.length === 0) {
    return;
  }
  const total = rated.reduce((sum, course) => sum + course.rating, 0);
  const average = (total / rated.length).toFixed(1);
  const favourite = rated.reduce((best, course) => (course.rating > best.rating ? course : best));

  ratingSummary.innerHTML =
    `Rated <strong>${rated.length}</strong> of ${courses.length} courses, average <strong>${average} ★</strong>.<br>` +
    `Favourite: <strong>${favourite.title}</strong>`;
}


/* ---------- 4. MULTI-STEP ENROLMENT FORM ---------- */
const enrolSection = document.getElementById('enrol');
const enrolForm = document.getElementById('enrol-form');
const steps = document.querySelectorAll('.wizard-step');
const courseSelect = document.getElementById('enrol-course');
const nameField = document.getElementById('enrol-name');
const emailField = document.getElementById('enrol-email');
const summaryList = document.getElementById('enrol-summary');
const wizardStatus = document.getElementById('wizard-status');
const wizardBar = document.getElementById('wizard-bar');
const wizardError = document.getElementById('wizard-error');
const backButton = document.getElementById('back-btn');
const nextButton = document.getElementById('next-btn');
const confirmButton = document.getElementById('confirm-btn');
const clearButton = document.getElementById('clear-btn');
const enrolSuccess = document.getElementById('enrol-success');

let currentStep = 0;

// options of the course <select> come from the same array as the cards
courseSelect.innerHTML += courses
  .map((course) => `<option value="${course.id}">${course.title}</option>`)
  .join('');

function selectedFormat() {
  const checked = document.querySelector('input[name="format"]:checked');
  return checked ? checked.value : '';
}

// returns an error message, or an empty string when the step is valid
function validateStep(step) {
  switch (step) {
    case 0:
      return courseSelect.value ? '' : 'Please choose a course.';
    case 1:
      return selectedFormat() ? '' : 'Please choose a study format.';
    case 2:
      if (nameField.value.trim() === '') return 'Please enter your name.';
      return emailField.checkValidity() && emailField.value ? '' : 'Please enter a valid email.';
    default:
      return '';
  }
}

function fillSummary() {
  const course = courses.find((item) => item.id === courseSelect.value);
  const rows = [
    ['Course', course.title],
    ['Format', selectedFormat()],
    ['Name', nameField.value.trim()],
    ['Email', emailField.value.trim()]
  ];

  summaryList.innerHTML = '';
  for (const [label, value] of rows) {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.innerHTML = `<strong>${label}:</strong> `;
    item.append(value);   // typed by the user -> added as text, never as HTML
    summaryList.appendChild(item);
  }
}

// callback: shows the step with the given index and updates the controls
function showStep(index) {
  steps.forEach((step, i) => {
    step.style.display = i === index ? 'block' : 'none';
  });
  replayAnimation(steps[index], 'fade-in');

  const isLast = index === steps.length - 1;
  if (isLast) {
    fillSummary();
  }

  wizardStatus.textContent = `Step ${index + 1} of ${steps.length}`;
  wizardBar.style.width = `${((index + 1) / steps.length) * 100}%`;
  backButton.disabled = index === 0;
  nextButton.style.display = isLast ? 'none' : 'inline-block';
  confirmButton.style.display = isLast ? 'inline-block' : 'none';
}

// moves one step forward or back and hands the new index to the callback
function changeStep(direction, onStepChanged) {
  const target = currentStep + direction;
  if (target < 0 || target >= steps.length) {
    return;
  }
  currentStep = target;
  onStepChanged(currentStep);
}

function goToNextStep() {
  const error = validateStep(currentStep);
  wizardError.textContent = error;
  if (error) {
    replayAnimation(wizardError, 'shake');
    return;
  }
  changeStep(+1, showStep);
  playSound('click');
}

nextButton.addEventListener('click', goToNextStep);

backButton.addEventListener('click', () => {
  wizardError.textContent = '';
  changeStep(-1, showStep);
  playSound('click');
});

enrolForm.addEventListener('submit', (event) => {
  event.preventDefault();   // nothing is sent: the result is shown on the page
  if (currentStep < steps.length - 1) {
    goToNextStep();         // Enter inside a field on steps 1–3 works like "Next"
    return;
  }
  // Assignment #6: the button shows a spinner while the "server" answers (js/engagement.js)
  submitWithSpinner($(enrolForm), () => {
    const course = courses.find((item) => item.id === courseSelect.value);
    if (!course) {
      return;   // the form was cleared while it was "sending"
    }
    enrolSuccess.textContent =
      `Thank you, ${nameField.value.trim()}! You are enrolled in "${course.title}". ` +
      `A mentor will write to ${emailField.value.trim()} within 24 hours.`;
    enrolSuccess.hidden = false;
    replayAnimation(enrolSuccess, 'pop');
    playSound('success');
    showToast(`Enrolment confirmed: ${course.title}`, 'success');
  });
});

function clearEnrolForm() {
  enrolForm.querySelectorAll('input').forEach((input) => {
    if (input.type === 'radio') {
      input.checked = false;
    } else {
      input.value = '';
    }
  });
  courseSelect.value = '';
  wizardError.textContent = '';
  enrolSuccess.hidden = true;
  currentStep = 0;
  showStep(currentStep);
}

clearButton.addEventListener('click', clearEnrolForm);

// "Enrol now" on a card: pre-select the course and scroll to the form
function startEnrolment(courseId) {
  courseSelect.value = courseId;
  wizardError.textContent = '';
  currentStep = 0;
  showStep(currentStep);
  enrolSection.scrollIntoView({ behavior: 'smooth' });
  replayAnimation(enrolSection, 'highlight');
  playSound('click');
}


/* ---------- START ---------- */
renderCourses();
showLevelCounts();
showStep(currentStep);
