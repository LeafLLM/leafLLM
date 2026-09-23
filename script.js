// Shared page interactions are optional: Projects and Robotics do not have a showcase track.
const track = document.getElementById('track');
if (track) {
  const cards = [...track.querySelectorAll('.card')];
  const indicators = [...document.querySelectorAll('.indicator')];
  const previous = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  let currentIndex = 0;
  const update = () => {
    // Close an offscreen disclosure on desktop so it cannot leave a tall empty slide.
    if (matchMedia('(min-width: 769px)').matches) {
      cards.forEach((card, index) => {
        if (index !== currentIndex) card.querySelectorAll('details[open]').forEach(details => { details.open = false; });
      });
    }
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
      if (index === currentIndex) indicator.setAttribute('aria-current', 'true');
      else indicator.removeAttribute('aria-current');
    });
    if (previous) previous.disabled = currentIndex === 0;
    if (next) next.disabled = currentIndex === cards.length - 1;
  };
  const scrollToCard = (index) => {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    const card = cards[currentIndex];
    const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left - track.clientLeft + track.scrollLeft;
    track.scrollTo({left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    update();
  };
  previous?.addEventListener('click', () => scrollToCard(currentIndex - 1));
  next?.addEventListener('click', () => scrollToCard(currentIndex + 1));
  indicators.forEach((indicator, index) => indicator.addEventListener('click', (event) => {
    event.preventDefault();
    scrollToCard(index);
  }));
  track.addEventListener('scroll', () => {
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    currentIndex = cards.reduce((nearest, card, index) => {
      const distance = (item) => Math.abs(item.getBoundingClientRect().left + item.clientWidth / 2 - center);
      return distance(card) < distance(cards[nearest]) ? index : nearest;
    }, 0);
    update();
  }, {passive: true});
  update();
}

document.querySelectorAll('.FAQ-button').forEach((button, index) => {
  const section = button.closest('.FAQ-section');
  const answer = section.querySelector('.A');
  answer.id = `faq-answer-${index}`;
  button.setAttribute('aria-controls', answer.id);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    // Keep the original slide/fade while allowing longer answers to fully open.
    answer.style.setProperty('--answer-height', `${answer.scrollHeight}px`);
    const expanded = section.classList.toggle('active');
    button.setAttribute('aria-expanded', String(expanded));
  });
  window.addEventListener('resize', () => {
    if (section.classList.contains('active')) {
      answer.style.setProperty('--answer-height', `${answer.scrollHeight}px`);
    }
  });
});

const artStrip = document.querySelector('.art-strip');
if (artStrip) {
  const button = artStrip.querySelector('.art-pause');
  let paused = false;
  let visible = true;
  const sync = () => {
    artStrip.classList.toggle('is-paused', paused);
    artStrip.classList.toggle('is-offscreen', !visible || document.hidden);
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume scrolling' : 'Pause scrolling';
  };
  button.addEventListener('click', () => { paused = !paused; sync(); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(artStrip);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', sync);
}

const climber = document.querySelector('.climber-preview');
if (climber) {
  let pinned = false;
  let hovered = false;
  const sync = () => {
    const extended = pinned || hovered;
    climber.classList.toggle('is-extended', extended);
    climber.setAttribute('aria-pressed', String(pinned));
    climber.setAttribute('aria-label', pinned ? 'Show retracted climber' : 'Show extended climber');
    climber.querySelector('.climber-retracted').setAttribute('aria-hidden', String(extended));
    climber.querySelector('.climber-extended').setAttribute('aria-hidden', String(!extended));
  };
  climber.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') { hovered = true; sync(); }
  });
  climber.addEventListener('pointerleave', () => { hovered = false; sync(); });
  climber.addEventListener('click', () => { pinned = !pinned; hovered = false; sync(); });
  climber.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { pinned = false; hovered = false; sync(); }
  });
}

// All pages share ordinary links; native page transitions handle document changes.
const pageTabs = [...document.querySelectorAll('.page-tabs a[href]')];
const syncPageTabs = () => {
  const current = new URL(location.href);
  const isFAQ = current.pathname.endsWith('/index.html') && current.hash === '#FAQ';
  const onHomeRoot = current.pathname.endsWith('/') && current.hash === '#FAQ';
  const activePath = current.pathname.endsWith('/') ? current.pathname + 'index.html' : current.pathname;
  pageTabs.forEach(link => {
    const destination = new URL(link.href);
    let state = null;
    if (isFAQ || onHomeRoot) {
      if (destination.pathname === activePath && destination.hash === '#FAQ') state = 'location';
    } else if (!destination.hash && destination.pathname === activePath) {
      state = 'page';
    } else if (document.body.dataset.navSection === 'projects' && destination.pathname.endsWith('/projects.html')) {
      state = 'location';
    }
    if (state) link.setAttribute('aria-current', state);
    else link.removeAttribute('aria-current');
  });
};
syncPageTabs();
window.addEventListener('hashchange', syncPageTabs);
window.addEventListener('pageshow', syncPageTabs);
