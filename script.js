(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const themeColorMeta = document.getElementById("theme-color-meta");

  const searchInput = document.getElementById("service-search");
  const clearSearchButton = document.getElementById("clear-search");
  const emptyState = document.getElementById("empty-state");

  const searchableCards = [
    ...document.querySelectorAll("[data-search]")
  ];

  const sections = [
    ...document.querySelectorAll(".services-section")
  ];

  const THEME_KEY = "theme";

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return systemPrefersDark() ? "dark" : "light";
  }

  function applyTheme(theme, persist = false) {
    const isDark = theme === "dark";

    root.toggleAttribute("data-theme", isDark);

    if (isDark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    themeIcon.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeColorMeta.setAttribute("content", isDark ? "#11181d" : "#ffffff");

    if (persist) {
      localStorage.setItem(THEME_KEY, theme);
    }
  }

  applyTheme(getInitialTheme());

  themeToggle.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    applyTheme(nextTheme, true);
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener?.("change", (event) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  function normalizeText(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function updateSectionVisibility() {
    sections.forEach((section) => {
      const visibleCards = [
        ...section.querySelectorAll("[data-search]:not(.is-hidden)")
      ];

      section.classList.toggle("is-hidden", visibleCards.length === 0);
    });
  }

  function filterServices() {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    searchableCards.forEach((card) => {
      const searchableText = normalizeText(
        `${card.dataset.search || ""} ${card.textContent || ""}`
      );

      const matches = !query || searchableText.includes(query);

      card.classList.toggle("is-hidden", !matches);

      if (matches) {
        visibleCount += 1;
      }
    });

    updateSectionVisibility();

    emptyState.hidden = visibleCount !== 0;
    clearSearchButton.hidden = query.length === 0;
  }

  searchInput.addEventListener("input", filterServices);

  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    filterServices();
    searchInput.focus();
  });

  document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
})();
