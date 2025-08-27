// Scroll-triggered Pop-up and Testimonials Animation
const popUps = document.querySelectorAll('.pop-up');
const testimonials = document.querySelectorAll('.testimonial');

window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight / 5 * 4;

  popUps.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if(sectionTop < triggerBottom){
      section.classList.add('active');
    }
  });

  testimonials.forEach(testimonial => {
    const testimonialTop = testimonial.getBoundingClientRect().top;
    if(testimonialTop < triggerBottom){
      testimonial.style.opacity = '1';
      testimonial.style.transform = 'translateY(0)';
    }
  });
});
