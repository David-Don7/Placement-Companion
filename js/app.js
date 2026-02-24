/* ============================================
   PLACEMENT COMPANION — Shared JavaScript
   ============================================ */

// ---- Sidebar Toggle (responsive) ----
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

// Close sidebar when clicking a nav link on mobile
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav link close
  if (window.innerWidth <= 1024) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      });
    });
  }

  // ---- Scroll-triggered animations ----
  const animatedEls = document.querySelectorAll(
    '.animate-fade-up, .animate-fade-in, .animate-fade-left, .animate-slide-right, .animate-scale-in'
  );

  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.visibility = 'visible';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedEls.forEach(el => {
      // Elements start visible by default (CSS animations handle the entrance)
      observer.observe(el);
    });
  }

  // ---- Tab switching (generic) ----
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });

  // ---- Keyboard shortcut: Escape to close modals ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
    }
  });

  // ---- Topbar scroll effect ----
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        topbar.style.boxShadow = 'var(--shadow)';
      } else {
        topbar.style.boxShadow = 'none';
      }
    });
  }
});

// ---- Toast Notification Helper ----
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '<i class="fa-solid fa-circle-check" style="color:var(--success);font-size:1.2rem;"></i>',
    error: '<i class="fa-solid fa-circle-xmark" style="color:var(--danger);font-size:1.2rem;"></i>',
    info: '<i class="fa-solid fa-circle-info" style="color:var(--info);font-size:1.2rem;"></i>'
  };

  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
