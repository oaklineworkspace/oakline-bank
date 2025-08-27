// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  counter.innerText = '0';
  const updateCounter = () => {
    const target = +counter.getAttribute('data-target');
    const current = +counter.innerText;
    const increment = target / 200; // speed
    if(current < target){
      counter.innerText = `${Math.ceil(current + increment)}`;
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };
  updateCounter();
});

// ===== SCROLL REVEAL / POP-UP ANIMATION =====
const popUps = document.querySelectorAll('.pop-up');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  popUps.forEach(box => {
    const boxTop = box.getBoundingClientRect().top;
    if(boxTop < triggerBottom){
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== MOBILE NAV TOGGLE =====
const nav = document.querySelector('nav ul');
const navToggle = document.createElement('div');
navToggle.classList.add('nav-toggle');
navToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('header').appendChild(navToggle);

navToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});
