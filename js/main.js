(function () {
  var body = document.body;
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");
  var bookingUrl = "https://provider.kareo.com/queen-alajemba#?view=booking";
  var loginUrl = "https://portal.kareo.com/app/new/login";
  var loginModal;
  var loginIframe;
  var loginCloseButton;
  var loginOpenUrl = loginUrl;

  function closeLoginModal() {
    if (!loginModal) {
      return;
    }

    loginModal.style.display = "none";
    loginModal.setAttribute("aria-hidden", "true");

    if (loginIframe) {
      loginIframe.src = "about:blank";
    }
  }

  function ensureLoginModal() {
    if (loginModal) {
      return loginModal;
    }

    loginModal = document.createElement("div");
    loginModal.setAttribute("aria-hidden", "true");
    loginModal.style.cssText = "position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(9,25,27,0.62);backdrop-filter:blur(8px);";
    loginModal.innerHTML =
      '<div style="width:min(920px,92vw);height:min(760px,88vh);background:#ffffff;border:1px solid rgba(16,35,37,0.12);border-radius:24px;box-shadow:0 30px 80px -30px rgba(9,25,27,0.7);overflow:hidden;display:grid;grid-template-rows:auto 1fr auto;"><div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border-bottom:1px solid rgba(16,35,37,0.08);background:linear-gradient(180deg,#ffffff,#f6f8f8);"><div><p style="margin:0;font-size:0.76rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--teal-700);">Patient Login</p><h2 style="margin:6px 0 0;font-family:\"Sora\",\"Trebuchet MS\",sans-serif;font-size:1.2rem;line-height:1.2;color:var(--text);">Secure portal access</h2></div><div style="display:flex;align-items:center;gap:10px;"><a href="' + loginUrl + '" target="_blank" rel="noopener" style="font-size:0.9rem;font-weight:700;color:var(--teal-900);text-decoration:none;">Open in new tab</a><button type="button" aria-label="Close login dialog" style="width:40px;height:40px;border-radius:999px;border:1px solid rgba(16,35,37,0.12);background:#ffffff;color:var(--text);font-size:1.25rem;line-height:1;cursor:pointer;">&times;</button></div></div><iframe title="Patient portal login" src="" style="width:100%;height:100%;border:0;background:#ffffff;"></iframe><div style="padding:12px 20px 18px;border-top:1px solid rgba(16,35,37,0.08);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;background:#f7faf9;"><p style="margin:0;color:var(--muted);font-size:0.92rem;">If the embedded login does not load, use the direct secure login link.</p><a href="' + loginUrl + '" target="_blank" rel="noopener" class="btn btn-soft btn-compact" style="text-decoration:none;">Open secure login</a></div></div>';

    document.body.appendChild(loginModal);
    loginIframe = loginModal.querySelector("iframe");
    loginCloseButton = loginModal.querySelector('button[aria-label="Close login dialog"]');

    loginModal.addEventListener("click", function (event) {
      if (event.target === loginModal) {
        closeLoginModal();
      }
    });

    loginCloseButton.addEventListener("click", closeLoginModal);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && loginModal && loginModal.style.display === "flex") {
        closeLoginModal();
      }
    });

    return loginModal;
  }

  function openLoginModal() {
    ensureLoginModal();
    loginIframe.src = loginOpenUrl;
    loginModal.style.display = "flex";
    loginModal.setAttribute("aria-hidden", "false");
    loginCloseButton.focus();
  }

  function createCompactLoginButton() {
    var link = document.createElement("a");
    link.href = loginUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "btn btn-ghost-light btn-compact";
    link.textContent = "Patient Login";
    return link;
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1020) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    var label = (link.textContent || "").trim().toLowerCase();
    if (label === "book appointment" || label === "book a telehealth visit") {
      link.setAttribute("href", bookingUrl);
      link.classList.add("btn-compact");
    }
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-login-launch]");
    if (trigger) {
      event.preventDefault();
      openLoginModal();
      return;
    }

    var legacyPortalLink = event.target.closest('a[href="patient-portal.html"]');
    if (legacyPortalLink) {
      event.preventDefault();
      openLoginModal();
    }
  });

  var homeHeroActions = document.querySelector("body[data-page='home'] .hero-bleed .hero-actions");
  if (homeHeroActions && !homeHeroActions.querySelector("[data-login-launch]")) {
    homeHeroActions.appendChild(createCompactLoginButton());
  }

  document.querySelectorAll(".footer-top").forEach(function (footerTop) {
    if (!footerTop.querySelector("[data-login-launch]")) {
      footerTop.appendChild(createCompactLoginButton());
    }
  });

  if (body.getAttribute("data-page") === "home") {
    var updateBookingButtonState = function () {
      body.classList.toggle("booking-button-scrolled", window.scrollY > 140);
    };

    updateBookingButtonState();
    window.addEventListener("scroll", updateBookingButtonState, { passive: true });
  }

  var page = body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
      }
    });
  }

  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  document.querySelectorAll("[data-carousel-shell]").forEach(function (shell) {
    var track = shell.querySelector("[data-carousel]");
    if (!track) {
      return;
    }

    var slides = Array.prototype.slice.call(track.children);
    if (slides.length <= 1) {
      return;
    }

    var dots = Array.prototype.slice.call(shell.querySelectorAll("[data-carousel-dot]"));
    var prevButton = shell.querySelector("[data-carousel-prev]");
    var nextButton = shell.querySelector("[data-carousel-next]");
    var current = 0;
    var timer;
    var touchStartX = 0;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + current * 100 + "%)";

      if (dots.length) {
        dots.forEach(function (dot, dotIndex) {
          var isActive = dotIndex === current;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-selected", isActive ? "true" : "false");
        });
      }
    }

    function next() {
      goTo(current + 1);
    }

    function startAuto() {
      stopAuto();
      timer = window.setInterval(next, 5200);
    }

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        goTo(current - 1);
        startAuto();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        next();
        startAuto();
      });
    }

    if (dots.length) {
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          goTo(dotIndex);
          startAuto();
        });
      });
    }

    shell.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    shell.addEventListener(
      "touchend",
      function (event) {
        var deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          goTo(deltaX < 0 ? current + 1 : current - 1);
          startAuto();
        }
      },
      { passive: true }
    );

    shell.addEventListener("mouseenter", stopAuto);
    shell.addEventListener("mouseleave", startAuto);

    goTo(0);
    startAuto();
  });

  document.querySelectorAll("[data-year]").forEach(function (item) {
    item.textContent = String(new Date().getFullYear());
  });

  var conditionForm = document.querySelector("[data-condition-form]");
  var conditionSearch = document.querySelector("[data-condition-search]");
  var conditionFeedback = document.querySelector("[data-condition-feedback]");
  var conditionSuggestions = document.querySelector("[data-condition-suggestions]");
  var highlightTimeout;

  function setConditionFeedback(message, isError) {
    if (!conditionFeedback) {
      return;
    }

    conditionFeedback.textContent = message;
    conditionFeedback.classList.toggle("is-error", Boolean(isError));
  }

  function clearHighlights() {
    document.querySelectorAll(".service-detail.is-highlight").forEach(function (section) {
      section.classList.remove("is-highlight");
    });
  }

  function highlightTarget(target) {
    clearHighlights();
    target.classList.add("is-highlight");

    if (highlightTimeout) {
      window.clearTimeout(highlightTimeout);
    }

    highlightTimeout = window.setTimeout(function () {
      target.classList.remove("is-highlight");
    }, 2800);
  }

  var suggestionCatalog = [
    {
      label: "Diagnosis & Evaluation",
      target: "#diagnosis",
      keywords: ["diagnosis", "evaluation", "assessment", "screening"],
    },
    {
      label: "Anxiety or Depression",
      target: "#diagnosis",
      keywords: ["anxiety", "depression", "panic", "mood"],
    },
    {
      label: "ADHD Evaluation",
      target: "#diagnosis",
      keywords: ["adhd", "attention", "focus", "hyper"],
    },
    {
      label: "Schizophrenia Support",
      target: "#medication",
      keywords: ["schizophrenia", "psychosis", "schiz", "schizo"],
    },
    {
      label: "Medication Management",
      target: "#medication",
      keywords: ["medication", "medication management", "med management", "meds", "prescription", "antidepressant", "antipsychotic", "stimulant", "injectable"],
    },
    {
      label: "Therapy (CBT, DBT)",
      target: "#therapy",
      keywords: ["therapy", "psychotherapy", "counseling", "cbt", "dbt", "act", "ipt"],
    },
    {
      label: "Trauma or Grief Therapy",
      target: "#therapy",
      keywords: ["trauma", "ptsd", "grief"],
    },
    {
      label: "Family or Group Therapy",
      target: "#therapy",
      keywords: ["family", "group", "relationship"],
    },
    {
      label: "Substance Use Recovery",
      target: "#substance-use",
      keywords: ["substance", "addiction", "alcohol", "opioid", "mat", "suboxone", "subutex", "naltrexone", "vivitrol", "acamprosate", "antabuse", "methadone", "recovery", "sud"],
    },
    {
      label: "Sleep or Eating Concerns",
      target: "#diagnosis",
      keywords: ["sleep", "insomnia", "eating", "appetite"],
    },
    {
      label: "Weight Loss Management",
      target: "#wellness",
      keywords: ["weight", "weight loss", "nutrition", "diet", "metabolic", "exercise"],
    },
    {
      label: "Postpartum Weight Management",
      target: "#wellness",
      keywords: ["postpartum", "after pregnancy", "new mom", "maternal", "postnatal"],
    },
    {
      label: "Onsite Laboratory Testing",
      target: "#wellness",
      keywords: ["lab", "laboratory", "blood work", "metabolic panel", "cholesterol", "screening"],
    },
    {
      label: "Drug Testing Services",
      target: "#wellness",
      keywords: ["drug test", "drug testing", "toxicology", "employment"],
    },
    {
      label: "DNA Med Match",
      target: "#wellness",
      keywords: ["dna", "genetic", "med match", "pharmacogenomic", "gene"],
    },
    {
      label: "Neurotransmitter Testing",
      target: "#wellness",
      keywords: ["neurotransmitter", "serotonin", "dopamine", "norepinephrine"],
    },
    {
      label: "Onsite Primary Care",
      target: "#wellness",
      keywords: ["primary care", "checkup", "vaccination", "hypertension", "diabetes", "asthma", "wellness"],
    },
  ];

  function getSuggestionMatches(query) {
    var value = query.trim().toLowerCase();
    if (!value) {
      return [];
    }

    return suggestionCatalog
      .map(function (item, index) {
        var score = 0;
        var label = item.label.toLowerCase();

        if (label.indexOf(value) !== -1) {
          score = Math.max(score, 1);
        }

        item.keywords.forEach(function (keyword) {
          if (keyword.indexOf(value) === 0 || value.indexOf(keyword) === 0) {
            score = Math.max(score, 3);
          } else if (keyword.indexOf(value) !== -1 || value.indexOf(keyword) !== -1) {
            score = Math.max(score, 2);
          }
        });

        return { item: item, score: score, index: index };
      })
      .filter(function (match) {
        return match.score > 0;
      })
      .sort(function (a, b) {
        if (b.score === a.score) {
          return a.index - b.index;
        }
        return b.score - a.score;
      })
      .slice(0, 6)
      .map(function (match) {
        return match.item;
      });
  }

  function renderSuggestions(matches) {
    if (!conditionSuggestions) {
      return;
    }

    conditionSuggestions.innerHTML = "";
    if (!matches.length) {
      conditionSuggestions.classList.remove("is-open");
      conditionSuggestions.setAttribute("aria-hidden", "true");
      return;
    }

    matches.forEach(function (match) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "search-suggestion";
      button.textContent = match.label;
      button.setAttribute("data-target", match.target);
      conditionSuggestions.appendChild(button);
    });

    conditionSuggestions.classList.add("is-open");
    conditionSuggestions.setAttribute("aria-hidden", "false");
  }

  function findServiceTarget(query) {
    var matches = getSuggestionMatches(query);
    return matches.length ? matches[0].target : null;
  }

  if (conditionForm && conditionSearch) {
    conditionForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var query = conditionSearch.value.trim();
      if (!query) {
        setConditionFeedback("", false);
        renderSuggestions([]);
        return;
      }

      var suggestionMatches = getSuggestionMatches(query);
      var targetId = findServiceTarget(query);
      if (!targetId) {
        setConditionFeedback("Not seeing that exact term. Try one of these sections: Diagnosis, Medication, Therapy, Substance Use, or Wellness.", true);
        renderSuggestions([]);
        return;
      }

      var target = document.querySelector(targetId);
      if (target) {
        setConditionFeedback("", false);
        renderSuggestions(suggestionMatches);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        highlightTarget(target);
      } else {
        setConditionFeedback("Not seeing that exact term. Try one of these sections: Diagnosis, Medication, Therapy, Substance Use, or Wellness.", true);
        renderSuggestions([]);
      }
    });

    conditionSearch.addEventListener("input", function () {
      setConditionFeedback("", false);
      renderSuggestions(getSuggestionMatches(conditionSearch.value));
    });

    conditionSearch.addEventListener("blur", function () {
      window.setTimeout(function () {
        renderSuggestions([]);
      }, 120);
    });

    if (conditionSuggestions) {
      conditionSuggestions.addEventListener("click", function (event) {
        var button = event.target.closest(".search-suggestion");
        if (!button) {
          return;
        }

        var targetId = button.getAttribute("data-target");
        if (!targetId) {
          return;
        }

        conditionSearch.value = button.textContent;
        setConditionFeedback("", false);
        renderSuggestions([]);

        var target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          highlightTarget(target);
        }
      });
    }
  }
})();
