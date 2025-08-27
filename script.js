// ===== POP-UP & TESTIMONIAL ANIMATIONS =====
const popUps = document.querySelectorAll('.pop-up');
const testimonials = document.querySelectorAll('.testimonial');

function handleScrollAnimations() {
  const triggerBottom = window.innerHeight / 5 * 4;

  // Pop-ups
  popUps.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if(sectionTop < triggerBottom) section.classList.add('active');
  });

  // Testimonials
  testimonials.forEach(testimonial => {
    const testimonialTop = testimonial.getBoundingClientRect().top;
    if(testimonialTop < triggerBottom) {
      testimonial.style.opacity = '1';
      testimonial.style.transform = 'translateY(0)';
    }
  });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
  counter.innerText = '0';
  const updateCounter = () => {
    const target = +counter.getAttribute('data-target');
    const current = +counter.innerText;
    const increment = Math.ceil(target / 200); // speed control
    if(current < target){
      counter.innerText = current + increment;
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };
  updateCounter();
});
