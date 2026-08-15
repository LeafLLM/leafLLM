const faqButtons = document.querySelectorAll('.FAQ-button');
const prevbtn = document.getElementById('prevBtn');
const nextbtn = document.getElementById('nextBtn');
const track = document.getElementById('track');
const cards = document.querySelectorAll('.card');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;


function scrollToCard(index) {
  if (index < 0) index = 0;
  if (index >= cards.length) index = cards.length - 1;
  
  currentIndex = index;
  
  cards[currentIndex].scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest'
  });

  updateIndicators(currentIndex);
}

// Update active indicator pill width
function updateIndicators(activeIndex) {
  indicators.forEach((indicator, i) => {
    if (i === activeIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Button controls
nextbtn.addEventListener('click', () => {
  scrollToCard(currentIndex + 1);
});

prevbtn.addEventListener('click', () => {
  scrollToCard(currentIndex - 1);
});

// Click directly on an indicator pill to jump
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToCard(index);
  });
});

// Sync indicators when manually dragging/scrolling the carousel
track.addEventListener('scroll', () => {
  const trackCenter = track.scrollLeft + (track.clientWidth / 2);
  
  cards.forEach((card, index) => {
    const cardLeft = card.offsetLeft;
    const cardRight = cardLeft + card.offsetWidth;
    
    if (trackCenter >= cardLeft && trackCenter <= cardRight) {
      currentIndex = index;
      updateIndicators(index);
    }
  });
});

// FAQ Toggle
faqButtons.forEach(btn => { 
  btn.addEventListener('click', () => {
    btn.closest('.FAQ-section').classList.toggle('active');
  });
});