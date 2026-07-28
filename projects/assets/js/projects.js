(function() {
  'use strict';

  var deck = document.querySelector('.projects-deck');
  if (!deck) return;

  var selectedIndex = -1;
  var projectsData = [];

  /* ===================================================
     Skeleton Loader
     =================================================== */
  function showSkeleton() {
    deck.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      var skel = document.createElement('div');
      skel.className = 'skeleton-card';
      skel.innerHTML =
        '<div class="skeleton-line"></div>' +
        '<div class="skeleton-line"></div>' +
        '<div class="skeleton-line"></div>';
      deck.appendChild(skel);
    }
  }

  /* ===================================================
     Show Error / Empty State
     =================================================== */
  function showEmpty(message, icon) {
    deck.innerHTML =
      '<div class="empty-state">' +
        '<span class="empty-icon">' + (icon || '📭') + '</span>' +
        '<p>' + message + '</p>' +
      '</div>';
  }

  /* ===================================================
     Render Cards
     =================================================== */
  function renderCards(projects) {
    deck.innerHTML = '';
    selectedIndex = -1;
    projectsData = projects;

    if (!projects.length) {
      showEmpty('No projects yet. Check back soon!', '🚧');
      return;
    }

    projects.forEach(function(project, index) {
      var card = document.createElement('article');
      card.className = 'project-card card-entering';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-label', project.title + ' — ' + project.tagline);

      // --- Header row ---
      var header = document.createElement('div');
      header.className = 'card-header';

      var headerLeft = document.createElement('div');
      headerLeft.className = 'card-header-left';

      var title = document.createElement('h3');
      title.textContent = project.title;

      headerLeft.appendChild(title);

      // Year badge
      if (project.year) {
        var year = document.createElement('span');
        year.className = 'card-year';
        year.textContent = project.year;
        headerLeft.appendChild(year);
      }

      // Status dot
      if (project.status) {
        var dot = document.createElement('span');
        dot.className = 'card-status' + (project.status === 'wip' ? ' wip' : '');
        dot.title = project.status === 'wip' ? 'Work in progress' : 'Live';
        headerLeft.appendChild(dot);
      }

      header.appendChild(headerLeft);

      // Chevron — click affordance
      var chevron = document.createElement('span');
      chevron.className = 'card-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '▾';
      header.appendChild(chevron);

      // --- Expandable body ---
      var body = document.createElement('div');
      body.className = 'card-body';

      var tagline = document.createElement('p');
      tagline.className = 'tagline';
      tagline.textContent = project.tagline;

      var desc = document.createElement('p');
      desc.className = 'description';
      desc.textContent = project.description || '';

      // Tags
      var tagsRow = document.createElement('div');
      tagsRow.className = 'card-tags';
      if (project.tags && project.tags.length) {
        project.tags.forEach(function(tag) {
          var tagEl = document.createElement('span');
          tagEl.className = 'card-tag';
          tagEl.textContent = tag;
          tagsRow.appendChild(tagEl);
        });
      }

      // Visit link
      var link = document.createElement('a');
      link.className = 'project-link';
      link.href = project.url;
      link.innerHTML = 'View project <span class="link-arrow">→</span>';

      body.appendChild(tagline);
      body.appendChild(desc);
      body.appendChild(tagsRow);
      body.appendChild(link);

      // Assemble card
      card.appendChild(header);
      card.appendChild(body);

      // --- Event listeners ---
      card.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') return; // let link clicks through
        toggleCard(index);
      });

      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(index);
        }
      });

      deck.appendChild(card);
    });

    // Trigger entrance animations
    requestAnimationFrame(function() {
      animateCardsIn();
    });

    // Auto-expand bottom-most card after a short delay
    setTimeout(function() {
      if (projects.length > 0 && selectedIndex === -1) {
        toggleCard(projects.length - 1);
      }
    }, 500);
  }

  /* ===================================================
     Toggle Card Expand / Collapse
     =================================================== */
  function toggleCard(index) {
    var cards = deck.querySelectorAll('.project-card');
    if (!cards[index]) return;

    var isCurrentlySelected = cards[index].classList.contains('selected');

    // If clicking the already-selected card, collapse it
    if (isCurrentlySelected) {
      cards[index].classList.remove('selected');
      cards[index].setAttribute('aria-expanded', 'false');
      selectedIndex = -1;
      return;
    }

    // Collapse previously selected card
    if (selectedIndex >= 0 && cards[selectedIndex]) {
      cards[selectedIndex].classList.remove('selected');
      cards[selectedIndex].setAttribute('aria-expanded', 'false');
    }

    // Expand clicked card
    cards[index].classList.add('selected');
    cards[index].setAttribute('aria-expanded', 'true');
    selectedIndex = index;

    // Subtle GSAP nudge if available
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(cards[index],
        { y: -2 },
        { y: -6, duration: 0.35, ease: 'power2.out' }
      );
    }

    // Scroll card into view if partially hidden
    cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ===================================================
     Scroll-Triggered Entrance Animations
     =================================================== */
  function animateCardsIn() {
    var cards = deck.querySelectorAll('.project-card');
    if (!cards.length) return;

    // If GSAP + ScrollTrigger available, use them
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      try {
        gsap.registerPlugin(ScrollTrigger);

        cards.forEach(function(card, i) {
          gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        });
        return;
      } catch (e) {
        // Fall through to CSS-based entrance
      }
    }

    // CSS-based fallback: add .card-visible after a frame
    cards.forEach(function(card, i) {
      setTimeout(function() {
        card.classList.add('card-visible');
      }, i * 80);
    });
  }

  /* ===================================================
     Fetch & Init
     =================================================== */
  showSkeleton();

  fetch('./projects.json')
    .then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function(projects) {
      renderCards(projects);
    })
    .catch(function(err) {
      showEmpty('Could not load projects. Check back later!', '⚡');
      console.warn('Projects load error:', err);
    });
})();
