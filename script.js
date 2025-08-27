// Testimonials Scroll Animation
const testimonials = document.querySelectorAll('.testimonial');

window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight / 5 * 4;

  testimonials.forEach(testimonial => {
    const testimonialTop = testimonial.getBoundingClientRect().top;

    if(testimonialTop < triggerBottom) {
      testimonial.style.opacity = '1';
      testimonial.style.transform = 'translateY(0)';
    }
  });
});

// Section Pop-Up Animations
const popUps = document.querySelectorAll('.pop-up');

window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight / 5 * 4;

  popUps.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;

    if(sectionTop < triggerBottom) {
      section.classList.add('active');
    }
  });
});
