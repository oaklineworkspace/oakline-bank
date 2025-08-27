// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.querySelector('header nav ul');
const toggleButton = document.createElement('div');
toggleButton.classList.add('menu-toggle');
toggleButton.innerHTML = '&#9776;'; // hamburger icon
document.querySelector('header').appendChild(toggleButton);

toggleButton.addEventListener('click', () => {
  menuToggle.classList.toggle('show');
});

// ===== SCROLL ANIMATIONS =====
const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .pop-up');

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 50
  );
}

function animateOnScroll() {
  animatedElements.forEach(el => {
    if (isInViewport(el)) {
      el.style.animationPlayState = 'running';
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ===== OPTIONAL: SMOOTH SCROLL FOR ANCHORS =====
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if(target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
