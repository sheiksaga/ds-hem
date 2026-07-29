/**
 * Design Saga — shared site scripts
 * Back-to-top (all pages) + "like" facts (homepage only)
 * + SPA-style page transitions
 */
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    initLikeFacts();
    initAccordion();
    initPageTransitions();
  }

  // Expose reinit so SPA navigations can re-run page-specific inits
  window.__dsReinit = function () {
    initLikeFacts();
    initAccordion();
    initPageTransitions();
  };

  // ── Accordion ────────────────────────────────────────────────
  function initAccordion() {
    var headers = document.querySelectorAll(".accordion-header");
    if (!headers.length) return;

    // All accordions start closed — user clicks to open

    headers.forEach(function (header) {
      // Avoid duplicate listeners
      var newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);
    });

    // Re-query after cloning
    headers = document.querySelectorAll(".accordion-header");
    headers.forEach(function (header) {
      header.addEventListener("click", function () {
        var expanded = header.getAttribute("aria-expanded") === "true";

        // close all panels
        document.querySelectorAll(".accordion-header").forEach(function (h) {
          h.setAttribute("aria-expanded", "false");
          var panel = h.nextElementSibling;
          if (panel) panel.classList.remove("open");
        });

        // open clicked one if it was closed
        if (!expanded) {
          header.setAttribute("aria-expanded", "true");
          var panel = header.nextElementSibling;
          if (panel) panel.classList.add("open");
        }
      });
    });
  }

  // ── "Like" facts (homepage only) ────────────────────────────
  function initLikeFacts() {
    var el = document.getElementById("likeDisplay");
    if (!el) return; // only homepage has this element

    var likes = [
      "the jabberwocky",
      "something about LLMs",
      "a good book",
      "why tea is superior to coffee on a hot day",
      "rains are a good thing when warm, actually",
      "a crackling fireplace",
      "the fact that nothing beats a good home-cooked meal",
      "the smell of old books",
      "the buzz of a sleeping city",
      "why runny egg yolks are better",
      "creating a very good pun",
    ];

    function pick() {
      el.textContent = likes[Math.floor(Math.random() * likes.length)];
    }

    pick();

    // Avoid duplicate listeners
    var newEl = el.cloneNode(true);
    el.parentNode.replaceChild(newEl, el);
    newEl.addEventListener("click", pick);
  }

  // ── SPA Page Transitions ──────────────────────────────────
  var navigationState = {
    isNavigating: false,
    previousPath: null,
  };

  function initPageTransitions() {
    // Intercept internal link clicks
    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;

      var href = link.getAttribute("href");
      if (!href) return;

      // Skip non-standard navigations
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        link.hasAttribute("download") ||
        link.getAttribute("target") === "_blank"
      )
        return;

      // Only internal links
      try {
        var url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        // Skip same-page navigation
        if (url.pathname === window.location.pathname) return;
      } catch (_) {
        return;
      }

      e.preventDefault();
      navigateTo(url.pathname + url.search + url.hash, "forward");
    });

    // Handle browser back/forward
    window.addEventListener("popstate", function (e) {
      if (navigationState.isNavigating) return;
      var path = e.state ? e.state.path : window.location.pathname;
      if (path) {
        navigateTo(path, "back", true);
      }
    });
  }

  function navigateTo(path, direction, isPopState) {
    if (navigationState.isNavigating) return;
    navigationState.isNavigating = true;

    var contentEl = document.getElementById("page-content");
    if (!contentEl) {
      // Fallback: normal navigation
      window.location.href = path;
      return;
    }

    // Save current path for back-navigation tracking
    var currentPath = window.location.pathname;

    // ── Step 1: Animate current page out ──
    contentEl.classList.remove("page-enter-from-right", "page-enter-from-left");
    if (direction === "forward") {
      contentEl.classList.add("page-exit-left");
    } else {
      contentEl.classList.add("page-exit-right");
    }

    setTimeout(function () {
      // ── Step 2: Fetch new page ──
      fetch(path)
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.text();
        })
        .then(function (html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");

          // Extract new content
          var newContent = doc.getElementById("page-content");
          if (!newContent) throw new Error("No page-content found");

          // Update document title
          document.title = doc.title;

          // Swap page-specific CSS before content renders
          updatePageCSS(doc);

          // Update URL (unless already set by popstate)
          if (!isPopState) {
            history.pushState({ path: path }, "", path);
            navigationState.previousPath = currentPath;
          } else {
            navigationState.previousPath = currentPath;
          }

          // ── Step 3: Swap content ──
          contentEl.innerHTML = newContent.innerHTML;

          // ── Step 4: Reset scroll ──
          window.scrollTo(0, 0);

          // ── Step 5: Update active nav link ──
          updateActiveNav(doc);

          // ── Step 6: Re-init common components ──
          if (window.__dsReinit) window.__dsReinit();

          // ── Step 7: Re-execute page-specific scripts ──
          reexecutePageScripts(doc);

          // ── Step 8: Quicklink re-init ──
          if (window.quicklink) {
            try {
              quicklink.listen();
            } catch (_) {}
          }

          // ── Step 9: Animate new page in ──
          contentEl.classList.remove("page-exit-left", "page-exit-right");
          // Set initial position based on direction
          if (direction === "forward") {
            contentEl.classList.add("page-enter-from-right");
          } else {
            contentEl.classList.add("page-enter-from-left");
          }

          // Force reflow
          void contentEl.offsetWidth;

          // Animate in
          contentEl.classList.remove(
            "page-enter-from-right",
            "page-enter-from-left"
          );

          navigationState.isNavigating = false;
        })
        .catch(function (err) {
          console.warn("Page transition failed, falling back:", err);
          // Fallback: normal navigation
          window.location.href = path;
          navigationState.isNavigating = false;
        });
    }, 200); // match the CSS transition duration
  }

  // ── Swap page-specific CSS during SPA navigation ──────
  function updatePageCSS(doc) {
    // Collect hrefs from new doc's stylesheets
    var newLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    var newHrefs = {};
    for (var i = 0; i < newLinks.length; i++) {
      newHrefs[newLinks[i].getAttribute('href')] = true;
    }

    // Remove stylesheets not in the new doc
    var currentLinks = document.querySelectorAll('link[rel="stylesheet"]');
    for (var j = 0; j < currentLinks.length; j++) {
      if (!newHrefs[currentLinks[j].getAttribute('href')]) {
        currentLinks[j].remove();
      }
    }

    // Add new stylesheets not already present
    var existingHrefs = {};
    var remaining = document.querySelectorAll('link[rel="stylesheet"]');
    for (var k = 0; k < remaining.length; k++) {
      existingHrefs[remaining[k].getAttribute('href')] = true;
    }

    for (var m = 0; m < newLinks.length; m++) {
      var href = newLinks[m].getAttribute('href');
      if (!existingHrefs[href]) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    }
  }

  function updateActiveNav(doc) {
    // Find the active nav item in the new document and mirror it here
    var newActive = doc.querySelector(".nav-links a.active");
    var currentLinks = document.querySelectorAll(".nav-links a");

    currentLinks.forEach(function (link) {
      link.classList.remove("active");
    });

    if (newActive) {
      var newHref = newActive.getAttribute("href");
      currentLinks.forEach(function (link) {
        if (link.getAttribute("href") === newHref) {
          link.classList.add("active");
        }
      });
    }
  }

  function reexecutePageScripts(doc) {
    // Each SPA navigation needs page-specific scripts to re-run.
    // We create fresh <script> elements — the browser fetches from
    // cache (fast) and re-executes the IIFE against the new DOM.
    var scripts = doc.querySelectorAll("script");

    scripts.forEach(function (oldScript) {
      var src = oldScript.getAttribute("src");

      // Skip main.js — already loaded globally and handles re-init
      if (src && src.indexOf("main.js") !== -1) return;

      // Skip CDN utility libs if their global is already loaded
      if (src && src.indexOf("cdn.jsdelivr.net") !== -1) {
        // marked → window.marked, js-yaml → window.jsyaml
        if ((src.indexOf("marked") !== -1 && window.marked) ||
            (src.indexOf("js-yaml") !== -1 && window.jsyaml)) return;
      }
      if (src && src.indexOf("unpkg.com") !== -1) {
        if (window.quicklink) return;
      }

      var newScript = document.createElement("script");

      if (src) {
        newScript.src = src;
        newScript.async = false;
        document.body.appendChild(newScript);
      } else {
        // Inline script — execute synchronously, then clean up
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
      }
    });
  }
})();
