/* ==========================================================================
   solutions.exe — Interactividad principal (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initCounters();
  initProjectFilters();
  initProjectModal();
  initBillingToggle();
  initFAQ();
  initContactForm();
  setCurrentYear();
});

/* 1. Tema Claro / Oscuro con persistencia */
function initTheme() {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const storageKey = 'solutions-exe-theme';
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    html.setAttribute('data-theme', savedTheme);
  }

  toggleBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(storageKey, next);
  });
}

/* 2. Navegación móvil y cierre automático */
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!menuToggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* 3. Botón volver arriba */
function initScrollEffects() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  const onScroll = () => {
    backToTop.hidden = window.scrollY < 480;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* 4. Contadores discretos de estadísticas */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const duration = 700;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.floor(eased * target)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => observer.observe(el));
  } else {
    counters.forEach(animateCounter);
  }
}

/* 5. Filtro de casos de éxito */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
}

/* 6. Modal con detalles de proyectos */
const PROJECTS_DATA = {
  finflow: {
    category: 'Web & SaaS · Fintech',
    title: 'FinFlow — Banca Corporativa',
    summary: 'Plataforma web de gestión de tesorería multi-moneda para pymes y empresas medianas.',
    metrics: ['+64% conversión', '38 ms p95', '99.99% uptime'],
    challenge: 'La interfaz anterior presentaba tiempos de carga superiores a 5 segundos y alta fricción en la conciliación bancaria diaria.',
    solution: 'Reconstruimos el frontend con arquitectura modular, caché inteligente, diseño centrado en flujos financieros y auditoría de seguridad OWASP.'
  },
  logitrack: {
    category: 'Cloud & DevOps · Logística',
    title: 'LogiTrack — Infraestructura Global',
    summary: 'Arquitectura orientada a eventos para rastreo satelital en tiempo real en 12 países.',
    metrics: ['-42% costos AWS', '2M eventos/día', 'Zero-downtime'],
    challenge: 'Picos de tráfico impredecibles provocaban caídas en el procesamiento de ubicaciones y sobrecostos mensuales en la nube.',
    solution: 'Migramos a Kubernetes con autoescalado predictivo, infraestructura como código en Terraform y observabilidad centralizada.'
  },
  medicore: {
    category: 'IA & Automatización · Salud',
    title: 'MediCore — Asistente Clínico IA',
    summary: 'Buscador semántico sobre protocolos médicos y automatización de resúmenes administrativos.',
    metrics: ['-70% tiempo soporte', '100% trazabilidad', 'Privacidad HIPAA'],
    challenge: 'El personal dedicaba horas a consultar manuales internos extensos y redactar reportes repetitivos.',
    solution: 'Implementamos un sistema RAG con control de acceso por roles, citas verificables a documentos fuente y despliegue en nube privada.'
  },
  voltgo: {
    category: 'Mobile · Movilidad Eléctrica',
    title: 'VoltGo — Red de Carga Inteligente',
    summary: 'Aplicación móvil iOS y Android para localizar estaciones, reservar puertos y pagar en segundos.',
    metrics: ['4.9 ★ valoración', '+85k usuarios', 'Pago en 1 toque'],
    challenge: 'Los conductores sufrían mapas desactualizados y fallos de conexión en estacionamientos subterráneos.',
    solution: 'Creamos una app en React Native con soporte offline, actualización en vivo por WebSockets e integración segura con Stripe.'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalSummary = document.getElementById('modalSummary');
  const modalMetrics = document.getElementById('modalMetrics');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalSolution = document.getElementById('modalSolution');

  const openModal = (key) => {
    const data = PROJECTS_DATA[key];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalSummary.textContent = data.summary;
    modalChallenge.textContent = data.challenge;
    modalSolution.textContent = data.solution;
    modalMetrics.innerHTML = data.metrics.map((m) => `<span>${m}</span>`).join('');

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-project').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });

  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

/* 7. Toggle de facturación Mensual / Anual */
function initBillingToggle() {
  const switchBtn = document.getElementById('billingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');
  const prices = document.querySelectorAll('.price-value[data-monthly]');

  if (!switchBtn) return;

  switchBtn.addEventListener('click', () => {
    const isAnnual = switchBtn.getAttribute('aria-checked') !== 'true';
    switchBtn.setAttribute('aria-checked', String(isAnnual));
    labelMonthly?.classList.toggle('active', !isAnnual);
    labelAnnual?.classList.toggle('active', isAnnual);

    prices.forEach((el) => {
      const value = Number(isAnnual ? el.dataset.annual : el.dataset.monthly);
      el.textContent = value.toLocaleString('en-US');
    });
  });
}

/* 8. Acordeón FAQ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      items.forEach((other) => {
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.hidden = true;
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });
}

/* 9. Formulario de contacto con validación y preselección de servicio/plan */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const serviceSelect = document.getElementById('service');
  const messageInput = document.getElementById('message');

  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      if (serviceSelect) serviceSelect.value = link.dataset.service;
    });
  });

  document.querySelectorAll('[data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (messageInput && !messageInput.value.trim()) {
        messageInput.value = `Hola, me interesa conocer más sobre el plan "${btn.dataset.plan}".`;
      }
    });
  });

  if (!form) return;

  const setError = (field, msg) => {
    const group = field.closest('.form-group');
    const errorEl = group?.querySelector('.field-error');
    group?.classList.toggle('has-error', Boolean(msg));
    if (errorEl) errorEl.textContent = msg;
  };

  const validateField = (field) => {
    const value = field.value.trim();
    if (field.required && !value) {
      setError(field, 'Este campo es obligatorio.');
      return false;
    }
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(field, 'Ingresa un correo electrónico válido.');
      return false;
    }
    if (field.id === 'message' && value.length < 15) {
      setError(field, 'Cuéntanos un poco más (mínimo 15 caracteres).');
      return false;
    }
    setError(field, '');
    return true;
  };

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group')?.classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, select, textarea')];
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      showToast('Revisa los campos marcados antes de enviar.');
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showToast('Solicitud enviada correctamente (simulación).');
    }, 600);
  });
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 4000);
}

function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
