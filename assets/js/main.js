/* ============================================================
   ApnaThikana — shared site JS
   - Mobile nav, scroll reveal, inline SVG icons
   - Functional forms (localStorage "fake backend" + optional endpoint)
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ----------------------------------------------------------
     Site config — customize here
     ---------------------------------------------------------- */
  window.ApnaThikana = window.ApnaThikana || {
    // Set to a real URL (e.g. your API or a Formspree endpoint) to POST
    // submissions there. Leave "" to keep everything client-side.
    endpoint: "",
    // Keep submissions in localStorage as a lightweight fake backend.
    storeLocal: true,
  };

  var STORAGE_KEY = "apnathikana.submissions.v1";

  /* ----------------------------------------------------------
     Inline SVG icons (lucide-style strokes)
     ---------------------------------------------------------- */
  var FILLED = new Set(["star"]);

  var ICONS = {
    "arrow-right": 'M5 12h14m-6-6 6 6-6 6',
    "check": 'm5 12.5 4.5 4.5L19 7.5',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    "shield-check": '<path d="M12 3l7 3v5.5c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6l7-3Z"/><path d="m9 11.5 2 2 4-4.5"/>',
    "wallet": '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2"/><path d="M3 7h18a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3"/><path d="M16.5 12h.01"/>',
    "star": 'M12 3.5 14.8 9l6 .7-4.4 4.2 1.2 5.9L12 16.9 6.4 19.8l1.2-5.9L3.2 9.7l6-.7L12 3.5Z',
    "home": '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1V9.5Z"/>',
    "utensils": '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    "bed-double": '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 17h20"/>',
    "fridge": '<path d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M5 9h14"/><path d="M9 12v3"/>',
    "sofa": '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 1 1 4 0v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z"/><path d="M6 19.5v.5M18 19.5v.5"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    "user": '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-3.5 3.4-5.5 7.5-5.5s6.7 2 7.5 5.5"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4"/><path d="M17.7 15.2c1.4.9 2.3 2.4 2.7 4.8"/>',
    "graduation-cap": '<path d="M22 9.5 12 4.5 2 9.5l10 5 10-5Z"/><path d="M6.5 12v4.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V12"/><path d="M22 9.5V15"/>',
    "briefcase": '<rect x="3" y="7.5" width="18" height="13" rx="2"/><path d="M9 7.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5"/><path d="M3 12.5h18"/>',
    "map-pin": '<path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    "key": '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 8.3-8.3"/><path d="m15 8 3 3"/><path d="m13 10 2 2"/>',
    "scan-line": '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    "building": '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    "store": '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M5 12v8h14v-8"/><path d="M9 20v-5h6v5"/>',
    "truck": '<path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    "badge-check": '<path d="M12 3.5 14 4.6l2.3-.3.8 2.2 2 1.2-.5 2.3.5 2.3-2 1.2-.8 2.2-2.3-.3-2 1.1-2-1.1-2.3.3-.8-2.2-2-1.2.5-2.3L2.5 10l2-1.2.8-2.2 2.3.3L10 3.5h2Z"/><path d="m9 12 2 2 4-4.5"/>',
    "id-card": '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11.5" r="2.2"/><path d="M5.5 16.5c.5-1.5 1.6-2.2 3-2.2s2.5.7 3 2.2"/><path d="M14 9.5h5M14 13h5M14 16.5h3"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"/>',
    "zap": 'M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z',
    "banknote": '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v.01M18 14.5v.01"/>',
    "trending-up": '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    "percent": '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m18 6-12 12"/>',
    "rotate-cw": '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 4v5h-5"/>',
    "clipboard-list": '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a2 2 0 0 1 4 0"/><path d="M9 10h6M9 14h6M9 18h3"/>',
    "flag": '<path d="M5 21V4"/><path d="M5 4h11l-2 3.5 2 3.5H5"/>',
    "sparkles": '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/><path d="M19 15.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Z"/>',
    "heart": '<path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.8 3.7 4.5 7 4.5c2 0 3.6 1.1 5 2.9 1.4-1.8 3-2.9 5-2.9 3.3 0 5.6 3.3 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "phone": '<path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    "send": '<path d="M21 3 10.5 13.5"/><path d="M21 3l-6.5 18-4-7.5L3 9.5 21 3Z"/>',
    "message-circle": '<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5Z"/>',
    "instagram": '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.55" fill="currentColor" stroke="none"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M8 10.5V17M8 7.5v.01M12 17v-4a2.5 2.5 0 0 1 5 0v4"/><path d="M12 13v-2.5"/>',
    "twitter": '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
  };

  function iconSvg(name) {
    var d = ICONS[name];
    if (!d) return "";
    var filled = FILLED.has(name);
    var attrs = filled
      ? 'fill="currentColor" stroke="none"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" ' +
      attrs +
      ">" +
      d +
      "</svg>"
    );
  }

  document.querySelectorAll("[data-icon]").forEach(function (el) {
    el.innerHTML = iconSvg(el.getAttribute("data-icon"));
  });

  /* ----------------------------------------------------------
     Sticky header shadow
     ---------------------------------------------------------- */
  var nav = document.getElementById("siteNav");

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     Mobile nav toggle
     ---------------------------------------------------------- */
  var toggle = document.getElementById("navToggle");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ----------------------------------------------------------
     Smooth scroll for same-page anchors
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ----------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var delay = 0;
    group.querySelectorAll(".reveal").forEach(function (el) {
      el.style.transitionDelay = delay + "ms";
      delay += 90;
    });
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------
     Forms — waitlist, partner, contact
     ---------------------------------------------------------- */
  var SUCCESS = {
    waitlist: {
      title: "You're on the list!",
      text: "Thanks for joining the ApnaThikana waitlist. We'll email you as soon as the Pune pilot opens for early access.",
      btnText: "Joining…",
    },
    partner: {
      title: "Application received!",
      text: "Thanks for your interest in partnering with us. Our team will get back to you within 48 hours.",
      btnText: "Sending…",
    },
    contact: {
      title: "Message sent!",
      text: "Thanks for reaching out. We usually reply within 48 hours.",
      btnText: "Sending…",
    },
  };

  function readStorage() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      return [];
    }
  }

  function storeSubmission(type, data) {
    if (!window.ApnaThikana.storeLocal) return;
    var all = readStorage();
    all.push({ type: type, submittedAt: new Date().toISOString(), data: data });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (err) {
      /* storage full or blocked — ignore, form still succeeds */
    }
  }

  function showSuccess(form, type) {
    var msg = SUCCESS[type] || SUCCESS.contact;
    form.innerHTML =
      '<div class="form-success">' +
      '<div data-icon="check-circle"></div>' +
      "<h3>" +
      msg.title +
      "</h3>" +
      "<p>" +
      msg.text +
      "</p></div>";
    // render the injected icon
    var iconHost = form.querySelector('[data-icon="check-circle"]');
    if (iconHost) iconHost.innerHTML = iconSvg("check-circle");
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var type = form.getAttribute("data-form");
      var msg = SUCCESS[type] || SUCCESS.contact;

      // Honeypot: bots fill this hidden field — silently "succeed" without storing
      var honeypot = form.querySelector(".hp");
      if (honeypot && honeypot.value) {
        showSuccess(form, type);
        return;
      }

      if (!form.reportValidity()) return;

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (key !== "company") data[key] = value;
      });

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = msg.btnText;
      }

      // POST to a real endpoint if configured
      var endpoint = window.ApnaThikana.endpoint;
      var post = endpoint
        ? fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: type, ...data }),
          }).catch(function () {})
        : Promise.resolve();

      post.then(function () {
        storeSubmission(type, data);
        showSuccess(form, type);
      });
    });
  });

  /* ----------------------------------------------------------
     Preselect waitlist role from ?role= (e.g. contact.html?role=student)
     ---------------------------------------------------------- */
  var roleParam = new URLSearchParams(window.location.search).get("role");
  if (roleParam) {
    var roleSelect = document.getElementById("waitlistRole");
    if (roleSelect) {
      var value = String(roleParam).toLowerCase();
      var match = "student";
      if (value.indexOf("working") > -1) match = "working-professional";
      else if (value.indexOf("hostel") > -1) match = "hostel-owner";
      else if (value.indexOf("mess") > -1) match = "mess-operator";
      else if (value.indexOf("furniture") > -1) match = "furniture-owner";
      else if (value.indexOf("other") > -1) match = "other";
      else if (value.indexOf("student") > -1 || value === "") match = "student";

      Array.prototype.forEach.call(roleSelect.options, function (opt) {
        if (opt.value === match) roleSelect.value = match;
      });
    }
  }
})();