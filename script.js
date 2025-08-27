// ===== HERO FADE-IN =====
const hero = document.querySelector('.hero');
window.addEventListener('load', () => {
  hero.classList.add('active');
});

// ===== POP-UP SECTIONS ON SCROLL =====
const popUps = document.querySelectorAll('.pop-up');
const testimonials = document.querySelectorAll('.testimonial');

window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight / 5 * 4;

  // Sections
  popUps.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if(sectionTop < triggerBottom) {
      section.classList.add('active');
    }
  });

  // Testimonials
  testimonials.forEach(testimonial => {
    const testimonialTop = testimonial.getBoundingClientRect().top;
    if(testimonialTop < triggerBottom) {
      testimonial.classList.add('active');
    }
  });
});
// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 200;

    if(count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 15);
    } else {
      counter.innerText = target;
    }
  };

  const observer = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) {
      updateCount();
      observer.disconnect();
    }
  }, { threshold: 0.6 });

  observer.observe(counter);
});
