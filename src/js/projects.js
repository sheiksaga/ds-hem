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
     Render Cards (Accordion Style)
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
      card.className = 'project-card';
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-label', project.title + ' — ' + project.tagline);
      card.setAttribute('tabindex', '0');

      // --- Header row (accordion header) ---
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

      // Chevron (accordion icon — + that rotates to ×)
      var chevron = document.createElement('span');
      chevron.className = 'card-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '+';
      header.appendChild(chevron);

      // --- Accordion panel (expandable body) ---
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

      // --- Event listeners (accordion behavior) ---
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

    // All accordions start closed — user clicks to open
  }

  /* ===================================================
     Toggle Accordion (close siblings, toggle clicked)
     Matches the accordion behavior in main.js
     =================================================== */
  function toggleCard(index) {
    var cards = deck.querySelectorAll('.project-card');
    if (!cards[index]) return;

    var isCurrentlySelected = cards[index].classList.contains('selected');

    // Close all
    cards.forEach(function(c, i) {
      c.classList.remove('selected');
      c.setAttribute('aria-expanded', 'false');
    });

    // If clicking the already-open one, just close it (no re-open)
    if (isCurrentlySelected) {
      selectedIndex = -1;
      return;
    }

    // Open clicked one
    cards[index].classList.add('selected');
    cards[index].setAttribute('aria-expanded', 'true');
    selectedIndex = index;

    // Scroll into view if partially hidden
    cards[index].scrollIntoView({ block: 'nearest' });
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
