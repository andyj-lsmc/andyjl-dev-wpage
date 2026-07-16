const revealElements = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const typingTitle = document.querySelector('.typing-title');

yearNode.textContent = new Date().getFullYear();

// Barra de progreso de lectura (Scroll Progress Bar)
window.addEventListener('scroll', () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
  const indicator = document.getElementById('scroll-indicator');
  if (indicator) {
    indicator.style.width = `${scrollPercent}%`;
  }
});

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

const hoverGlowCards = document.querySelectorAll('.project-card, .info-card, .hero-card');

hoverGlowCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    if (card.classList.contains('tilt-card')) {
      const offsetX = x / bounds.width - 0.5;
      const offsetY = y / bounds.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${offsetY * -4}deg) rotateY(${offsetX * 6}deg) translateY(-4px)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('tilt-card')) {
      card.style.transform = '';
    }
  });
});

/* --- LÓGICA DEL MODAL DE DETALLE DE PROYECTO --- */
const projectData = {
  consultoria: {
    title: 'Consultoría elegante',
    category: 'Web institucional',
    img: 'images/proyecto-consultoria.png',
    descMain: 'Una landing page premium diseñada para firmas de consultoría y asesoría empresarial. Su objetivo es transmitir una imagen impecable de confianza, solidez y profesionalismo mediante el uso de microinteracciones controladas y un contraste limpio.',
    challenge: 'El principal reto fue equilibrar una estética sobria e institucional con dinamismo visual moderno. Se implementó una jerarquía tipográfica rigurosa combinada con animaciones de entrada progresivas para asegurar que el mensaje de valor se comunique sin distracciones.',
    tags: ['HTML semántico', 'CSS moderno', 'JavaScript', 'Accesibilidad (a11y)', 'Optimización SEO'],
    demoUrl: '#contacto',
    codeUrl: 'https://github.com'
  },
  dashboard: {
    title: 'Panel operativo',
    category: 'Dashboard',
    img: 'images/proyecto-dashboard.png',
    descMain: 'Un tablero de control intuitivo diseñado para la lectura de datos complejos de manera inmediata. Integra componentes modulares y gráficos interactivos pensados para simplificar flujos de trabajo diarios.',
    challenge: 'El desafío fue estructurar múltiples paneles y telemetría en tiempo real sin fatigar la vista del operador. Se resolvió aplicando una paleta de colores de bajo contraste en modo oscuro con acentos lumínicos en verde y azul, optimizando la lectura en jornadas prolongadas.',
    tags: ['React', 'CSS Custom Variables', 'Manejo de Estados', 'Componentes UI', 'Performance'],
    demoUrl: '#contacto',
    codeUrl: 'https://github.com'
  },
  marca: {
    title: 'Plataforma de marca',
    category: 'Producto digital',
    img: 'images/proyecto-marca.png',
    descMain: 'Un espacio digital inmersivo que utiliza el storytelling visual para presentar la identidad, el catálogo de productos exclusivos y la filosofía artesanal de una marca premium.',
    challenge: 'Lograr una transición suave entre el modo de exhibición de producto y los flujos de compra, manteniendo la experiencia artística de la marca. Se crearon bloques narrativos continuos y animaciones fluidas al hacer scroll para retener al usuario.',
    tags: ['JavaScript ES6', 'Animaciones CSS', 'UI/UX', 'Storytelling', 'Ventas Digitales'],
    demoUrl: '#contacto',
    codeUrl: 'https://github.com'
  }
};

const modal = document.getElementById('project-modal');
const modalImage = document.getElementById('modal-image');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalDescMain = document.getElementById('modal-desc-main');
const modalDescChallenge = document.getElementById('modal-desc-challenge');
const modalTags = document.getElementById('modal-tags');
const modalLinkDemo = document.getElementById('modal-link-demo');
const modalLinkCode = document.getElementById('modal-link-code');
const modalClose = document.getElementById('modal-close');
const detailButtons = document.querySelectorAll('.btn-detail');

let lastActiveElement = null;

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  // Guardar el elemento que tenía el foco activo
  lastActiveElement = document.activeElement;

  // Llenar contenido
  modalImage.src = data.img;
  modalImage.alt = `Captura de pantalla de ${data.title}`;
  modalCategory.textContent = data.category;
  modalTitle.textContent = data.title;
  modalDescMain.textContent = data.descMain;
  modalDescChallenge.textContent = data.challenge;

  // Llenar etiquetas de tecnologías
  modalTags.innerHTML = '';
  data.tags.forEach(tag => {
    const li = document.createElement('li');
    li.textContent = tag;
    modalTags.appendChild(li);
  });

  // Llenar enlaces
  modalLinkDemo.href = data.demoUrl;
  modalLinkCode.href = data.codeUrl;

  // Mostrar modal con transición
  modal.classList.add('is-active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo

  // Mover el foco al botón de cerrar
  setTimeout(() => {
    modalClose.focus();
  }, 100);
}

