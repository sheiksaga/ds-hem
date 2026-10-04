/**
 * Design Saga — theme toggle
 * Peeking sphere (top-right) + custom cursor ring + circular "bleed"
 * reveal via the View Transitions API (graceful fallback to instant).
 *
 * Default is light. On first visit the OS preference wins; once the
 * user toggles, their choice is stored and takes priority.
 */
(function () {
  var STORAGE_KEY = 'ds-theme';
  var root = document.documentElement;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var hoverQuery = window.matchMedia('(hover: hover)');

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    var dark = theme === 'dark';
    root.setAttribute('data-theme', theme);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#000000' : '#ffffff');

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // ── Cursor ring + expanded state (pointer devices only) ──────
  // Hover is derived from pointer coordinates instead of :hover, because a
  // running View Transition overlays the page and drops the hover state —
  // which made the sphere collapse and slide back out after every click.
  function initPointer(btn) {
    if (!hoverQuery.matches) return;

    var cursor = document.createElement('div');
    cursor.className = 'theme-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    var x = -100, y = -100, tx = x, ty = y;
    var rect = btn.getBoundingClientRect();
    var inside = false;

    window.addEventListener('resize', function () {
      rect = btn.getBoundingClientRect();
    }, { passive: true });

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;

      var nowInside = tx >= rect.left && tx <= rect.right &&
                      ty >= rect.top && ty <= rect.bottom;
      if (nowInside !== inside) {
        inside = nowInside;
        btn.classList.toggle('is-expanded', inside);
        cursor.classList.toggle('is-visible', inside);
      }
    }, { passive: true });

    (function follow() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      // left/top (not transform) keeps the ring out of a stacking context,
      // so its mix-blend-mode still reaches the page underneath.
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
      requestAnimationFrame(follow);
    })();

    btn.addEventListener('focus', function () { btn.classList.add('is-expanded'); });
    btn.addEventListener('blur', function () {
      btn.classList.remove('is-expanded');
      cursor.classList.remove('is-visible');
    });
  }

  // ── Circular bleed ──────────────────────────────────────────
  function bleed(originX, originY, next) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function change() {
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    }

    if (!document.startViewTransition || reduce) {
      change();
      return;
    }

    var radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY)
    );

    var transition = document.startViewTransition(change);

    transition.ready.then(function () {
      document.documentElement.animate(
        {
          clipPath: [
            'circle(0px at ' + originX + 'px ' + originY + 'px)',
            'circle(' + radius + 'px at ' + originX + 'px ' + originY + 'px)'
          ]
        },
        {
          duration: 620,
          easing: 'cubic-bezier(.4, 0, .2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  }

  // ── Wire up ─────────────────────────────────────────────────
  function init() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var sphere = btn.querySelector('.theme-toggle__sphere');
    initPointer(btn);

    btn.addEventListener('click', function (e) {
      var next = current() === 'dark' ? 'light' : 'dark';
      var originX, originY;

      if (hoverQuery.matches) {
        originX = e.clientX;
        originY = e.clientY;
      } else {
        // Touch: bleed from the sphere itself, with a little pop.
        var r = (sphere || btn).getBoundingClientRect();
        originX = r.left + r.width / 2;
        originY = r.top + r.height / 2;
        btn.classList.add('is-popping');
        setTimeout(function () { btn.classList.remove('is-popping'); }, 360);
      }

      bleed(originX, originY, next);
    });

    // Follow OS changes while the user hasn't made an explicit choice.
    function onSchemeChange(e) {
      if (!stored()) apply(e.matches ? 'dark' : 'light');
    }
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', onSchemeChange);
    else if (darkQuery.addListener) darkQuery.addListener(onSchemeChange);

    apply(current());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
