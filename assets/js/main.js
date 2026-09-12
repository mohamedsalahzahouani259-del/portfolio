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

  // 6. Client Reviews & Interactive Star Picker
  const starPicker = document.getElementById('starPicker');
  const starButtons = document.querySelectorAll('.star-pick-btn');
  const selectedRatingInput = document.getElementById('selectedRating');
  const starValueText = document.getElementById('starValueText');
  const reviewForm = document.getElementById('reviewForm');
  const userReviewsContainer = document.getElementById('userReviewsContainer');

  const ratingDescriptions = {
    1: '1 étoile — À améliorer',
    2: '2 étoiles — Passable',
    3: '3 étoiles — Bon travail',
    4: '4 étoiles — Très bon !',
    5: '5 étoiles — Excellent !'
  };

  function updateStarDisplay(rating) {
    starButtons.forEach(btn => {
      const btnRating = parseInt(btn.getAttribute('data-rating'), 10);
      if (btnRating <= rating) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    if (starValueText && ratingDescriptions[rating]) {
      starValueText.textContent = ratingDescriptions[rating];
    }
  }

  if (starPicker && starButtons.length > 0) {
    starButtons.forEach(btn => {
      // Hover effect
      btn.addEventListener('mouseenter', () => {
        const hoverRating = parseInt(btn.getAttribute('data-rating'), 10);
        starButtons.forEach(b => {
          const r = parseInt(b.getAttribute('data-rating'), 10);
          if (r <= hoverRating) {
            b.classList.add('hovered');
          } else {
            b.classList.remove('hovered');
          }
        });
        if (starValueText && ratingDescriptions[hoverRating]) {
          starValueText.textContent = ratingDescriptions[hoverRating];
        }
      });

      // Click event
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.getAttribute('data-rating'), 10);
        if (selectedRatingInput) selectedRatingInput.value = rating;
        updateStarDisplay(rating);
      });
    });

    // Reset hover on mouse leave
    starPicker.addEventListener('mouseleave', () => {
      starButtons.forEach(b => b.classList.remove('hovered'));
      const currentRating = selectedRatingInput ? parseInt(selectedRatingInput.value, 10) : 5;
      updateStarDisplay(currentRating);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.substring(0, 2) || 'CL').toUpperCase();
  }

  function createReviewCardHTML(review, isNew = false) {
    const starsCount = Math.max(1, Math.min(5, parseInt(review.rating, 10) || 5));
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += i < starsCount ? '<span>★</span>' : '<span style="color: #475569;">★</span>';
    }

    const safeAuthor = escapeHTML(review.author);
    const safeEstablishment = escapeHTML(review.establishment);
    const safeMessage = escapeHTML(review.message);
    const initials = getInitials(safeAuthor);

    return `
      <div class="testimonial-card" style="${isNew ? 'border-color: rgba(16, 185, 129, 0.5);' : ''}">
        <span class="testimonial-quote-icon">“</span>
        <div class="testimonial-header">
          <div class="client-avatar" style="background: linear-gradient(135deg, #10b981, #06b6d4);">${initials}</div>
          <div class="client-info">
            <h4 style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              ${safeAuthor}
              ${isNew ? '<span class="badge-new-review">Nouveau</span>' : ''}
            </h4>
            <p>${safeEstablishment}</p>
          </div>
        </div>
        <div class="testimonial-stars">
          ${starsHtml}
        </div>
        <p class="testimonial-text">
          « ${safeMessage} »
        </p>
        <div class="testimonial-footer">
          <span class="badge-verified">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Client Vérifié
          </span>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: var(--text-muted); font-size: 0.8rem;">${review.date || 'Récemment'}</span>
            <button type="button" class="btn-delete-review" onclick="deleteReview('${review.id}')" title="Supprimer cet avis" aria-label="Supprimer cet avis">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Load saved reviews from localStorage (v2 clean storage - efface l'avis de test SSS/RRRR)
  const STORAGE_KEY = 'msz_portfolio_client_reviews_v2';
  try {
    localStorage.removeItem('msz_portfolio_client_reviews');
  } catch (e) {}

  const emptyReviewsMsg = document.getElementById('emptyReviewsMessage');

  function updateEmptyMessageState(hasReviews) {
    if (emptyReviewsMsg) {
      emptyReviewsMsg.style.display = hasReviews ? 'none' : 'block';
    }
  }

  window.deleteReview = function(reviewId) {
    if (confirm('Voulez-vous vraiment supprimer cet avis ?')) {
      try {
        let existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        existing = existing.filter(r => String(r.id) !== String(reviewId));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        loadSavedReviews();
      } catch (err) {
        console.warn('Could not delete review', err);
      }
    }
  };

  function loadSavedReviews() {
    if (!userReviewsContainer) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const reviews = JSON.parse(saved);
        if (Array.isArray(reviews) && reviews.length > 0) {
          let html = '';
          reviews.forEach(rev => {
            html += createReviewCardHTML(rev, false);
          });
          userReviewsContainer.innerHTML = html;
          updateEmptyMessageState(true);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not load reviews from localStorage', e);
    }
    userReviewsContainer.innerHTML = '';
    updateEmptyMessageState(false);
  }

  loadSavedReviews();

  // Handle Review Submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const authorInput = document.getElementById('reviewAuthor');
      const establishmentInput = document.getElementById('reviewEstablishment');
      const messageInput = document.getElementById('reviewMessage');

      const author = authorInput ? authorInput.value.trim() : '';
      const establishment = establishmentInput ? establishmentInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const rating = selectedRatingInput ? parseInt(selectedRatingInput.value, 10) : 5;

      if (!author || !establishment || !message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      // Date complète : Jour, Mois, Année (ex: 12 septembre 2026)
      const today = new Date();
      const formattedDate = today.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const newReview = {
        id: Date.now(),
        author,
        establishment,
        rating,
        message,
        date: formattedDate
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        existing.unshift(newReview);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch (err) {
        console.warn('Could not save review to localStorage', err);
      }

      // Prepend to DOM
      if (userReviewsContainer) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = createReviewCardHTML(newReview, true);
        const cardElement = tempDiv.firstElementChild;
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(-20px)';
        userReviewsContainer.prepend(cardElement);

        setTimeout(() => {
          cardElement.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          cardElement.style.opacity = '1';
          cardElement.style.transform = 'translateY(0)';
        }, 50);

        updateEmptyMessageState(true);
      }

      // Reset form
      reviewForm.reset();
      if (selectedRatingInput) selectedRatingInput.value = '5';
      updateStarDisplay(5);

      // Toast notification
      if (toastMsg) {
        toastMsg.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Merci infiniment ! Votre avis a été publié avec succès.</span>
        `;
        toastMsg.classList.add('show');
        setTimeout(() => {
          toastMsg.classList.remove('show');
        }, 5000);
      }

      // Smooth scroll back to the reviews
      const testimonialsSec = document.getElementById('testimonials');
      if (testimonialsSec) {
        testimonialsSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 7. Contact Form Simulation & Toast
  const contactForm = document.getElementById('contactForm');
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
          toastMsg.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Merci ! Votre message a bien été envoyé. Je vous répondrai très rapidement.</span>
          `;
          toastMsg.classList.add('show');
          setTimeout(() => {
            toastMsg.classList.remove('show');
          }, 4000);
        }
      }, 1000);
    });
  }
});
