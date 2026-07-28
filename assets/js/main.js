/**
 * Design Saga — shared site scripts
 * Back-to-top (all pages) + "like" facts (homepage only)
 */
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    initBackToTop();
    initLikeFacts();
    initAccordion();
  }

  // ── Back to top ────────────────────────────────────────────
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;

    btn.style.display = "block";
    btn.style.opacity = "0";

    window.addEventListener("scroll", function () {
      btn.style.opacity = window.scrollY > window.innerHeight * 0.4 ? "1" : "0";
    });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0 });
    });
  }

  // ── Accordion ────────────────────────────────────────────────
  function initAccordion() {
    var headers = document.querySelectorAll(".accordion-header");
    if (!headers.length) return;

    // Open first item by default
    var first = headers[0];
    first.setAttribute("aria-expanded", "true");
    first.nextElementSibling.classList.add("open");

    headers.forEach(function (header) {
      header.addEventListener("click", function () {
        var expanded = header.getAttribute("aria-expanded") === "true";
        var panel = header.nextElementSibling;

        // close all panels
        headers.forEach(function (h) {
          h.setAttribute("aria-expanded", "false");
          h.nextElementSibling.classList.remove("open");
        });

        // open clicked one if it was closed
        if (!expanded) {
          header.setAttribute("aria-expanded", "true");
          panel.classList.add("open");
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

    el.addEventListener("click", pick);
  }
})();