function closeModal() {
  modal.classList.remove('is-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Habilitar scroll del fondo

  // Restaurar el foco al botón original
  if (lastActiveElement) {
    lastActiveElement.focus();
  }
}

// Event Listeners
detailButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const projectId = btn.dataset.project;
    openModal(projectId);
  });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  // Cerrar si se hace clic fuera de la tarjeta (en el overlay)
  if (e.target === modal) {
    closeModal();
  }
});

// Manejo de teclado (Cerrar con Escape y atrapar foco / Trap Focus)
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('is-active')) return;

  // Cerrar con Escape
  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  // Atrapar el foco (Trap Focus)
  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
});

/* ================================================
   HAMBURGER MENU
   ================================================ */
const hamburger = document.getElementById('hamburger-btn');
const mainNav = document.getElementById('main-nav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en un enlace
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ================================================
   ACTIVE NAV (SCROLL SPY)
   ================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
);

sections.forEach(section => navObserver.observe(section));

/* ================================================
   THEME TOGGLE
   ================================================ */
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
}

// Cargar tema guardado o respetar preferencia del sistema
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  setTheme('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

/* ================================================
   TESTIMONIALS CAROUSEL
   ================================================ */
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.carousel-dots .dot');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
let currentSlide = 0;
let autoplayInterval = null;

function goToSlide(index) {
  slides.forEach(s => s.classList.remove('is-active'));
  dots.forEach(d => {
    d.classList.remove('is-active');
    d.setAttribute('aria-selected', 'false');
  });

  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('is-active');
  dots[currentSlide].classList.add('is-active');
  dots[currentSlide].setAttribute('aria-selected', 'true');
}

function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

function stopAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
}

if (slides.length > 0) {
  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
  });

  // Pausar autoplay al pasar el mouse
  const carouselEl = document.querySelector('.testimonial-carousel');
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ================================================
   PARTICLE CANVAS
   ================================================ */
const canvas = document.getElementById('particle-canvas');

if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 22000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        hue: Math.random() < 0.5 ? 168 : 252 // teal or purple
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = htmlElement.getAttribute('data-theme') !== 'light';
    const baseAlpha = isDark ? 0.35 : 0.2;
    const lineAlpha = isDark ? 0.06 : 0.04;

    particles.forEach((p, i) => {
      // Repulsión sutil del cursor
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.4;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Movimiento
      p.x += p.vx;
      p.y += p.vy;

      // Rebote en bordes
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));

      // Dibujar partícula
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${baseAlpha})`;
      ctx.fill();

      // Conexiones entre partículas cercanas
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(${p.hue}, 60%, 60%, ${lineAlpha * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

  resizeCanvas();
  createParticles();
  drawParticles();
}

/* ================================================
   CONTACT FORM VALIDATION
   ================================================ */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  const fields = {
    name: {
      el: document.getElementById('form-name'),
      error: document.getElementById('error-name'),
      validate: v => v.trim().length >= 2 ? '' : 'Ingresa tu nombre (mínimo 2 caracteres).'
    },
    email: {
      el: document.getElementById('form-email'),
      error: document.getElementById('error-email'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresa un email válido.'
    },
    message: {
      el: document.getElementById('form-message'),
      error: document.getElementById('error-message'),
      validate: v => v.trim().length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres.'
    }
  };

  // Validación en tiempo real
  Object.values(fields).forEach(field => {
    field.el.addEventListener('input', () => {
      const msg = field.validate(field.el.value);
      const group = field.el.closest('.form-group');
      field.error.textContent = msg;
      group.classList.toggle('has-error', msg !== '');
      group.classList.toggle('is-valid', msg === '' && field.el.value.trim() !== '');
    });
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(field => {
      const msg = field.validate(field.el.value);
      const group = field.el.closest('.form-group');
      field.error.textContent = msg;
      group.classList.toggle('has-error', msg !== '');
      group.classList.toggle('is-valid', msg === '' && field.el.value.trim() !== '');
      if (msg) valid = false;
    });

    if (valid) {
      formSuccess.classList.add('is-visible');
      formSuccess.setAttribute('aria-hidden', 'false');

      setTimeout(() => {
        formSuccess.classList.remove('is-visible');
        formSuccess.setAttribute('aria-hidden', 'true');
        contactForm.reset();
        Object.values(fields).forEach(field => {
          const group = field.el.closest('.form-group');
          group.classList.remove('is-valid', 'has-error');
          field.error.textContent = '';
        });
      }, 4000);
    }
  });
}