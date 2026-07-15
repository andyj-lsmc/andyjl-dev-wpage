const revealElements = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const typingTitle = document.querySelector('.typing-title');

yearNode.textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => observer.observe(element));

if (typingTitle) {
  const typingText = typingTitle.dataset.typingText ?? typingTitle.textContent;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  typingTitle.setAttribute('aria-label', typingText);

  if (prefersReducedMotion) {
    typingTitle.textContent = typingText;
  } else {
    typingTitle.textContent = '';
    typingTitle.classList.add('is-typing');

    let currentIndex = 0;
    const typingSpeed = 48;

    const typeNextCharacter = () => {
      typingTitle.textContent = typingText.slice(0, currentIndex + 1);
      currentIndex += 1;

      if (currentIndex < typingText.length) {
        window.setTimeout(typeNextCharacter, typingSpeed);
      } else {
        typingTitle.classList.remove('is-typing');
      }
    };

    window.setTimeout(typeNextCharacter, 450);
  }
}

const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const bounds = card.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.transform = `perspective(1000px) rotateX(${offsetY * -4}deg) rotateY(${offsetX * 6}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});