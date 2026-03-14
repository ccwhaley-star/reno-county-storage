// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      const openBtn = openItem.querySelector('.faq-question');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

// Location tabs (size guide page)
document.querySelectorAll('.location-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update active tab
    document.querySelectorAll('.location-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show target content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById('tab-' + target);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-in').forEach(el => {
  observer.observe(el);
});

// Sticky header shadow on scroll
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 1px 10px rgba(0,0,0,0.06)';
    }
  }, { passive: true });
}
