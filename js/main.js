(function () {
  var body = document.body;
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

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
