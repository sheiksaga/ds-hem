(function() {
  'use strict';

  var deck = document.querySelector('.client-work-deck');
  if (!deck) return;

  var selectedIndex = -1;

  /* ===================================================
     Skeleton Loader
     =================================================== */
  function showSkeleton() {
    deck.innerHTML = '';
    var skel = document.createElement('div');
    skel.className = 'skeleton-card';
    skel.innerHTML =
      '<div class="skeleton-line"></div>' +
      '<div class="skeleton-line"></div>';
    deck.appendChild(skel);
  }

  /* ===================================================
     Show Error / Empty State
     =================================================== */
  function showEmpty(message) {
    deck.innerHTML =
      '<div class="empty-state">' +
        '<span class="empty-icon">🤝</span>' +
        '<p>' + message + '</p>' +
      '</div>';
  }

  /* ===================================================
     Render Cards (Accordion Style)
     =================================================== */
  function renderCards(clients) {
    deck.innerHTML = '';
    selectedIndex = -1;

    if (!clients.length) {
      showEmpty('No client work listed yet.');
      return;
    }

    clients.forEach(function(client, index) {
      var card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-label', client.name + (client.scope ? ' — ' + client.scope : ''));
      card.setAttribute('tabindex', '0');

      // --- Header row ---
      var header = document.createElement('div');
      header.className = 'card-header';

      var headerLeft = document.createElement('div');
      headerLeft.className = 'card-header-left';

      var title = document.createElement('h3');
      title.textContent = client.name;
      headerLeft.appendChild(title);

      // Scope / role badge
      if (client.scope) {
        var scope = document.createElement('span');
        scope.className = 'card-scope';
        scope.textContent = client.scope;
        headerLeft.appendChild(scope);
      }

      header.appendChild(headerLeft);

      // Chevron
      var chevron = document.createElement('span');
      chevron.className = 'card-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '+';
      header.appendChild(chevron);

      // --- Body ---
      var body = document.createElement('div');
      body.className = 'card-body';

      if (client.description) {
        var desc = document.createElement('p');
        desc.className = 'description';
        desc.textContent = client.description;
        body.appendChild(desc);
      }

      if (client.url) {
        var link = document.createElement('a');
        link.className = 'project-link';
        link.href = client.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = (client.linkLabel || 'Visit site') + ' <span class="link-arrow">→</span>';
        body.appendChild(link);
      }

      card.appendChild(header);
      card.appendChild(body);

      // --- Accordion behavior ---
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
  }

  /* ===================================================
     Toggle Accordion (close siblings, toggle clicked)
     =================================================== */
  function toggleCard(index) {
    var cards = deck.querySelectorAll('.project-card');
    if (!cards[index]) return;

    var isCurrentlySelected = cards[index].classList.contains('selected');

    cards.forEach(function(c) {
      c.classList.remove('selected');
      c.setAttribute('aria-expanded', 'false');
    });

    if (isCurrentlySelected) {
      selectedIndex = -1;
      return;
    }

    cards[index].classList.add('selected');
    cards[index].setAttribute('aria-expanded', 'true');
    selectedIndex = index;

    cards[index].scrollIntoView({ block: 'nearest' });
  }

  /* ===================================================
     Fetch & Init
     =================================================== */
  showSkeleton();

  fetch('./client-work.json')
    .then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function(clients) {
      renderCards(clients);
    })
    .catch(function(err) {
      showEmpty('Could not load client work. Check back later!');
      console.warn('Client work load error:', err);
    });
})();
