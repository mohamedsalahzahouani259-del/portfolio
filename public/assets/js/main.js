/**
 * PORTFOLIO MOHAMED SALAH ZAHOUANI
 * Vanilla JavaScript pour les interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 2. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // 3. Project Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 4. Project Modal Details
  const projectDetails = {
    foody: {
      title: "Foody — Système d'accueil téléphonique par IA",
      client: "Restaurant Foody (France)",
      category: "Automatisation & Voice AI",
      description: "Ce système révolutionne la réception téléphonique du restaurant Foody en France. Grâce à une intelligence artificielle vocale connectée à la téléphonie, 100% des appels entrants sont traités instantanément sans mobiliser le personnel de cuisine ou de salle.",
      features: [
        "Décrochage instantané 24h/24 et 7j/7 lors des pics d'affluence et fermetures.",
        "Compréhension naturelle du langage et accent français avec latence ultra-faible.",
        "Prise de commande vocale complète et enregistrement des réservations de tables.",
        "Gestion automatique des questions récurrentes (horaires, carte, allergènes, parking).",
        "Envoi instantané d'un récapitulatif par SMS / WhatsApp au client et notification au restaurant."
      ],
      tech: ["Voice AI", "LLM / OpenAI", "Téléphonie Webhooks", "Node.js", "WhatsApp API"]
    },
    smokehouse: {
      title: "Smoke House — Plateforme Web & Restaurant Grill",
      client: "Restaurant Smoke House",
      category: "Développement Web",
      description: "Conception complète d'un site web immersif et moderne pour mettre en valeur les spécialités de viandes fumées au barbecue et l'ambiance chaleureuse du restaurant.",
      features: [
        "Menu interactif et visuel classé par catégories gourmandes.",
        "Module de réservation de table en ligne avec confirmation immédiate.",
        "Galerie photo haute définition des plats phares et de la salle.",
        "Optimisation complète pour mobiles et chargement ultra-rapide.",
        "Intégration Google Maps et appel direct en 1 clic."
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "SEO Restauration"]
    },
    darbaya: {
      title: "Dar Baya — Site Web Gastronomique & Traditionnel",
      client: "Restaurant Dar Baya",
      category: "Développement Web & UI/UX",
      description: "Création d'une vitrine en ligne haut de gamme reflétant le charme, l'authenticité et le raffinement culinaire du restaurant Dar Baya.",
      features: [
        "Direction artistique élégante valorisant le patrimoine et l'art de la table.",
        "Carte gastronomique digitale détaillée avec suggestions du chef.",
        "Formulaire de réservation personnalisé pour les déjeuners et dîners.",
        "Section avis clients et mise en valeur des événements privés.",
        "Expérience fluide sur tous les formats d'écrans."
      ],
      tech: ["HTML5", "CSS3", "UI/UX Design", "Optimisation Mobile", "Micro-animations"]
    },
    pervoi: {
      title: "Pervoi — Site Web & Expérience Culinaire",
      client: "Restaurant & Lounge Pervoi",
      category: "Développement Web",
      description: "Interface web moderne, dynamique et soignée pour le restaurant Pervoi, pensée pour maximiser la conversion des visiteurs en clients fidèles.",
      features: [
        "Design moderne et épuré axé sur l'atmosphère et les cocktails/plats signatures.",
        "Navigation intuitive pensée 'mobile-first' pour les clients en déplacement.",
        "Boutons d'action rapides (Appeler, Réserver, Itinéraire GPS).",
        "Présentation des horaires et des événements spéciaux du restaurant.",
        "Code léger pour un affichage instantané même en 4G."
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Performance Web", "SEO Local"]
    }
  };

  const modalBackdrop = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  window.openProjectModal = function(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-cyan); font-weight: 700;">
          ${data.category} • ${data.client}
        </span>
        <h3 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-top: 6px; color: #fff;">
          ${data.title}
        </h3>
      </div>
      <p style="color: var(--text-sub); font-size: 1rem; line-height: 1.7; margin-bottom: 24px;">
        ${data.description}
      </p>
      
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Points clés & fonctionnalités réalisées :
        </h4>
        <ul style="display: flex; flex-direction: column; gap: 10px;">
          ${data.features.map(feat => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.88rem; color: var(--text-muted);">
              <span style="color: var(--accent-emerald); font-weight: bold; margin-top: 2px;">✓</span>
              <span>${feat}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 10px;">Technologies utilisées</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.tech.map(t => `<span class="tech-tag" style="background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.3); color: #fff;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 18px;">
        <button class="btn-secondary" onclick="closeProjectModal()">Fermer</button>
        <a href="#contact" class="btn-primary" onclick="closeProjectModal()">Discuter d'un projet similaire</a>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
    }
  });

  // 5. Contact Form Simulation & Toast
  const contactForm = document.getElementById('contactForm');
  const toastMsg = document.getElementById('toastMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Envoi en cours...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        // Show Toast
        if (toastMsg) {
          toastMsg.classList.add('show');
          setTimeout(() => {
            toastMsg.classList.remove('show');
          }, 4000);
        }
      }, 1000);
    });
  }
});
