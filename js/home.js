/* ==========================================================================
   EduSphere — index.html (Home)
   Author: Azamat Mustafin · Assignment #5

   1. Greeting   -> depends on the time of day (switch) and the visitor's name
   2. Cohort     -> object with methods; the sidebar card shows its properties
   ========================================================================== */


/* ---------- 1. GREETING ---------- */
const greeting = document.getElementById('greeting');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('visitor-name');

let visitorName = '';

// 0–5 -> 0, 6–11 -> 1, 12–17 -> 2, 18–23 -> 3: one case per part of the day
function greetingForHour(hour) {
  switch (Math.floor(hour / 6)) {
    case 0:
      return 'Still studying at night';
    case 1:
      return 'Good morning';
    case 2:
      return 'Good afternoon';
    default:
      return 'Good evening';
  }
}

function showGreeting() {
  const hello = greetingForHour(new Date().getHours());
  greeting.textContent = visitorName
    ? `${hello}, ${visitorName}! Ready for today's lesson?`
    : `${hello}! Welcome to EduSphere.`;
  replayAnimation(greeting, 'pop');
}

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();               // update the page, do not reload it
  visitorName = nameInput.value.trim();
  showGreeting();
  playSound('click');
});

showGreeting();


/* ---------- 2. NEXT COHORT ---------- */
const cohort = {
  totalPlaces: 18,
  takenPlaces: 12,

  freePlaces() {
    return this.totalPlaces - this.takenPlaces;
  },
  percentTaken() {
    return Math.round((this.takenPlaces / this.totalPlaces) * 100);
  },
  isFull() {
    return this.freePlaces() === 0;
  },
  reserve() {
    if (!this.isFull()) {
      this.takenPlaces++;
    }
  }
};

const placesText = document.getElementById('places-text');
const placesProgress = document.getElementById('places-progress');
const placesBar = document.getElementById('places-bar');
const reserveButton = document.getElementById('reserve-btn');
const reserveMessage = document.getElementById('reserve-message');

function renderCohort() {
  placesText.innerHTML =
    `${cohort.totalPlaces} places in the evening group, <strong>${cohort.freePlaces()}</strong> still free.`;

  // the Bootstrap progress bar animates the width change with a CSS transition
  placesBar.style.width = `${cohort.percentTaken()}%`;
  placesProgress.setAttribute('aria-valuenow', cohort.percentTaken());

  if (cohort.isFull()) {
    reserveButton.disabled = true;
    reserveButton.textContent = 'Group is full';
    placesBar.classList.replace('bg-warning', 'bg-danger');
  }
}

reserveButton.addEventListener('click', () => {
  cohort.reserve();
  const who = visitorName || 'You';
  reserveMessage.textContent = `${who} got place #${cohort.takenPlaces}!`;
  replayAnimation(reserveMessage, 'pop');
  renderCohort();
  playSound('success');
  showToast(`Place #${cohort.takenPlaces} reserved in the 16 November cohort.`, 'success');   // Assignment #6
});

renderCohort();
